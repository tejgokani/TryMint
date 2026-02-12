import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PackageScanReport from '../components/scan/PackageScanReport'
import Spinner from '../components/common/Spinner'
import { api } from '../services/api'
import { Search, Shield, ArrowRight, Package, Terminal, AlertCircle, X } from 'lucide-react'
import { handleError } from '../utils/errorHandler'

export default function ScanPackage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showError, showSuccess } = useToast()
  const [packageInput, setPackageInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [backendDown, setBackendDown] = useState(false)
  const [backendCheckDone, setBackendCheckDone] = useState(false)
  const resultsRef = useRef(null)

  const DEMO_PACKAGES = ['express', 'lodash', 'chalk']

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  useEffect(() => {
    api.checkHealth()
      .then(() => {
        setBackendDown(false)
      })
      .catch(() => {
        setBackendDown(true)
      })
      .finally(() => {
        setBackendCheckDone(true)
      })
  }, [])

  const handleScan = async (e, overridePackage) => {
    e?.preventDefault()
    const spec = (overridePackage ?? packageInput).trim()
    if (!spec) {
      showError('Enter a package name (e.g. express, lodash)')
      return
    }

    setIsScanning(true)
    setResult(null)
    if (overridePackage) setPackageInput(overridePackage)

    try {
      const res = await api.scanPackage(spec)
      if (res?.success && res?.data) {
        setResult(res.data)
        showSuccess('Scan complete')
      } else {
        showError('Scan failed')
      }
    } catch (err) {
      handleError(err, showError)
    } finally {
      setIsScanning(false)
    }
  }

  const handleQuickScan = (pkg) => {
    setPackageInput(pkg)
    handleScan(null, pkg)
  }

  const handleSandboxClick = () => {
    if (isAuthenticated) {
      navigate('/start-session')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Navbar />

      {backendCheckDone && backendDown && (
        <div className="sticky top-0 z-40 bg-amber-500/20 border-b border-amber-500/40 text-amber-200 px-4 py-3 flex items-center justify-center gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">Backend not reachable. Run: <code className="bg-black/30 px-2 py-0.5 rounded font-mono text-xs">cd backend && npm run dev</code></span>
          <button onClick={() => setBackendDown(false)} className="p-1 hover:bg-amber-500/20 rounded" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            X-Ray Your Packages Before They Infect Your Code
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Scan npm Packages
          </h1>
          <p className="text-base text-gray-400 mb-6">
            Paste any package name. We analyze dependencies, install scripts, network behavior, and security risks—no installation required.
          </p>

          {/* Scan Input */}
          <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={packageInput}
                onChange={(e) => setPackageInput(e.target.value)}
                placeholder="express, lodash, @babel/core..."
                className="w-full pl-12 pr-4 py-3 bg-[#111827] border border-[#1f2937] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/30"
                disabled={isScanning}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 bg-[#00ff88] text-[#0a0f1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#00e67a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {isScanning ? (
                <>
                  <Spinner size="sm" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan Package
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-sm text-gray-500 self-center">Quick scan:</span>
            {DEMO_PACKAGES.map((pkg) => (
              <button
                key={pkg}
                type="button"
                onClick={() => handleQuickScan(pkg)}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1f2937] text-gray-300 hover:bg-[#00ff88]/20 hover:text-[#00ff88] border border-[#1f2937] hover:border-[#00ff88]/30 transition-colors disabled:opacity-50"
              >
                {pkg}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="mt-8 animate-fade-in">
            <PackageScanReport result={result} />
          </div>
        )}

        {/* CTA - Full Sandbox */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-xl bg-[#111827] border border-[#1f2937]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Need full terminal access?</div>
                <div className="text-sm text-gray-400">Launch sandbox to run packages with real-time monitoring</div>
              </div>
            </div>
            <button
              onClick={handleSandboxClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/30 transition-colors font-medium whitespace-nowrap"
            >
              Launch Sandbox
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
