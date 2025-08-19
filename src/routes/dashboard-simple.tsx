/**
 * Dashboard Page - Simplified for Testing
 * 
 * This is a simplified version without Pubflow components for testing performance
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard-simple')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  
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
        border: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '16px'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          fontSize: '16px',
          color: '#666666',
          marginBottom: '24px'
        }}>
          Pubflow components are temporarily disabled for testing
        </p>
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
            onClick={() => navigate({ to: '/login' })}
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
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}
