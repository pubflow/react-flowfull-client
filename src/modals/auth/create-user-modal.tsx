/**
 * Professional Create User Modal Component
 * 
 * Modal for creating new user accounts with form validation
 */

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { adminApi } from '../../lib/api-client'
import { PUBFLOW_CONFIG } from '../../lib/pubflow-config'
import { getAvailableUserTypes, getDefaultUserType } from '../../lib/user-types-config'
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Crown, 
  BookOpen, 
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: (user: any) => void
}

interface CreateUserForm {
  name: string
  last_name: string
  email: string
  user_name: string
  phone: string
  user_type: string
  password: string
  confirm_password: string
  lang: string
}

export function CreateUserModal({ open, onOpenChange, onUserCreated }: CreateUserModalProps) {
  const [formData, setFormData] = React.useState<CreateUserForm>({
    name: '',
    last_name: '',
    email: '',
    user_name: '',
    phone: '',
    user_type: getDefaultUserType(),
    password: '',
    confirm_password: '',
    lang: 'en'
  })

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({})

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        last_name: '',
        email: '',
        user_name: '',
        phone: '',
        user_type: getDefaultUserType(),
        password: '',
        confirm_password: '',
        lang: 'en'
      })
      setError(null)
      setValidationErrors({})
    }
  }, [open])

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Email is required
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Username is optional, but if provided must be at least 3 characters
    if (formData.user_name.trim() && formData.user_name.length < 3) {
      errors.user_name = 'Username must be at least 3 characters'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      errors.password = 'Password must contain at least one number and one special character'
    }

    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Prepare user data for API
      const userData = {
        name: formData.name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        user_name: formData.user_name.trim(),
        phone: formData.phone.trim() || undefined,
        user_type: formData.user_type,
        password: formData.password,
        lang: formData.lang
      }

      console.log('Creating user with data:', userData)

      // Make API request to create user
      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': localStorage.getItem('pubflow_session') || 
                          localStorage.getItem('sessionId') || 
                          localStorage.getItem('session_id') || ''
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('User created successfully:', result.data)
        onUserCreated(result.data)
        onOpenChange(false)
      } else {
        throw new Error(result.error || 'Failed to create user')
      }
    } catch (err) {
      console.error('Error creating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof CreateUserForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Get user type info - configurable for different use cases
  const getUserTypeInfo = (userType: string) => {
    // Default user types - can be customized based on environment variables or config
    const userTypes: Record<string, { label: string; icon: any; color: string }> = {
      'superadmin': { label: 'Super Administrator', icon: Crown, color: 'text-purple-600' },
      'admin': { label: 'Administrator', icon: Shield, color: 'text-blue-600' },
      'manager': { label: 'Manager', icon: BookOpen, color: 'text-green-600' },
      'editor': { label: 'Editor', icon: GraduationCap, color: 'text-yellow-600' },
      'viewer': { label: 'Viewer', icon: User, color: 'text-gray-600' },
      'user': { label: 'User', icon: User, color: 'text-gray-600' }
    }

    return userTypes[userType?.toLowerCase()] || { label: userType || 'User', icon: User, color: 'text-gray-600' }
  }

  const typeInfo = getUserTypeInfo(formData.user_type)
  const TypeIcon = typeInfo.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5" />
            Create New User Account
          </DialogTitle>
          <DialogDescription>
            Create a new user account with the specified role and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* User Preview */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {`${formData.name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase() || 'NU'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">
                {`${formData.name} ${formData.last_name}`.trim() || 'New User'}
              </div>
              <div className="text-sm text-muted-foreground">
                {formData.email || 'email@example.com'}
              </div>
              <Badge variant="secondary" className="mt-1">
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeInfo.label}
              </Badge>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">First Name (optional)</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter first name"
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name (optional)</Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Enter last name"
                className={validationErrors.last_name ? 'border-red-500' : ''}
              />
              {validationErrors.last_name && (
                <p className="text-sm text-red-500">{validationErrors.last_name}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">Username (optional)</Label>
              <Input
                id="user_name"
                type="text"
                value={formData.user_name}
                onChange={(e) => handleInputChange('user_name', e.target.value)}
                placeholder="Enter username"
                className={validationErrors.user_name ? 'border-red-500' : ''}
              />
              {validationErrors.user_name && (
                <p className="text-sm text-red-500">{validationErrors.user_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_type">User Type *</Label>
              <select
                id="user_type"
                value={formData.user_type}
                onChange={(e) => handleInputChange('user_type', e.target.value as any)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {getAvailableUserTypes().map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  className={validationErrors.password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  placeholder="Confirm password"
                  className={validationErrors.confirm_password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {validationErrors.confirm_password && (
                <p className="text-sm text-red-500">{validationErrors.confirm_password}</p>
              )}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="lang">Language</Label>
            <select
              id="lang"
              value={formData.lang}
              onChange={(e) => handleInputChange('lang', e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
