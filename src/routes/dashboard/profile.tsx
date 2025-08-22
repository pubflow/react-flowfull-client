/**
 * Professional Profile Dashboard Route for TanStack Start
 *
 * Modern, responsive profile management with shadcn/ui components
 */

import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth, BridgeView, OfflineIndicator } from '@pubflow/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { DashboardLayout, LoadingLayout, PageContainer, PageSection } from '../../components/dashboard-layout'
import { userApi, validation } from '../../lib/api-client'
import { useLocalUserData } from '../../hooks/useLocalUserData'
import UserAvatar from '../../components/UserAvatar'
import ImageUpload from '../../components/ImageUpload'
import {
  User,
  Settings,
  Camera,
  Save,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()

  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const {
    isRefreshing,
    lastRefresh,
    refreshUserData,
    updateProfileWithLocalSync,
    getCurrentUserData,
    updateLocalUserData
  } = useLocalUserData()

  // Form states
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isChangingPassword, setIsChangingPassword] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [localUserData, setLocalUserData] = React.useState<any>(null)

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

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

  // Profile form data
  const [profileData, setProfileData] = React.useState({
    name: '',
    last_name: '',
    email: '',
    user_name: '',
    phone: '',
    picture: '',
    lang: 'es'
  })

  // Password form data
  const [passwordData, setPasswordData] = React.useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  // Initialize form data when user loads
  React.useEffect(() => {
    // Get the most current user data (local or from auth)
    const currentUser = getCurrentUserData() || user
    setLocalUserData(currentUser)

    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        user_name: currentUser.user_name || '',
        phone: currentUser.phone || '',
        picture: currentUser.picture || '',
        lang: currentUser.lang || 'es'
      })
    }
  }, [user, getCurrentUserData])

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/login',
        search: { message: undefined, redirect: '/dashboard/profile' }
      })
    }
  }, [isLoading, isAuthenticated, navigate])

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate({
        to: '/login',
        search: { message: 'Sesión cerrada exitosamente', redirect: undefined }
      })
    } catch (error) {
      console.error('Error during logout:', error)
      navigate({
        to: '/login',
        search: { message: 'Error al cerrar sesión', redirect: undefined }
      })
    }
  }

  // Handle refresh user data
  const handleRefreshUserData = async () => {
    try {
      const freshData = await refreshUserData()
      if (freshData) {
        setLocalUserData(freshData)
        setProfileData({
          name: freshData.name || '',
          last_name: freshData.last_name || '',
          email: freshData.email || '',
          user_name: freshData.user_name || '',
          phone: freshData.phone || '',
          picture: freshData.picture || '',
          lang: freshData.lang || 'es'
        })
        setMessage({ type: 'success', text: 'Datos actualizados desde el servidor' })
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      setMessage({
        type: 'error',
        text: 'Error al actualizar datos desde el servidor'
      })
    }
  }

  // Handle profile update with local sync
  const handleUpdateProfile = async () => {
    setIsSaving(true)
    setMessage(null)

    // Validate email if provided
    if (profileData.email && !validation.isValidEmail(profileData.email)) {
      setMessage({ type: 'error', text: 'Formato de email inválido' })
      setIsSaving(false)
      return
    }

    // Validate phone if provided
    if (profileData.phone && !validation.isValidPhone(profileData.phone)) {
      setMessage({ type: 'error', text: 'Formato de teléfono inválido' })
      setIsSaving(false)
      return
    }

    try {
      const updatedData = await updateProfileWithLocalSync(profileData)

      if (updatedData) {
        setLocalUserData(updatedData)
        setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' })
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al actualizar perfil'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle image upload
  const handleImageUploaded = async (imageUrl: string, updatedUserData?: any) => {
    try {
      console.log('🖼️ Image uploaded with URL:', imageUrl)

      // Update form data immediately for UI
      setProfileData(prev => {
        const updated = { ...prev, picture: imageUrl }
        console.log('📝 Form data updated with new picture:', updated)
        return updated
      })

      if (updatedUserData) {
        // Profile was automatically updated on server, just sync locally
        console.log('🎉 Using auto-updated user data from server:', updatedUserData)
        const localData = updateLocalUserData(updatedUserData)
        if (localData) {
          setLocalUserData(localData)
        }
        setMessage({ type: 'success', text: 'Imagen subida y perfil actualizado automáticamente' })
      } else {
        // Fallback: manually update profile (shouldn't happen with new system)
        console.log('⚠️ Fallback: manually updating profile...')

        // Update local user data immediately for avatar display
        setLocalUserData((prev: any) => {
          const updated = { ...prev, picture: imageUrl }
          console.log('👤 Local user data updated with new picture:', updated)
          return updated
        })

        // Update profile on server with new image URL
        const updatedData = await updateProfileWithLocalSync({ picture: imageUrl })

        if (updatedData) {
          console.log('🔄 Manual server sync completed:', updatedData)
          setLocalUserData(updatedData)
          setMessage({ type: 'success', text: 'Imagen subida y perfil actualizado exitosamente' })
        }
      }

      // Refresh user data after a short delay to ensure everything is in sync
      setTimeout(async () => {
        try {
          const freshData = await refreshUserData()
          if (freshData) {
            console.log('🔄 Final refresh completed:', freshData)
            setLocalUserData(freshData)
          }
        } catch (error) {
          console.log('⚠️ Final refresh failed, but upload was successful')
        }
      }, 1500)

    } catch (error) {
      console.error('❌ Error handling image upload:', error)
      setMessage({
        type: 'error',
        text: 'Error al procesar la imagen subida'
      })
    }
  }

  // Handle image upload error
  const handleImageUploadError = (error: string) => {
    setMessage({ type: 'error', text: error })
  }

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    // Validate password strength
    const passwordValidation = validation.isValidPassword(passwordData.new_password)
    if (!passwordValidation.valid) {
      setMessage({ type: 'error', text: passwordValidation.message || 'Contraseña inválida' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const result = await userApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' })
        setIsChangingPassword(false)
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      } else {
        throw new Error(result.error || 'Error changing password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al cambiar contraseña'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state
  if (isLoading) {
    return <LoadingLayout message="Loading profile..." />
  }

  return (
    <DashboardLayout
      currentPage="profile"
      title="My Profile"
      description="Manage your personal information and settings"
    >
      <PageContainer>
        {/* Message Display */}
        {message && (
          <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
            {/* Profile Information Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <CardDescription>
                      Manage your personal details and account settings
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "destructive" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Picture Section */}
                  <Card className="text-center">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-center gap-2">
                        <Camera className="h-5 w-5" />
                        Profile Picture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* User Avatar */}
                      <div className="flex justify-center">
                        <Avatar className="h-32 w-32">
                          {(localUserData || user)?.picture ? (
                            <AvatarImage
                              src={(localUserData || user).picture}
                              alt={(localUserData || user)?.name || 'User'}
                            />
                          ) : (
                            <AvatarFallback className="text-2xl font-semibold">
                              {getUserInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>

                      {/* User Info */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">
                          {`${(localUserData || user)?.name || ''} ${(localUserData || user)?.last_name || ''}`.trim() || 'User'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {(localUserData || user)?.email || 'No email'}
                        </p>
                        {(user?.user_type || user?.userType) && (
                          <Badge variant="secondary">
                            {getUserTypeDisplay()}
                          </Badge>
                        )}
                      </div>

                      {/* Refresh Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshUserData}
                        disabled={isRefreshing}
                        className="w-full"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                      </Button>

                      {lastRefresh && (
                        <p className="text-xs text-muted-foreground">
                          Last updated: {lastRefresh.toLocaleTimeString()}
                        </p>
                      )}

                      {/* Image Upload */}
                      {isEditing && (
                        <div className="pt-4 border-t">
                          <ImageUpload
                            currentImageUrl={profileData.picture}
                            onImageUploaded={handleImageUploaded}
                            onError={handleImageUploadError}
                            disabled={isSaving}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Personal Information Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Details</CardTitle>
                        <CardDescription>
                          Update your personal information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div className="space-y-2">
                            <Label htmlFor="name">First Name</Label>
                            {isEditing ? (
                              <Input
                                id="name"
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your first name"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                {profileData.name || 'Not specified'}
                              </div>
                            )}
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            {isEditing ? (
                              <Input
                                id="last_name"
                                type="text"
                                value={profileData.last_name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                                placeholder="Enter your last name"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                {profileData.last_name || 'Not specified'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Enter your email address"
                            />
                          ) : (
                            <div className="px-3 py-2 bg-muted rounded-md text-sm">
                              {profileData.email || 'Not specified'}
                            </div>
                          )}
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                          <Label htmlFor="user_name">Username</Label>
                          {isEditing ? (
                            <Input
                              id="user_name"
                              type="text"
                              value={profileData.user_name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, user_name: e.target.value }))}
                              placeholder="Enter your username"
                            />
                          ) : (
                            <div className="px-3 py-2 bg-muted rounded-md text-sm">
                              {profileData.user_name || 'Not specified'}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            {isEditing ? (
                              <Input
                                id="phone"
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Enter your phone number"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                {profileData.phone || 'Not specified'}
                              </div>
                            )}
                          </div>

                          {/* Language */}
                          <div className="space-y-2">
                            <Label htmlFor="lang">Language</Label>
                            {isEditing ? (
                              <Select
                                value={profileData.lang}
                                onValueChange={(value) => setProfileData(prev => ({ ...prev, lang: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="es">Español</SelectItem>
                                  <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                {profileData.lang === 'es' ? 'Español' : 'English'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                          <div className="pt-4 border-t">
                            <Button
                              onClick={handleUpdateProfile}
                              disabled={isSaving}
                              className="w-full md:w-auto"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your account password for security
                    </CardDescription>
                  </div>
                  <Button
                    variant={isChangingPassword ? "destructive" : "secondary"}
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                  >
                    {isChangingPassword ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              {isChangingPassword && (
                <CardContent>
                  <div className="max-w-md space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current_password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                          placeholder="Enter your current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                          placeholder="Enter your new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                          placeholder="Confirm your new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Change Password Button */}
                    <div className="pt-4">
                      <Button
                        onClick={handleChangePassword}
                        disabled={isSaving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                        className="w-full"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {isSaving ? 'Changing Password...' : 'Change Password'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
      </PageContainer>
    </DashboardLayout>
  )
}
