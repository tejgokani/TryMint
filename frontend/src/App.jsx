import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SessionProvider } from './context/SessionContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import NetworkStatus from './components/common/NetworkStatus'
import PageTransition from './components/common/PageTransition'
import Spinner from './components/common/Spinner'

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const StartSession = lazy(() => import('./pages/StartSession'))
const SessionCredentials = lazy(() => import('./pages/SessionCredentials'))
const SandboxTerminal = lazy(() => import('./pages/SandboxTerminal'))
const ScanPackage = lazy(() => import('./pages/ScanPackage'))
const Docs = lazy(() => import('./pages/Docs'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SessionProvider>
          <ToastProvider>
            <NetworkStatus />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/scan" element={<ScanPackage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/sandbox" element={<Dashboard />} />
                    <Route path="/start-session" element={<StartSession />} />
                    <Route path="/session-credentials" element={<SessionCredentials />} />
                    <Route path="/sandbox-terminal" element={<SandboxTerminal />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </PageTransition>
            </Router>
          </ToastProvider>
        </SessionProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
