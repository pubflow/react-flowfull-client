/**
 * Forgot Password Route for TanStack Start
 * 
 * Implements password reset functionality using Pubflow React components
 */

import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { PasswordResetForm, OfflineIndicator } from '@pubflow/react'
import { PUBFLOW_CONFIG } from '../lib/pubflow-config'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
    }
  },
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/forgot-password' })
  
  // Handle successful password reset
  const handleSuccess = () => {
    console.log('Password reset successful')
    // Navigate to login with success message
    navigate({ 
      to: '/login',
      search: { message: 'Password reset successful. Please log in with your new password.' }
    })
  }
  
  // Handle password reset error
  const handleError = (error: string) => {
    console.error('Password reset error:', error)
  }
  
  // Handle back to login
  const handleBackToLogin = () => {
    navigate({
      to: '/login',
      search: { message: undefined, redirect: undefined }
    })
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
      
      {/* Password Reset Form */}
      <PasswordResetForm
        config={{
          primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
          appName: PUBFLOW_CONFIG.APP_NAME,
          logo: PUBFLOW_CONFIG.APP_LOGO,
          apiBaseUrl: PUBFLOW_CONFIG.API_BASE_URL
        }}
        resetToken={token}
        onSuccess={handleSuccess}
        onError={handleError}
        onBackToLogin={handleBackToLogin}
      />
    </div>
  )
}
