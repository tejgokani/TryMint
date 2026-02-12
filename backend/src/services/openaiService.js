/**
 * OpenAI service for TRYMINT AI summaries.
 * Token-optimized: minimal prompts, max_tokens cap. On-demand only.
 */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini'; // Cost-efficient
const MAX_OUTPUT_TOKENS = 120; // 60-80 words ≈ 80-120 tokens
const TIMEOUT_MS = 10000;

/**
 * Generate a 60-80 word concise AI summary for a package scan.
 * @param {Object} params - { package, totalScore, riskLevel, components }
 * @returns {Promise<{ summary: string|null, error: string|null }>}
 */
export async function generatePackageInsight({ package: pkg, totalScore, riskLevel, components }) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { summary: null, error: 'OPENAI_API_KEY not set in backend .env' };
  }

  const sys = 'Summarize npm package security in 60-80 words. Be concise. Focus on risk and suitability.';
  const user = `Package: ${pkg}. Score: ${totalScore}/100 (${riskLevel}). Dependencies: ${components?.dependency ?? 0}/25, Destructive: ${components?.destructiveness ?? 0}/25, Behavioral: ${components?.behavioral ?? 0}/25, Network: ${components?.network ?? 0}/25.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user },
        ],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.3,
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      const errText = await res.text();
      try {
        const errBody = JSON.parse(errText);
        errMsg = errBody?.error?.message || errBody?.error?.code || errMsg;
      } catch {
        if (errText) errMsg = errText.slice(0, 120);
      }
      return { summary: null, error: errMsg };
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) return { summary: null, error: 'No content in OpenAI response' };

    return { summary: text, error: null };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err.name === 'AbortError' ? 'Request timeout' : (err.message || 'Network error');
    return { summary: null, error: msg };
  }
}
