import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X } from 'lucide-react'
import ProfileDropdown from '../profile/ProfileDropdown'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = useCallback((path) => {
    setIsMobileMenuOpen(false)
    if (path === '/sandbox') {
      if (isAuthenticated) {
        navigate('/start-session')
      } else {
        navigate('/login')
      }
    } else {
      navigate(path)
    }
  }, [isAuthenticated, navigate])

  return (
    <nav className="bg-[#0a0f1a] border-b border-[#1f2937] sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            className="flex items-center cursor-pointer"
            aria-label="TRYMINT Home"
          >
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-[#00ff88]">TRY</span>
              <span className="text-white">MINT</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            <button
              onClick={() => navigate('/')}
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-[#00ff88]'
                  : 'text-gray-300 hover:text-white'
              }`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/scan')}
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/scan'
                  ? 'text-[#00ff88]'
                  : 'text-gray-300 hover:text-white'
              }`}
              aria-current={location.pathname === '/scan' ? 'page' : undefined}
            >
              Scan
            </button>
            <button
              onClick={() => handleNavClick('/sandbox')}
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/sandbox') || location.pathname.startsWith('/start-session')
                  ? 'text-[#00ff88]'
                  : 'text-gray-300 hover:text-white'
              }`}
              aria-current={location.pathname.startsWith('/sandbox') || location.pathname.startsWith('/start-session') ? 'page' : undefined}
            >
              Sandbox
            </button>
            <button
              onClick={() => navigate('/docs')}
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/docs'
                  ? 'text-[#00ff88]'
                  : 'text-gray-300 hover:text-white'
              }`}
              aria-current={location.pathname === '/docs' ? 'page' : undefined}
            >
              Docs
            </button>
          </div>

          {/* Desktop Login/Profile */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 border border-[#1f2937] rounded-lg text-sm font-medium text-gray-300 hover:border-[#00ff88] hover:text-[#00ff88] transition-all duration-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && <ProfileDropdown />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#1f2937] py-4 animate-slide-down">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleNavClick('/')}
                className={`text-left px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-gray-300 hover:bg-[#1f2937]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('/scan')}
                className={`text-left px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === '/scan'
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-gray-300 hover:bg-[#1f2937]'
                }`}
              >
                Scan
              </button>
              <button
                onClick={() => handleNavClick('/sandbox')}
                className={`text-left px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  location.pathname.startsWith('/sandbox') || location.pathname.startsWith('/start-session')
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-gray-300 hover:bg-[#1f2937]'
                }`}
              >
                Sandbox
              </button>
              <button
                onClick={() => handleNavClick('/docs')}
                className={`text-left px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === '/docs'
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-gray-300 hover:bg-[#1f2937]'
                }`}
              >
                Docs
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="text-left px-4 py-2 border border-[#1f2937] rounded-lg text-base font-medium text-gray-300 hover:border-[#00ff88] hover:text-[#00ff88] transition-all duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
