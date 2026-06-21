/**
 * Professional Dashboard Layout Component
 * Provides consistent layout structure with navigation and theme support
 */

import React from 'react'
import { BridgeView, OfflineIndicator } from '@pubflow/react'
import { ThemeProvider } from './theme-provider'
import { Navigation } from './navigation'

function ClientProtectedView({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <BridgeView allowedTypes={['authenticated']}>
      {children}
    </BridgeView>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: 'dashboard' | 'profile'
  title?: string
  description?: string
  showOfflineIndicator?: boolean
}

export function DashboardLayout({ 
  children, 
  currentPage = 'dashboard',
  title,
  description,
  showOfflineIndicator = true
}: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <ClientProtectedView>
        <div className="min-h-screen bg-background">
          {/* Offline Indicator */}
          {showOfflineIndicator && <OfflineIndicator />}
          
          {/* Navigation */}
          <Navigation currentPage={currentPage} />
          
          {title && (
            <div className="border-b bg-card">
              <div className="container mx-auto px-4 py-6">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </ClientProtectedView>
    </ThemeProvider>
  )
}

/**
 * Loading Layout Component
 * Shows loading state with consistent styling
 */
interface LoadingLayoutProps {
  message?: string
}

export function LoadingLayout({ message = 'Loading...' }: LoadingLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </ThemeProvider>
  )
}

/**
 * Error Layout Component
 * Shows error state with consistent styling
 */
interface ErrorLayoutProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorLayout({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry
}: ErrorLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

/**
 * Page Container Component
 * Provides consistent padding and spacing for page content
 */
interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-6 space-y-6 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Page Section Component
 * Provides consistent spacing for page sections
 */
interface PageSectionProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export function PageSection({ 
  children, 
  className = '',
  title,
  description
}: PageSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
