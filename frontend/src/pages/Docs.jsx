import { useState, useRef, useEffect } from 'react'
import {
  Book,
  Code,
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
  Search,
  Copy,
  Check,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import CopyButton from '../components/common/CopyButton'

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'installation', title: 'Installation' },
      { id: 'quick-start', title: 'Quick Start' },
    ],
  },
  {
    id: 'usage-guide',
    title: 'Usage Guide',
    icon: Code,
    items: [
      { id: 'creating-sessions', title: 'Creating Sessions' },
      { id: 'running-scans', title: 'Running Scans' },
      { id: 'understanding-reports', title: 'Understanding Reports' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code,
    items: [
      { id: 'cli-commands', title: 'CLI Commands' },
      { id: 'configuration', title: 'Configuration' },
      { id: 'environment-variables', title: 'Environment Variables' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    items: [
      { id: 'how-it-works', title: 'How It Works' },
      { id: 'best-practices', title: 'Best Practices' },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: HelpCircle,
    items: [],
  },
]

export default function Docs() {
  const [activeSection, setActiveSection] = useState('introduction')
  const [searchQuery, setSearchQuery] = useState('')
  const contentRefs = useRef({})

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && contentRefs.current[hash]) {
        setActiveSection(hash)
        contentRefs.current[hash].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    window.location.hash = sectionId
    if (contentRefs.current[sectionId]) {
      contentRefs.current[sectionId].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const CodeBlock = ({ code, language = 'bash' }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="relative group">
        <pre className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg p-4 overflow-x-auto">
          <code className="text-sm text-gray-300 font-mono">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-[#1f2937] rounded hover:bg-[#374151] transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#00ff88]" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Navbar />
      
      {/* Documentation Header */}
      <div className="bg-[#111827] border-b border-[#1f2937] px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-[#00ff88]" />
            <h1 className="text-2xl font-bold">
              <span className="text-[#00ff88]">TRY</span>
              <span className="text-white">MINT</span> Documentation
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-136px)]">
        {/* Sidebar */}
        <div data-sidebar className="hidden lg:block w-full lg:w-[250px] bg-[#111827] border-r border-[#1f2937] overflow-y-auto lg:sticky lg:top-[136px] lg:self-start">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden p-4 border-b border-[#1f2937]">
            <button
              onClick={() => {
                const sidebar = document.querySelector('[data-sidebar]')
                sidebar?.classList.toggle('hidden')
              }}
              className="w-full flex items-center justify-between px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-sm text-gray-300 hover:bg-[#1f2937] transition-colors min-h-[44px]"
            >
              <span>Navigation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-[#1f2937]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded px-8 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors min-h-[44px]"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </div>
                {section.items.length > 0 && (
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                            activeSection === item.id
                              ? 'bg-[#00ff88]/20 text-[#00ff88]'
                              : 'text-gray-300 hover:bg-[#1f2937]'
                          }`}
                        >
                          <ChevronRight className={`w-3 h-3 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {section.id === 'faq' && (
                  <button
                    onClick={() => scrollToSection('faq')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      activeSection === 'faq'
                        ? 'bg-[#00ff88]/20 text-[#00ff88]'
                        : 'text-gray-300 hover:bg-[#1f2937]'
                    }`}
                  >
                    <ChevronRight className={`w-3 h-3 ${activeSection === 'faq' ? 'opacity-100' : 'opacity-0'}`} />
                    FAQ
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-8 space-y-8 md:space-y-12">
            {/* Introduction */}
            <section
              ref={(el) => (contentRefs.current['introduction'] = el)}
              id="introduction"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Introduction</h2>
              <div className="prose prose-invert max-w-none space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-[#00ff88]">TRYMINT</strong> is a secure package management sandbox platform
                  that allows you to test npm packages in an isolated environment before installing them on your system.
                </p>
                <h3 className="text-xl font-semibold mt-6 mb-3">Why use TRYMINT?</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>Test packages safely without affecting your development environment</li>
                  <li>Analyze package behavior and detect potential security risks</li>
                  <li>Get detailed risk reports before installation</li>
                  <li>Prevent malicious packages from modifying your system</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Sandbox Simulation:</strong> Run packages in complete isolation</li>
                  <li><strong>Risk Analysis:</strong> Behavioral analysis and risk scoring</li>
                  <li><strong>Secure Approval:</strong> Review changes before installation</li>
                  <li><strong>Real-time Monitoring:</strong> Track file changes and network requests</li>
                </ul>
              </div>
            </section>

            {/* Installation */}
            <section
              ref={(el) => (contentRefs.current['installation'] = el)}
              id="installation"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Installation</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>Node.js version 18.0.0 or higher</li>
                  <li>npm version 9.0.0 or higher</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6">Installation Steps</h3>
                <CodeBlock code="npm install -g trymint" />
                <h3 className="text-xl font-semibold mt-6">Verification</h3>
                <p className="text-gray-300">Verify the installation by checking the version:</p>
                <CodeBlock code="trymint --version" />
              </div>
            </section>

            {/* Quick Start */}
            <section
              ref={(el) => (contentRefs.current['quick-start'] = el)}
              id="quick-start"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Get Your License ID</h3>
                  <p className="text-gray-300 mb-3">
                    Sign up or log in to TRYMINT to get your unique license ID. This ID is required to create sessions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Start a Session</h3>
                  <p className="text-gray-300 mb-3">
                    Use the web interface or CLI to start a new sandbox session:
                  </p>
                  <CodeBlock code={`trymint connect --session=SESS_XXXX --token=YOUR_TOKEN`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Run Your First Scan</h3>
                  <p className="text-gray-300 mb-3">
                    Install packages in the sandbox terminal:
                  </p>
                  <CodeBlock code="npm install express" />
                  <p className="text-gray-300 mt-3">
                    The system will analyze the package and provide a risk report.
                  </p>
                </div>
              </div>
            </section>

            {/* Creating Sessions */}
            <section
              ref={(el) => (contentRefs.current['creating-sessions'] = el)}
              id="creating-sessions"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Creating Sessions</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Sessions are isolated environments where you can test packages. Each session has a limited duration
                  and automatically terminates when expired.
                </p>
                <h3 className="text-xl font-semibold">Session Duration Options</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>1 hour</li>
                  <li>2 hours (default)</li>
                  <li>4 hours</li>
                  <li>8 hours</li>
                  <li>24 hours</li>
                </ul>
              </div>
            </section>

            {/* Running Scans */}
            <section
              ref={(el) => (contentRefs.current['running-scans'] = el)}
              id="running-scans"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Running Scans</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  When you install a package in the sandbox terminal, TRYMINT automatically scans and analyzes it.
                </p>
                <CodeBlock code={`npm install <package-name>`} />
                <p className="text-gray-300">
                  The scan analyzes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>File system modifications</li>
                  <li>Network requests</li>
                  <li>Dependencies added</li>
                  <li>Security risks</li>
                </ul>
              </div>
            </section>

            {/* Understanding Reports */}
            <section
              ref={(el) => (contentRefs.current['understanding-reports'] = el)}
              id="understanding-reports"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Understanding Reports</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Risk Score</h3>
                <p className="text-gray-300">
                  Risk scores range from 0-10:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><span className="text-[#00ff88]">0-3:</span> Low risk (Green) - Safe to install</li>
                  <li><span className="text-yellow-400">4-6:</span> Medium risk (Yellow) - Review carefully</li>
                  <li><span className="text-red-400">7-10:</span> High risk (Red) - Not recommended</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6">Changed Files</h3>
                <p className="text-gray-300">
                  View all files that would be modified or created by the package installation.
                </p>
                <h3 className="text-xl font-semibold mt-6">Warnings</h3>
                <p className="text-gray-300">
                  Important alerts about network requests, file system operations, and new dependencies.
                </p>
              </div>
            </section>

            {/* CLI Commands */}
            <section
              ref={(el) => (contentRefs.current['cli-commands'] = el)}
              id="cli-commands"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">CLI Commands</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">trymint connect</h3>
                  <p className="text-gray-300 mb-2">Connect to a sandbox session</p>
                  <CodeBlock code={`trymint connect --session=SESS_XXXX --token=YOUR_TOKEN [--cleanup_live_ID]`} />
                  <p className="text-gray-400 text-sm mt-2">Options:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 text-sm">
                    <li><code className="bg-[#1f2937] px-1 rounded">--session</code>: Session ID</li>
                    <li><code className="bg-[#1f2937] px-1 rounded">--token</code>: Session secret token</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">trymint scan</h3>
                  <p className="text-gray-300 mb-2">Run a package scan</p>
                  <CodeBlock code="trymint scan <package-name>" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">trymint approve</h3>
                  <p className="text-gray-300 mb-2">Approve changes and allow installation</p>
                  <CodeBlock code="trymint approve --session=SESS_XXXX" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">trymint reject</h3>
                  <p className="text-gray-300 mb-2">Reject changes and terminate session</p>
                  <CodeBlock code="trymint reject --session=SESS_XXXX" />
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section
              ref={(el) => (contentRefs.current['configuration'] = el)}
              id="configuration"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Configuration</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Session Duration Settings</h3>
                <p className="text-gray-300">
                  Configure default session duration in your settings or specify it when creating a session.
                </p>
                <h3 className="text-xl font-semibold mt-6">Risk Threshold Configuration</h3>
                <p className="text-gray-300">
                  Set custom risk thresholds for automatic approval or rejection.
                </p>
                <h3 className="text-xl font-semibold mt-6">Custom Rules</h3>
                <p className="text-gray-300">
                  Define custom rules for package analysis and risk assessment.
                </p>
              </div>
            </section>

            {/* Environment Variables */}
            <section
              ref={(el) => (contentRefs.current['environment-variables'] = el)}
              id="environment-variables"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Environment Variables</h2>
              <div className="space-y-4">
                <CodeBlock code={`TRYMINT_API_URL=http://localhost:3000/v1
TRYMINT_LICENSE_ID=LIC-XXXX-XXXX-XXXX-XXXX-XXXX
TRYMINT_SESSION_TIMEOUT=7200000`} />
                <p className="text-gray-300">
                  Set these environment variables to configure TRYMINT CLI behavior.
                </p>
              </div>
            </section>

            {/* How It Works */}
            <section
              ref={(el) => (contentRefs.current['how-it-works'] = el)}
              id="how-it-works"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  TRYMINT uses containerization and sandboxing technology to create isolated environments for package testing.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                  <li>Package installation is intercepted and redirected to the sandbox</li>
                  <li>All file system operations are monitored and logged</li>
                  <li>Network requests are tracked and analyzed</li>
                  <li>Risk analysis engine evaluates the package behavior</li>
                  <li>Detailed report is generated with risk score</li>
                  <li>User can approve or reject the installation</li>
                </ol>
              </div>
            </section>

            {/* Best Practices */}
            <section
              ref={(el) => (contentRefs.current['best-practices'] = el)}
              id="best-practices"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Best Practices</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Always review the risk report before approving installations</li>
                <li>Check changed files to understand what the package will modify</li>
                <li>Pay attention to warnings about network requests</li>
                <li>Use shorter session durations for unknown packages</li>
                <li>Keep your license ID secure and don't share it</li>
                <li>Regularly regenerate your license ID for enhanced security</li>
              </ul>
            </section>

            {/* FAQ */}
            <section
              ref={(el) => (contentRefs.current['faq'] = el)}
              id="faq"
              className="scroll-mt-8"
            >
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">What happens if I approve a package?</h3>
                  <p className="text-gray-300">
                    Approved packages are allowed to be installed on your system. The changes from the sandbox are applied to your local environment.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Can I extend a session?</h3>
                  <p className="text-gray-300">
                    Yes, you can extend a session duration if needed. Use the extend function in the session management interface.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">What if a session expires?</h3>
                  <p className="text-gray-300">
                    Expired sessions are automatically terminated. You'll need to create a new session to continue testing packages.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Is my data secure?</h3>
                  <p className="text-gray-300">
                    Yes, all sessions are encrypted and isolated. No data from sandbox sessions affects your local system until you explicitly approve changes.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
