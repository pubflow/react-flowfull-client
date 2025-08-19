import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth, useTheme } from '@pubflow/react'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const theme = useTheme()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.backgroundColor,
      color: theme.textPrimary
    }}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#282c34',
        color: '#ffffff',
        fontSize: 'calc(10px + 2vmin)',
        textAlign: 'center',
        padding: theme.spacing.lg
      }}>
        <img
          src={logo}
          style={{
            height: '40vmin',
            pointerEvents: 'none',
            animation: 'spin 20s linear infinite'
          }}
          alt="logo"
        />
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          margin: `${theme.spacing.xl} 0 ${theme.spacing.lg} 0`,
          color: theme.primaryColor
        }}>
          Welcome to {theme.appName}
        </h1>
        <p style={{
          fontSize: '18px',
          margin: `0 0 ${theme.spacing.xl} 0`,
          color: '#ffffff',
          maxWidth: '600px'
        }}>
          A modern web application built with TanStack Start and Pubflow framework.
          Get started by signing in or creating a new account.
        </p>

        <div style={{
          display: 'flex',
          gap: theme.spacing.md,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate({
              to: '/login',
              search: { message: undefined, redirect: undefined }
            })}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              backgroundColor: theme.primaryColor,
              color: '#ffffff',
              border: 'none',
              borderRadius: theme.borderRadius.medium,
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => navigate({ to: '/register' })}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              backgroundColor: 'transparent',
              color: theme.primaryColor,
              border: `2px solid ${theme.primaryColor}`,
              borderRadius: theme.borderRadius.medium,
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{
          marginTop: theme.spacing.xl,
          display: 'flex',
          gap: theme.spacing.lg,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <a
            style={{
              color: '#61dafb',
              textDecoration: 'none',
              fontSize: '14px'
            }}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <a
            style={{
              color: '#61dafb',
              textDecoration: 'none',
              fontSize: '14px'
            }}
            href="https://tanstack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TanStack
          </a>
          <a
            style={{
              color: '#61dafb',
              textDecoration: 'none',
              fontSize: '14px'
            }}
            href="https://github.com/pubflow"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Pubflow
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
