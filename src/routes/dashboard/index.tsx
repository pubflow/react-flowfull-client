/**
 * Professional Dashboard Route for TanStack Start
 *
 * Modern, responsive dashboard with shadcn/ui components
 */

import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth, BridgeView, OfflineIndicator } from '@pubflow/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { DashboardLayout, LoadingLayout, PageContainer, PageSection } from '../../components/dashboard-layout'
import TestingSection from '../../components/TestingSection'
import { useLocalUserData } from '../../hooks/useLocalUserData'
import {
  User,
  Settings,
  Shield,
  BarChart3,
  BookOpen,
  GraduationCap,
  Activity,
  RefreshCw
} from 'lucide-react'

// Configuration for testing features
const ENABLE_TESTING_SECTION = true // Set to false to hide testing features

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()

  // Use basic auth and handle redirect manually
  const { user, isAuthenticated, isLoading, validateSession, logout } = useAuth()
  const { refreshUserData, isRefreshing, getCurrentUserData } = useLocalUserData()

  // State for session testing
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [validationResult, setValidationResult] = React.useState<any>(null)
  const [isValidating, setIsValidating] = React.useState(false)
  const [lastValidation, setLastValidation] = React.useState<Date | null>(null)
  const [localUserData, setLocalUserData] = React.useState<any>(null)

  // Get session ID from localStorage and initialize local user data
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for Pubflow session keys
      const storedSessionId = localStorage.getItem('pubflow_session') ||
                             localStorage.getItem('sessionId') ||
                             localStorage.getItem('session_id')
      console.log('🔍 Session ID from localStorage:', storedSessionId)
      setSessionId(storedSessionId)

      // Get current user data
      const currentUserData = getCurrentUserData()
      console.log('📊 Dashboard user data comparison:', {
        userFromAuth: user,
        userFromLocalStorage: currentUserData,
        userAuthHasPicture: !!user?.picture,
        localStorageHasPicture: !!currentUserData?.picture,
        userAuthPicture: user?.picture,
        localStoragePicture: currentUserData?.picture
      })
      setLocalUserData(currentUserData || user)
    }
  }, [isAuthenticated, user, getCurrentUserData])

  // Listen for user data updates from other components
  React.useEffect(() => {
    const handleUserDataUpdate = (event: CustomEvent) => {
      console.log('🔄 User data updated event received:', event.detail)
      setLocalUserData(event.detail)
    }

    const handleStorageChange = () => {
      const currentUserData = getCurrentUserData()
      if (currentUserData) {
        console.log('🔄 localStorage changed, updating user data:', currentUserData)
        setLocalUserData(currentUserData)
      }
    }

    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [getCurrentUserData])

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
    try {
      await logout()
      // Clear session data
      setSessionId(null)
      setValidationResult(null)
      // Navigate to login
      navigate({
        to: '/login',
        search: { message: 'Sesión cerrada exitosamente', redirect: undefined }
      })
    } catch (error) {
      console.error('Error during logout:', error)
      // Force navigation even if logout fails
      navigate({
        to: '/login',
        search: { message: 'Error al cerrar sesión', redirect: undefined }
      })
    }
  }

  // Handle refresh user data
  const handleRefresh = async () => {
    try {
      await validateSession()
      console.log('User data refreshed')
      // Update session ID in case it changed
      if (typeof window !== 'undefined') {
        const storedSessionId = localStorage.getItem('pubflow_session') ||
                               localStorage.getItem('sessionId') ||
                               localStorage.getItem('session_id')
        setSessionId(storedSessionId)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Handle refresh user data from server
  const handleRefreshUserData = async () => {
    try {
      const freshData = await refreshUserData()
      if (freshData) {
        setLocalUserData(freshData)
        console.log('✅ User data refreshed from server')
      }
    } catch (error) {
      console.error('❌ Error refreshing user data from server:', error)
    }
  }

  // Test session validation
  const handleTestValidation = async () => {
    setIsValidating(true)
    try {
      const result = await validateSession()
      setValidationResult(result)
      setLastValidation(new Date())
      console.log('Session validation result:', result)
    } catch (error) {
      console.error('Session validation error:', error)
      setValidationResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      setLastValidation(new Date())
    } finally {
      setIsValidating(false)
    }
  }

  // Force session invalidation (for testing)
  const handleInvalidateSession = () => {
    console.log('🚪 Force logout clicked!')
    if (typeof window !== 'undefined') {
      console.log('🗑️ Removing session data from localStorage')
      // Remove Pubflow session keys
      localStorage.removeItem('pubflow_session')
      localStorage.removeItem('pubflow_user_data')
      // Remove legacy keys just in case
      localStorage.removeItem('sessionId')
      localStorage.removeItem('session_id')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user')
      setSessionId(null)
      setValidationResult(null)
      console.log('🔄 Reloading page...')
      // Force a page refresh to trigger auth check
      window.location.reload()
    }
  }
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const currentUser = localUserData || user
    if (!currentUser) return 'U'
    const firstName = currentUser.name || ''
    const lastName = currentUser.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'
  }

  // Get user type display
  const getUserTypeDisplay = () => {
    const userType = user?.userType || user?.user_type
    switch (userType?.toLowerCase()) {
      case 'admin': return 'Administrator'
      case 'superadmin': return 'Super Administrator'
      case 'teacher': return 'Teacher'
      case 'student': return 'Student'
      default: return 'User'
    }
  }

  // Loading state
  if (isLoading) {
    return <LoadingLayout message="Loading dashboard..." />
  }

  return (
    <DashboardLayout
      currentPage="dashboard"
      title="Welcome to Dashboard"
      description={user?.userType === 'admin' || user?.userType === 'superadmin'
        ? 'Administrative Control Panel'
        : 'Your Personal Space'}
    >
      <PageContainer>
            {/* User Information Card */}
            {(localUserData || user) && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Avatar className="h-20 w-20">
                      {(localUserData || user)?.picture ? (
                        <AvatarImage
                          src={(localUserData || user).picture}
                          alt={(localUserData || user)?.name || 'User'}
                        />
                      ) : (
                        <AvatarFallback className="text-lg font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {`${(localUserData || user)?.name || ''} ${(localUserData || user)?.last_name || ''}`.trim() || 'User'}
                          </h2>
                          <p className="text-muted-foreground">
                            {(localUserData || user)?.email || 'No email'}
                          </p>
                          {(user?.user_type || user?.userType) && (
                            <Badge variant="secondary" className="mt-1">
                              {getUserTypeDisplay()}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefreshUserData}
                          disabled={isRefreshing}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Type</p>
                      <p className="font-semibold">{(localUserData || user)?.userType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">ID</p>
                      <p className="font-semibold">{(localUserData || user)?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Phone</p>
                      <p className="font-semibold">{(localUserData || user)?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Language</p>
                      <p className="font-semibold">{(localUserData || user)?.lang || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Management - Available to all users */}
              <Card className="text-center">
                <CardHeader>
                  <User className="h-8 w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-lg">Profile Management</CardTitle>
                  <CardDescription>
                    Update your personal information and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate({ to: '/dashboard/profile' })}
                    className="w-full"
                  >
                    Go to Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Admin Panel - Only for admins */}
              {(user?.userType === 'admin' || user?.userType === 'superadmin') && (
                <Card className="text-center">
                  <CardHeader>
                    <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">Administration Panel</CardTitle>
                    <CardDescription>
                      Manage users and system configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => navigate({ to: '/dashboard/admin' })}
                      className="w-full"
                      variant="secondary"
                    >
                      Go to Admin Panel
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* User Type Specific Content */}
              <Card className="text-center">
                <CardHeader>
                  {user?.userType === 'admin' || user?.userType === 'superadmin' ? (
                    <BarChart3 className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  ) : user?.userType === 'teacher' ? (
                    <BookOpen className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  ) : user?.userType === 'student' ? (
                    <GraduationCap className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  ) : (
                    <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  )}
                  <CardTitle className="text-lg">
                    {user?.userType === 'admin' || user?.userType === 'superadmin'
                      ? 'System Statistics'
                      : user?.userType === 'teacher'
                      ? 'My Classes'
                      : user?.userType === 'student'
                      ? 'My Courses'
                      : 'My Activity'}
                  </CardTitle>
                  <CardDescription>
                    {user?.userType === 'admin' || user?.userType === 'superadmin'
                      ? 'View system metrics and statistics'
                      : user?.userType === 'teacher'
                      ? 'Manage your classes and students'
                      : user?.userType === 'student'
                      ? 'Access your courses and assignments'
                      : 'Review your recent activity'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {user?.userType === 'admin' || user?.userType === 'superadmin'
                      ? 'View Statistics'
                      : user?.userType === 'teacher'
                      ? 'View Classes'
                      : user?.userType === 'student'
                      ? 'View Courses'
                      : 'View Activity'}
                  </Button>
                </CardContent>
              </Card>

              {/* Settings - Available to all users */}
              <Card className="text-center">
                <CardHeader>
                  <Settings className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>
                    Customize your experience and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

        {/* Session Testing Section */}
        {ENABLE_TESTING_SECTION && (
          <PageSection title="Development Tools" description="Testing and debugging tools">
            <TestingSection
              enabled={ENABLE_TESTING_SECTION}
              sessionId={sessionId}
              validationResult={validationResult}
              lastValidation={lastValidation}
              isValidating={isValidating}
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              onTestValidation={handleTestValidation}
              onRefresh={handleRefresh}
              onInvalidateSession={handleInvalidateSession}
            />
          </PageSection>
        )}
      </PageContainer>
    </DashboardLayout>
  )
}
