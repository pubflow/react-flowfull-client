/**
 * API Client for Flowless Backend
 * 
 * Provides utilities for making authenticated API calls
 */

import { PUBFLOW_CONFIG } from './pubflow-config'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Get authentication headers for API requests
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  // Get session ID from localStorage (check Pubflow keys first)
  const sessionId = localStorage.getItem('pubflow_session') ||
                   localStorage.getItem('sessionId') ||
                   localStorage.getItem('session_id')
  if (sessionId) {
    headers['X-Session-ID'] = sessionId
  }

  return headers
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${PUBFLOW_CONFIG.API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`
      }
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

/**
 * User Profile API
 */
export const userApi = {
  /**
   * Get fresh user data
   */
  getMe: async (): Promise<ApiResponse> => {
    return apiRequest('/auth/user/me', {
      method: 'GET'
    })
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: {
    name?: string
    last_name?: string
    email?: string
    user_name?: string
    phone?: string
    picture?: string
    lang?: string
  }): Promise<ApiResponse> => {
    return apiRequest('/auth/user/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  /**
   * Change user password
   */
  changePassword: async (passwordData: {
    current_password: string
    new_password: string
  }): Promise<ApiResponse> => {
    return apiRequest('/auth/password-change/self', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    })
  },

  /**
   * Upload profile picture and automatically update user profile
   */
  uploadPicture: async (file: File): Promise<ApiResponse> => {
    try {
      const sessionId = localStorage.getItem('pubflow_session') ||
                       localStorage.getItem('sessionId') ||
                       localStorage.getItem('session_id')

      if (!sessionId) {
        return {
          success: false,
          error: 'No session found'
        }
      }

      const formData = new FormData()
      formData.append('picture', file)

      const url = `${PUBFLOW_CONFIG.API_BASE_URL}/auth/upload/picture`

      console.log('📤 Uploading image to server...')
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId
          // Don't set Content-Type for FormData, let browser set it
        },
        body: formData
      })

      const uploadData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: uploadData.error || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      console.log('✅ Image uploaded successfully:', uploadData)

      // If upload was successful, automatically update the user profile
      if (uploadData.success && uploadData.data?.picture_url) {
        console.log('🔄 Auto-updating user profile with new picture URL...')

        const updateResult = await userApi.updateProfile({
          picture: uploadData.data.picture_url
        })

        if (updateResult.success) {
          console.log('✅ User profile updated automatically with new picture')
          // Return the upload data but indicate that profile was also updated
          return {
            ...uploadData,
            profileUpdated: true,
            updatedUserData: updateResult.data
          }
        } else {
          console.warn('⚠️ Image uploaded but failed to update profile:', updateResult.error)
          // Still return success for the upload, but note the profile update failed
          return {
            ...uploadData,
            profileUpdated: false,
            profileUpdateError: updateResult.error
          }
        }
      }

      return uploadData
    } catch (error) {
      console.error('❌ Upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }
}

/**
 * Admin API (for admin users)
 */
export const adminApi = {
  /**
   * Get all users (admin only)
   */
  getUsers: async (page = 1, limit = 20): Promise<ApiResponse> => {
    return apiRequest(`/auth/users?page=${page}&limit=${limit}`)
  },

  /**
   * Update user (admin only)
   */
  updateUser: async (userId: string, userData: any): Promise<ApiResponse> => {
    return apiRequest(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },

  /**
   * Delete user (admin only)
   */
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    return apiRequest(`/auth/users/${userId}`, {
      method: 'DELETE'
    })
  },

  /**
   * Change user password (admin only)
   */
  changeUserPassword: async (userId: string, newPassword: string): Promise<ApiResponse> => {
    return apiRequest('/auth/password-change/admin', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        new_password: newPassword
      })
    })
  }
}

/**
 * Validation utilities
 */
export const validation = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' }
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos una letra minúscula' }
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula' }
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos un número' }
    }
    
    return { valid: true }
  },

  /**
   * Validate phone number format
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }
}

export default {
  userApi,
  adminApi,
  validation
}
