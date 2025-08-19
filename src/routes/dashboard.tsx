/**
 * Dashboard Route for TanStack Start
 * 
 * Protected route that demonstrates authentication and user data access
 */

import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth, BridgeView, OfflineIndicator, useTheme } from '@pubflow/react'
import { PUBFLOW_CONFIG } from '../lib/pubflow-config'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  
  // Use basic auth and handle redirect manually
  const { user, isAuthenticated, isLoading, validateSession } = useAuth()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/login',
        search: { message: undefined, redirect: undefined }
      })
    }
  }, [isLoading, isAuthenticated, navigate])
  
  // Handle logout
  const handleLogout = async () => {
    // The logout will be handled by the auth context
    // and will automatically redirect to login
    navigate({
      to: '/login',
      search: { message: undefined, redirect: undefined }
    })
  }
  
  // Handle refresh user data
  const handleRefresh = async () => {
    try {
      await validateSession()
      console.log('User data refreshed')
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.backgroundColor
      }}>
        <div style={{ 
          textAlign: 'center',
          color: theme.textSecondary
        }}>
          Loading...
        </div>
      </div>
    )
  }
  
  return (
    <BridgeView allowedTypes={['authenticated']}>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: theme.backgroundColor,
        padding: theme.spacing.lg
      }}>
        {/* Offline Indicator */}
        <OfflineIndicator />
        
        {/* Dashboard Header */}
        <div style={{
          backgroundColor: theme.surfaceColor,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          boxShadow: `0 4px 12px ${theme.shadowColor}`,
          border: `1px solid ${theme.borderColor}`
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing.lg
          }}>
            <h1 style={{ 
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              color: theme.textPrimary,
              letterSpacing: '-0.5px'
            }}>
              Welcome to {theme.appName}
            </h1>
            <button
              onClick={handleLogout}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: theme.errorColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: theme.borderRadius.medium,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
          
          {user && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: theme.spacing.md
            }}>
              <div style={{
                backgroundColor: theme.backgroundColor,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.medium,
                border: `1px solid ${theme.borderColor}`
              }}>
                <h3 style={{ 
                  margin: `0 0 ${theme.spacing.sm} 0`,
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  User Information
                </h3>
                <p style={{ 
                  margin: `0 0 ${theme.spacing.xs} 0`,
                  color: theme.textSecondary,
                  fontSize: '14px'
                }}>
                  <strong>Name:</strong> {user.name || 'N/A'}
                </p>
                <p style={{ 
                  margin: `0 0 ${theme.spacing.xs} 0`,
                  color: theme.textSecondary,
                  fontSize: '14px'
                }}>
                  <strong>Email:</strong> {user.email || 'N/A'}
                </p>
                <p style={{ 
                  margin: `0 0 ${theme.spacing.xs} 0`,
                  color: theme.textSecondary,
                  fontSize: '14px'
                }}>
                  <strong>User Type:</strong> {user.userType || 'N/A'}
                </p>
                <p style={{ 
                  margin: 0,
                  color: theme.textSecondary,
                  fontSize: '14px'
                }}>
                  <strong>ID:</strong> {user.id || 'N/A'}
                </p>
              </div>
              
              <div style={{
                backgroundColor: theme.backgroundColor,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.medium,
                border: `1px solid ${theme.borderColor}`
              }}>
                <h3 style={{ 
                  margin: `0 0 ${theme.spacing.sm} 0`,
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Session Status
                </h3>
                <p style={{ 
                  margin: `0 0 ${theme.spacing.sm} 0`,
                  color: theme.successColor,
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ✓ Authenticated
                </p>
                <button
                  onClick={handleRefresh}
                  style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    backgroundColor: theme.primaryColor,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: theme.borderRadius.small,
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Dashboard Content */}
        <div style={{
          backgroundColor: theme.surfaceColor,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          boxShadow: `0 4px 12px ${theme.shadowColor}`,
          border: `1px solid ${theme.borderColor}`
        }}>
          <h2 style={{ 
            margin: `0 0 ${theme.spacing.lg} 0`,
            fontSize: '24px',
            fontWeight: '600',
            color: theme.textPrimary
          }}>
            Dashboard Content
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: theme.spacing.lg
          }}>
            <div style={{
              backgroundColor: theme.backgroundColor,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              border: `1px solid ${theme.borderColor}`,
              textAlign: 'center'
            }}>
              <h3 style={{ 
                margin: `0 0 ${theme.spacing.md} 0`,
                color: theme.primaryColor,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Quick Actions
              </h3>
              <p style={{ 
                margin: `0 0 ${theme.spacing.md} 0`,
                color: theme.textSecondary,
                fontSize: '14px'
              }}>
                Perform common tasks and operations
              </p>
              <button
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: theme.primaryColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: theme.borderRadius.medium,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Get Started
              </button>
            </div>
            
            <div style={{
              backgroundColor: theme.backgroundColor,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              border: `1px solid ${theme.borderColor}`,
              textAlign: 'center'
            }}>
              <h3 style={{ 
                margin: `0 0 ${theme.spacing.md} 0`,
                color: theme.secondaryColor,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Recent Activity
              </h3>
              <p style={{ 
                margin: `0 0 ${theme.spacing.md} 0`,
                color: theme.textSecondary,
                fontSize: '14px'
              }}>
                View your recent actions and updates
              </p>
              <button
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: theme.secondaryColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: theme.borderRadius.medium,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                View Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </BridgeView>
  )
}
