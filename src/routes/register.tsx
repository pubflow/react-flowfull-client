/**
 * Register Route for TanStack Start
 * 
 * Implements account creation functionality using Pubflow React components
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AccountCreationForm, OfflineIndicator } from '@pubflow/react'
import { PUBFLOW_CONFIG } from '../lib/pubflow-config'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  
  // Handle successful account creation
  const handleSuccess = () => {
    console.log('Account creation successful')
    // Navigate to login with success message
    navigate({ 
      to: '/login',
      search: { message: 'Account created successfully. Please log in with your new credentials.' }
    })
  }
  
  // Handle account creation error
  const handleError = (error: string) => {
    console.error('Account creation error:', error)
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
      
      {/* Account Creation Form */}
      <AccountCreationForm
        config={{
          primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
          appName: PUBFLOW_CONFIG.APP_NAME,
          logo: PUBFLOW_CONFIG.APP_LOGO,
          apiBaseUrl: PUBFLOW_CONFIG.API_BASE_URL,
          requiredFields: ['name', 'lastName', 'email', 'password']
        }}
        onSuccess={handleSuccess}
        onError={handleError}
        onBackToLogin={handleBackToLogin}
      />
    </div>
  )
}
