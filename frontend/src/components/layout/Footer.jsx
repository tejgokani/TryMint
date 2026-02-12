export default function Footer() {
  return (
    <footer className="bg-[#0a0f1a] border-t border-[#1f2937] mt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 TRYMINT. Built for secure package management.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-[#00ff88] text-sm transition-colors">
              Privacy
            </button>
            <button className="text-gray-400 hover:text-[#00ff88] text-sm transition-colors">
              Terms
            </button>
            <button className="text-gray-400 hover:text-[#00ff88] text-sm transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
