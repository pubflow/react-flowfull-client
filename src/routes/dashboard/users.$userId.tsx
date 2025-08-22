/**
 * Professional User Detail Page for TanStack Start
 *
 * Comprehensive user management with Flowless API integration
 */

import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@pubflow/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Alert, AlertDescription } from '../../components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { DashboardLayout, LoadingLayout, PageContainer } from '../../components/dashboard-layout'
import { PUBFLOW_CONFIG } from '../../lib/pubflow-config'
import { getAvailableUserTypes, getUserTypeInfo } from '../../lib/user-types-config'
import {
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Key,
  Send,
  Eye,
  EyeOff
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  last_name: string
  email: string
  user_name?: string
  phone?: string
  user_type: string
  picture?: string
  lang?: string
  created_at?: string
  updated_at?: string
  two_factor?: boolean
}

// Helper function to get session ID (client-side)
const getSessionId = (): string => {
  return localStorage.getItem('pubflow_session') ||
         localStorage.getItem('sessionId') ||
         localStorage.getItem('session_id') || ''
}

// Get user types from environment variable
const getUserTypes = (): string[] => {
  return getAvailableUserTypes().map(type => type.value)
}

export const Route = createFileRoute('/dashboard/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated, isLoading } = useAuth()

  // State management
  const [userData, setUserData] = React.useState<UserData | null>(null)
  const [loadingUser, setLoadingUser] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [editData, setEditData] = React.useState<Partial<UserData>>({})

  // Password management state
  const [showPasswordSection, setShowPasswordSection] = React.useState(false)
  const [passwordData, setPasswordData] = React.useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [passwordLoading, setPasswordLoading] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null)

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showResetEmailDialog, setShowResetEmailDialog] = React.useState(false)

  // Get user types from environment
  const userTypes = getUserTypes()

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !currentUser)) {
      navigate({
        to: '/login',
        search: { message: undefined, redirect: `/dashboard/users/${userData?.id}` }
      })
    } else if (!isLoading && currentUser && !['admin', 'superadmin'].includes(currentUser.userType?.toLowerCase())) {
      navigate({
        to: '/dashboard',
        search: { message: 'Access denied: Administrator permissions required' }
      })
    }
  }, [isLoading, isAuthenticated, currentUser, navigate, userData?.id])

  // Load user data on client-side if not available from loader
  React.useEffect(() => {
    const loadUserData = async () => {
      if (userData || !isAuthenticated) return

      try {
        setLoadingUser(true)
        setError(null)

        const sessionId = getSessionId()
        if (!sessionId) {
          throw new Error('Authentication required')
        }

        // Get userId from URL params
        const pathParts = window.location.pathname.split('/')
        const userId = pathParts[pathParts.length - 1]

        const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Session-ID': sessionId
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          if (response.status === 401) {
            throw new Error('Authentication failed - please login again')
          }
          if (response.status === 403) {
            throw new Error('Access denied - administrator permissions required')
          }
          if (response.status === 404) {
            throw new Error('User not found')
          }

          throw new Error(errorData.error || errorData.details || `Failed to fetch user: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to load user data')
        }

        setUserData(result.data)
      } catch (err) {
        console.error('Error loading user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user data')
      } finally {
        setLoadingUser(false)
      }
    }

    loadUserData()
  }, [userData, isAuthenticated])

  // Initialize edit data when userData changes
  React.useEffect(() => {
    if (userData) {
      setEditData(userData)
    }
  }, [userData])

  // Handle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset edit data
      setEditData(userData || {})
    }
    setIsEditing(!isEditing)
  }

  // Handle delete user
  const handleDelete = async () => {
    if (!userData) return

    try {
      setSaving(true)
      setError(null)

      const sessionId = getSessionId()
      if (!sessionId) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/users/${userData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 401) {
          throw new Error('Authentication failed - please login again')
        }
        if (response.status === 403) {
          throw new Error('Access denied - insufficient permissions')
        }
        if (response.status === 404) {
          throw new Error('User not found')
        }

        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        console.log('User deleted successfully')
        setShowDeleteDialog(false)
        // Redirect to users list
        navigate({ to: '/dashboard/users' })
      } else {
        throw new Error(result.error || 'Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setSaving(false)
    }
  }

  // Handle save changes
  const handleSave = async () => {
    if (!userData) return

    try {
      setSaving(true)
      setError(null)

      // Prepare update data following Flowless structure
      const updateData = {
        name: editData.name?.trim(),
        last_name: editData.last_name?.trim(),
        email: editData.email?.trim().toLowerCase(),
        user_name: editData.user_name?.trim(),
        phone: editData.phone?.trim() || undefined,
        user_type: editData.user_type,
        lang: editData.lang
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      console.log('Updating user with data:', updateData)

      // Get session ID safely (client-side only)
      const sessionId = getSessionId()

      if (!sessionId) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 401) {
          throw new Error('Authentication failed - please login again')
        }
        if (response.status === 403) {
          throw new Error('Access denied - insufficient permissions')
        }
        if (response.status === 404) {
          throw new Error('User not found')
        }

        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        console.log('User updated successfully:', result.data)

        // Update the user data and edit data, then exit edit mode
        setUserData(result.data)
        setEditData(result.data)
        setIsEditing(false)

        // Show success message briefly
        setError(null)

      } else {
        throw new Error(result.error || 'Failed to update user')
      }
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof UserData, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  // Handle password reset email
  const handlePasswordResetEmail = async () => {
    if (!userData) return

    try {
      setPasswordLoading(true)
      setPasswordError(null)
      setPasswordSuccess(null)

      const sessionId = getSessionId()
      if (!sessionId) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          email: userData.email
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || 'Failed to send password reset email')
      }

      const result = await response.json()

      if (result.success) {
        setPasswordSuccess(`Password reset email sent to ${userData.email}`)
        setShowResetEmailDialog(false)
      } else {
        throw new Error(result.error || 'Failed to send password reset email')
      }
    } catch (err) {
      console.error('Error sending password reset email:', err)
      setPasswordError(err instanceof Error ? err.message : 'Failed to send password reset email')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Handle admin password update
  const handleAdminPasswordUpdate = async () => {
    if (!userData) return

    // Validate passwords
    if (!passwordData.newPassword) {
      setPasswordError('New password is required')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(passwordData.newPassword)) {
      setPasswordError('Password must contain at least one number and one special character')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      setPasswordLoading(true)
      setPasswordError(null)
      setPasswordSuccess(null)

      const sessionId = getSessionId()
      if (!sessionId) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/password-change/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          user_id: userData.id,
          new_password: passwordData.newPassword
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 401) {
          throw new Error('Authentication failed - please login again')
        }
        if (response.status === 403) {
          throw new Error('Access denied - insufficient permissions')
        }

        throw new Error(errorData.error || errorData.details || 'Failed to update password')
      }

      const result = await response.json()

      if (result.success) {
        setPasswordSuccess(`Password changed successfully for ${userData.name || userData.email}`)
        setPasswordData({ newPassword: '', confirmPassword: '' })
        setShowPasswordSection(false)
      } else {
        throw new Error(result.error || 'Failed to update password')
      }
    } catch (err) {
      console.error('Error updating password:', err)
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Get user type display info
  const getUserTypeDisplay = (userType: string) => {
    return getUserTypeInfo(userType)
  }

  // Get user initials
  const getUserInitials = (user: UserData) => {
    const firstName = user.name || ''
    const lastName = user.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || `U`
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading state
  if (isLoading || loadingUser) {
    return <LoadingLayout message="Loading user details..." />
  }

  // Error state
  if (error && !userData) {
    return (
      <DashboardLayout currentPage="users">
        <PageContainer>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading User</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => navigate({ to: "/dashboard/users" })}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageContainer>
      </DashboardLayout>
    )
  }

  if (!userData) {
    return null
  }

  const typeInfo = getUserTypeDisplay(userData.user_type)

  return (
    <DashboardLayout
      currentPage="users"
      title={`${userData.name} ${userData.last_name}`}
      description="User account details and management"
    >
      <PageContainer>
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate({ to: "/dashboard/users" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* User Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {userData.picture ? (
                    <AvatarImage src={userData.picture} alt={userData.name} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {getUserInitials(userData)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {`${userData.name} ${userData.last_name}`.trim()}
                  </CardTitle>
                  <CardDescription className="text-base">
                    @{userData.user_name || userData.email?.split('@')[0] || 'unknown'}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={typeInfo.className}>
                      <Shield className="h-3 w-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleEditToggle} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEditToggle}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted rounded-md text-sm">
                      {userData.name || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={editData.last_name || ''}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted rounded-md text-sm">
                      {userData.last_name || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                ) : (
                  <div className="px-3 py-2 bg-muted rounded-md text-sm flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {userData.email || 'Not specified'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_name">Username</Label>
                  {isEditing ? (
                    <Input
                      id="user_name"
                      value={editData.user_name || ''}
                      onChange={(e) => handleInputChange('user_name', e.target.value)}
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted rounded-md text-sm">
                      {userData.user_name || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted rounded-md text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {userData.phone || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_type">User Type</Label>
                {isEditing ? (
                  <select
                    id="user_type"
                    value={editData.user_type || userData.user_type}
                    onChange={(e) => handleInputChange('user_type', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {userTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-muted rounded-md text-sm">
                    <Badge variant="secondary" className={typeInfo.className}>
                      <Shield className="h-3 w-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lang">Language</Label>
                {isEditing ? (
                  <select
                    id="lang"
                    value={editData.lang || userData.lang || 'en'}
                    onChange={(e) => handleInputChange('lang', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-muted rounded-md text-sm">
                    {userData.lang === 'es' ? 'Español' : 'English'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="two_factor">Two-Factor Authentication</Label>
                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                  <Badge variant={userData.two_factor ? "default" : "secondary"}>
                    {userData.two_factor ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Disabled
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Account Dates */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(userData.created_at)}
                  </span>
                </div>
                {userData.updated_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(userData.updated_at)}
                    </span>
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-destructive/20">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                      <p className="text-sm text-destructive/80 mt-1">
                        Permanently delete this user account. This action cannot be undone.
                      </p>
                      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-3 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete User Account</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete <strong>{userData.name || userData.email}</strong>?
                              This action cannot be undone and will permanently remove all user data.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteDialog(false)}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Management Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password Management for {userData.name || userData.email}
            </CardTitle>
            <CardDescription>
              Change this user's password or send them a password reset email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success/Error Messages */}
            {passwordSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {passwordSuccess}
                </AlertDescription>
              </Alert>
            )}

            {passwordError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {/* Password Reset Email Option */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Send className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">Send Password Reset Email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send a password reset link to <strong>{userData.email}</strong>. {userData.name || 'The user'} will receive an email with instructions to set a new password.
                  </p>
                  <Dialog open={showResetEmailDialog} onOpenChange={setShowResetEmailDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reset Email
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Password Reset Email</DialogTitle>
                        <DialogDescription>
                          Send a password reset link to <strong>{userData.email}</strong>.
                          {userData.name || 'The user'} will receive an email with instructions to set a new password.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowResetEmailDialog(false)}
                          disabled={passwordLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePasswordResetEmail}
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reset Email
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Admin Password Update Option */}
            <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Change {userData.name || 'User'}'s Password</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Directly set a new password for <strong>{userData.name || userData.email}</strong>. This will immediately change their password without sending an email.
                    </p>

                    {!showPasswordSection ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPasswordSection(true)}
                        className="mt-3"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Change {userData.name || 'User'}'s Password
                      </Button>
                    ) : (
                      <div className="mt-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Enter new password"
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                              id="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Password must be at least 8 characters and contain at least one number and one special character.
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAdminPasswordUpdate}
                            disabled={passwordLoading}
                          >
                            {passwordLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Change Password
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowPasswordSection(false)
                              setPasswordData({ newPassword: '', confirmPassword: '' })
                              setPasswordError(null)
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  )
}
