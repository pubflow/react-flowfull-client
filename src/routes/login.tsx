/**
 * Login Route for TanStack Start
 * 
 * Implements login functionality using Pubflow React components
 */

import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LoginForm, useAuth, OfflineIndicator } from '@pubflow/react'
import { PUBFLOW_CONFIG, getRedirectUrl } from '../lib/pubflow-config'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      message: (search.message as string) || undefined,
      redirect: (search.redirect as string) || undefined,
    }
  },
})

function LoginPage() {
  const navigate = useNavigate()
  const { message, redirect } = useSearch({ from: '/login' })
  const { isAuthenticated, user } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = redirect || getRedirectUrl()
      navigate({ to: redirectUrl })
    }
  }, [isAuthenticated, user, navigate, redirect])

  // Show success message if provided
  useEffect(() => {
    if (message) {
      // Show success message (you can replace this with a toast notification)
      setTimeout(() => {
        alert(message)
      }, 100)
    }
  }, [message])

  // Handle successful login
  const handleLoginSuccess = (user: any) => {
    console.log('Login successful:', user)
    const redirectUrl = getRedirectUrl()
    navigate({ to: redirectUrl })
  }

  // Handle login error
  const handleLoginError = (error: string) => {
    console.error('Login error:', error)
  }

  // Handle password reset
  const handlePasswordReset = () => {
    navigate({
      to: '/forgot-password',
      search: { token: undefined } // Token is optional
    })
  }

  // Handle account creation
  const handleAccountCreation = () => {
    navigate({ to: '/register' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '24px'
    }}>
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Login Form */}
      <LoginForm
        config={{
          primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
          secondaryColor: PUBFLOW_CONFIG.SECONDARY_COLOR,
          appName: PUBFLOW_CONFIG.APP_NAME,
          logo: PUBFLOW_CONFIG.APP_LOGO,
          showPasswordReset: true,
          showAccountCreation: true,
          redirectPath: getRedirectUrl()
        }}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        onPasswordReset={handlePasswordReset}
        onAccountCreation={handleAccountCreation}
      />
    </div>
  )
}
