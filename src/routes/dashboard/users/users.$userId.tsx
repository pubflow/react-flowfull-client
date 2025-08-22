/**
 * Individual User Page Route for TanStack Start
 * 
 * View and edit individual user details
 */

import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@pubflow/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { DashboardLayout, LoadingLayout, PageContainer } from '../../../components/dashboard-layout'
import { PUBFLOW_CONFIG } from '../../../lib/pubflow-config'
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Crown, 
  BookOpen, 
  GraduationCap,
  Calendar,
  Edit,
  Save,
  X,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  UserX
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/users/users/$userId')({
  loader: async ({ params }) => {
    const { userId } = params as { userId: string }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || `http://localhost:3001`}/auth/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': localStorage.getItem('pubflow_session') ||
                          localStorage.getItem('sessionId') ||
                          localStorage.getItem('session_id') || ''
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const apiResponse = await response.json()

      if (apiResponse.success) {
        return apiResponse.data
      } else {
        throw new Error(apiResponse.error || 'Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to load user data')
    }
  },
  component: UserDetailPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Error Loading User</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => window.location.href = '/dashboard/users'}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Users
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-muted-foreground">The user you"re looking for doesn"t exist.</p>
        <button
          onClick={() => window.location.href = '/dashboard/users'}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Users
        </button>
      </div>
    </div>
  ),
})

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
  is_active?: boolean
}

function UserDetailPage() {
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated, isLoading } = useAuth()
  const userData = Route.useLoaderData() as UserData

  // State management
  const [error, setError] = React.useState<string | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [editData, setEditData] = React.useState<Partial<UserData>>(userData || {})

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

  // Handle save changes
  const handleSave = async () => {
    if (!userData) return

    try {
      setSaving(true)
      setError(null)

      const updateData = {
        name: editData.name?.trim(),
        last_name: editData.last_name?.trim(),
        email: editData.email?.trim().toLowerCase(),
        user_name: editData.user_name?.trim(),
        phone: editData.phone?.trim() || undefined,
        user_type: editData.user_type,
        lang: editData.lang,
        is_active: editData.is_active
      }

      console.log('Updating user with data:', updateData)

      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': localStorage.getItem('pubflow_session') || 
                          localStorage.getItem('sessionId') || 
                          localStorage.getItem('session_id') || ''
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('User updated successfully:', result.data)
        // Update the edit data and exit edit mode
        setEditData(result.data)
        setIsEditing(false)
        // Refresh the page to get updated data
        window.location.reload()
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

  // Get user type info - configurable for different use cases
  const getUserTypeInfo = (userType: string) => {
    // Default user types - can be customized based on environment variables or config
    const userTypes: Record<string, {
      label: string;
      icon: any;
      className: string;
    }> = {
      'superadmin': {
        label: 'Super Administrator',
        icon: Crown,
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
      },
      'admin': {
        label: 'Administrator',
        icon: Shield,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      },
      'manager': {
        label: 'Manager',
        icon: BookOpen,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      },
      'editor': {
        label: 'Editor',
        icon: GraduationCap,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      },
      'viewer': {
        label: 'Viewer',
        icon: Eye,
        className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'
      },
      'user': {
        label: 'User',
        icon: User,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
      }
    }

    return userTypes[userType?.toLowerCase()] || {
      label: userType || 'User',
      icon: User,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
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
  if (isLoading) {
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
                  <Button variant="outline" onClick={() => window.location.href = "/dashboard/users"}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                  </Button>
                  <Button onClick={fetchUserData}>
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

  const typeInfo = getUserTypeInfo(userData.user_type)
  const TypeIcon = typeInfo.icon

  return (
    <DashboardLayout 
      currentPage="users"
      title={`${userData.name} ${userData.last_name}`}
      description="User account details and management"
    >
      <PageContainer>
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
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
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                    <Badge variant={userData.is_active !== false ? "default" : "secondary"}>
                      {userData.is_active !== false ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
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
                    <option value="user">User</option>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                    {currentUser?.userType === 'superadmin' && (
                      <option value="superadmin">Super Administrator</option>
                    )}
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-muted rounded-md text-sm">
                    <Badge variant="secondary" className={typeInfo.className}>
                      <TypeIcon className="h-3 w-3 mr-1" />
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
                <Label htmlFor="is_active">Account Status</Label>
                {isEditing ? (
                  <select
                    id="is_active"
                    value={editData.is_active !== undefined ? editData.is_active.toString() : 'true'}
                    onChange={(e) => handleInputChange('is_active', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-muted rounded-md text-sm">
                    <Badge variant={userData.is_active !== false ? "default" : "secondary"}>
                      {userData.is_active !== false ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                )}
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
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </DashboardLayout>
  )
}
