/**
 * Protected Route Example
 * 
 * Demonstrates how to use useAuthGuard with TanStack Start
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthGuard } from '@pubflow/react'

export const Route = createFileRoute('/protected')({
  component: ProtectedPage,
})

function ProtectedPage() {
  const navigate = useNavigate()
  
  // Use auth guard with TanStack Start navigation
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    isAuthorized,
    redirectReason,
    validateSession 
  } = useAuthGuard({
    validateOnMount: true,
    allowedTypes: ['authenticated'], // Allow any authenticated user
    onRedirect: (path, reason) => {
      console.log(`Redirecting to ${path} due to: ${reason}`)
      navigate({ to: path })
    },
    onSessionExpired: () => {
      console.log('Session expired, clearing local data')
      // Additional cleanup if needed
    },
    loginRedirectPath: '/login',
    accessDeniedPath: '/access-denied',
    enableLogging: true
  })

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #006aff20',
            borderTop: '4px solid #006aff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ margin: 0, color: '#666666' }}>
            Validating authentication...
          </p>
        </div>
      </div>
    )
  }

  // Show redirect reason (for debugging)
  if (redirectReason) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#666666' }}>
            Redirecting due to: {redirectReason}
          </p>
        </div>
      </div>
    )
  }

  // Main protected content
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f0f0f0'
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '16px'
        }}>
          🔒 Protected Page
        </h1>
        
        <div style={{
          padding: '16px',
          backgroundColor: '#e8f5e8',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #4caf50'
        }}>
          <p style={{ 
            margin: 0,
            color: '#2e7d32',
            fontWeight: '600'
          }}>
            ✅ Authentication successful! You have access to this protected content.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ 
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              Authentication Status
            </h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666666' }}>
              <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666666' }}>
              <strong>Authorized:</strong> {isAuthorized ? 'Yes' : 'No'}
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#666666' }}>
              <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ 
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              User Information
            </h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666666' }}>
              <strong>Name:</strong> {user?.name || 'N/A'}
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666666' }}>
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#666666' }}>
              <strong>Type:</strong> {user?.userType || user?.user_type || 'N/A'}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate({ to: '/' })}
            style={{
              padding: '12px 24px',
              backgroundColor: '#006aff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
          
          <button
            onClick={async () => {
              const result = await validateSession()
              alert(`Session validation result: ${result.isValid ? 'Valid' : 'Invalid'}`)
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#006aff',
              border: '2px solid #006aff',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Validate Session
          </button>
        </div>
      </div>
    </div>
  )
}
