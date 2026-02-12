import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text, onCopy, ...props }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (onCopy) {
        onCopy()
      }
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-[#1f2937] rounded transition-colors"
      {...props}
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#00ff88]" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400 hover:text-[#00ff88] transition-colors" />
      )}
    </button>
  )
}
