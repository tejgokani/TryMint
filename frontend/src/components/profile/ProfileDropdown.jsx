import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Copy, LogOut } from 'lucide-react'
import CopyButton from '../common/CopyButton'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    // Close dropdown on Escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleCopy = () => {
    // Dropdown will close after copy (handled by CopyButton's timeout)
    setTimeout(() => {
      setIsOpen(false)
    }, 2100) // Slightly after the "Copied!" tooltip disappears
  }

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-[#1f2937] rounded-lg text-sm font-medium text-gray-300 hover:border-[#00ff88] hover:text-[#00ff88] transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
          <User className="w-4 h-4 text-[#00ff88]" />
        </div>
        <span>{user.name || 'Profile'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-[280px] bg-[#111827] border border-[#1f2937] rounded-lg shadow-2xl z-50 animate-slide-down"
        >
          <div className="p-4 space-y-4">
            {/* Profile Info Section */}
            <div className="space-y-3 pb-4 border-b border-[#1f2937]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-[#00ff88]/20 text-[#00ff88] text-xs font-medium rounded">
                  {user.role || 'Developer'}
                </span>
              </div>
            </div>

            {/* License Information Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                LICENSE ID
              </label>
              <div className="flex items-center gap-2 p-2 bg-[#0a0f1a] rounded border border-[#1f2937]">
                <code className="flex-1 text-sm text-[#00ff88] font-mono truncate">
                  {user.licenseId || 'LIC-XXXX-XXXX-XXXX-XXXX-XXXX'}
                </code>
                <CopyButton
                  text={user.licenseId || 'LIC-XXXX-XXXX-XXXX-XXXX-XXXX'}
                  onCopy={handleCopy}
                />
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-[#1f2937]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1f2937] rounded transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
