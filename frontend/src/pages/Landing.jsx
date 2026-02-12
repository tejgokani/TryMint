import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Play, 
  Shield, 
  Search, 
  CheckCircle, 
  Lock, 
  Zap, 
  FileText, 
  Terminal,
  Code,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  ChevronDown
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useCallback, useEffect, useState } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScanClick = useCallback(() => {
    navigate('/scan')
  }, [navigate])

  const handleSandboxClick = useCallback(() => {
    if (isAuthenticated) {
      navigate('/start-session')
    } else {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00ff88] focus:text-[#0a0f1a] focus:rounded">
        Skip to main content
      </a>
      <Navbar />
      
      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.05}px)` }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 glass-light rounded-full text-sm font-medium text-[#00ff88] border border-[#00ff88]/30">
                    VirusTotal for npm packages
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  X-Ray Your Packages Before They Infect Your Code
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Supply chain attacks are up 742%. TRYMINT runs packages in a sandbox, monitors behavior—file access, network calls, env vars—and gives you a risk score before you install or publish.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleScanClick}
                  className="group inline-flex items-center justify-center gap-2 bg-[#00ff88] text-[#0a0f1a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00e67a] transition-all duration-200 transform hover:scale-105 shadow-lg shadow-[#00ff88]/30 min-h-[56px]"
                >
                  <Search className="w-5 h-5" />
                  Scan Package
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleSandboxClick}
                  className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-lg font-semibold text-lg hover:glass-strong transition-all duration-200 min-h-[56px]"
                >
                  <Play className="w-5 h-5" />
                  Launch Sandbox
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-lg font-semibold text-lg hover:glass-strong transition-all duration-200 min-h-[56px]"
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="glass-light rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#00ff88]">742%</div>
                  <div className="text-sm text-gray-400 mt-1">Supply chain attacks ↑</div>
                </div>
                <div className="glass-light rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#00ff88]">30s</div>
                  <div className="text-sm text-gray-400 mt-1">Scan time</div>
                </div>
                <div className="glass-light rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#00ff88]">0</div>
                  <div className="text-sm text-gray-400 mt-1">Installation needed</div>
                </div>
              </div>
            </div>

            {/* Right Side - Terminal Demo */}
            <div className="hidden lg:block relative">
              <div className="glass-strong rounded-xl border border-white/10 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                {/* Terminal Header */}
                <div className="bg-[#1f2937]/80 backdrop-blur-sm px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400 ml-4">trymint-sandbox</span>
                </div>
                
                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm bg-[#0a0f1a]/50">
                  <div className="space-y-2 text-gray-300">
                    <div className="text-[#00ff88]">$ trymint scan express</div>
                    <div className="text-gray-400">&gt; Fetching package metadata from npm...</div>
                    <div className="text-gray-400">&gt; Analyzing dependencies (47 packages)</div>
                    <div className="text-gray-400">&gt; Checking install scripts...</div>
                    <div className="text-gray-400">&gt; Scanning for behavioral patterns...</div>
                    <div className="text-[#00ff88] mt-2">✓ Scan complete</div>
                    <div className="text-white mt-2">Risk Score: <span className="text-[#00ff88]">2/10</span> (LOW)</div>
                    <div className="text-white">Dependency Risk: <span className="text-[#00ff88]">4</span>/10</div>
                    <div className="text-white">Network Risk: <span className="text-[#00ff88]">0</span>/10</div>
                    <div className="text-[#00ff88] mt-2">$</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="glass-light rounded-full p-3 hover:glass transition-all"
              aria-label="Scroll to content"
            >
              <ChevronDown className="w-6 h-6 text-[#00ff88]" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How TRYMINT Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload → Sandbox → Analyze → Report. Know what you're shipping before you ship it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass rounded-xl p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#00ff88]" />
              </div>
              <div className="text-3xl font-bold text-[#00ff88] mb-2">1</div>
              <h3 className="text-xl font-semibold mb-3">Scan Package</h3>
              <p className="text-gray-400">
                Paste any npm package name or URL. No signup required. Get instant risk analysis in seconds.
              </p>
            </div>

            <div className="glass rounded-xl p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-[#00ff88]" />
              </div>
              <div className="text-3xl font-bold text-[#00ff88] mb-2">2</div>
              <h3 className="text-xl font-semibold mb-3">Behavioral Analysis</h3>
              <p className="text-gray-400">
                We analyze dependencies, install scripts, network patterns, and file system behavior—no execution needed for basic scan.
              </p>
            </div>

            <div className="glass rounded-xl p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#00ff88]" />
              </div>
              <div className="text-3xl font-bold text-[#00ff88] mb-2">3</div>
              <h3 className="text-xl font-semibold mb-3">Risk Report</h3>
              <p className="text-gray-400">
                Get a risk score (0–100), CRITICAL/HIGH/MEDIUM/LOW findings, and actionable recommendations. Launch sandbox for full execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to safely test and install packages
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-8 hover:glass-strong transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Isolation</h3>
              <p className="text-gray-400 leading-relaxed">
                Packages run in a completely isolated sandbox environment. No changes are made to your local system until you explicitly approve them.
              </p>
            </div>

            <div className="glass rounded-xl p-8 hover:glass-strong transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Behavioral Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced monitoring tracks file system modifications, network requests, dependency installations, and security risks in real-time.
              </p>
            </div>

            <div className="glass rounded-xl p-8 hover:glass-strong transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Scoring</h3>
              <p className="text-gray-400 leading-relaxed">
                Get comprehensive risk scores (0-10) based on package behavior. Low scores indicate safe packages, high scores require caution.
              </p>
            </div>

            <div className="glass rounded-xl p-8 hover:glass-strong transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Approval</h3>
              <p className="text-gray-400 leading-relaxed">
                Review detailed reports with file change summaries and warnings before approving. Reject packages that don't meet your security standards.
              </p>
            </div>

            <div className="glass rounded-xl p-8 hover:glass-strong transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
              <p className="text-gray-400 leading-relaxed">
                Watch package installation and execution in real-time. See exactly what files are modified and what network requests are made.
              </p>
            </div>

            <div className="glass rounded-xl p-8 hover:glass-strong transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 glass-green rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Session Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Create multiple sessions, manage active sessions, and track session history. Sessions automatically expire after the set duration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Use TRYMINT?</h2>
              <div className="space-y-6">
                <div className="glass rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 glass-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Protect Your System</h3>
                      <p className="text-gray-400">
                        Prevent malicious packages from modifying your files, accessing sensitive data, or making unauthorized network requests.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 glass-green rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Avoid Surprises</h3>
                      <p className="text-gray-400">
                        Know exactly what a package will do before installing it. See all file changes, new dependencies, and potential security risks upfront.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 glass-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                      <p className="text-gray-400">
                        Test packages quickly without setting up separate environments or virtual machines. Get results in minutes, not hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Key Capabilities</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Isolated sandbox environment for each session</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Real-time file system change tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Network request monitoring and logging</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Dependency analysis and risk assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Detailed risk reports with actionable insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Session-based credential management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">CLI integration for seamless workflow</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="glass-strong rounded-2xl p-12 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join developers who are protecting their systems with TRYMINT. Start testing packages safely today.
            </p>
            <button
              onClick={handleScanClick}
              className="group inline-flex items-center gap-2 bg-[#00ff88] text-[#0a0f1a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00e67a] transition-all duration-200 transform hover:scale-105 shadow-lg shadow-[#00ff88]/30 min-h-[56px]"
            >
              <Search className="w-5 h-5" />
              Scan Package Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
