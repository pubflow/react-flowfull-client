/**
 * Custom hook for managing local user data updates
 * 
 * Provides functions to update user data locally and sync with server
 */

import { useState, useCallback } from 'react'
import { userApi } from '../lib/api-client'

interface UserData {
  id?: string
  email?: string
  name?: string
  last_name?: string
  user_name?: string
  userType?: string
  picture?: string
  phone?: string
  lang?: string
}

export function useLocalUserData() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  /**
   * Get user initials for fallback avatar
   */
  const getUserInitials = useCallback((user: UserData | null): string => {
    if (!user) return 'US'
    
    const firstName = user.name?.trim()
    const lastName = user.last_name?.trim()
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase()
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    
    return 'US'
  }, [])

  /**
   * Update user data in localStorage (Pubflow format)
   */
  const updateLocalUserData = useCallback((userData: UserData) => {
    try {
      if (typeof window !== 'undefined') {
        // Update pubflow_user_data
        const existingData = localStorage.getItem('pubflow_user_data')
        let currentData = {}

        if (existingData) {
          try {
            currentData = JSON.parse(existingData)
          } catch (e) {
            console.warn('Failed to parse existing user data')
          }
        }

        // Merge with new data, ensuring picture field is properly updated
        const updatedData = { ...currentData, ...userData }

        // Special handling for picture field to ensure it's updated
        if (userData.picture !== undefined) {
          updatedData.picture = userData.picture
          console.log('🖼️ Updating picture in localStorage:', userData.picture)
        }

        localStorage.setItem('pubflow_user_data', JSON.stringify(updatedData))

        // Also update legacy 'user' key if it exists
        const legacyUser = localStorage.getItem('user')
        if (legacyUser) {
          try {
            const legacyData = JSON.parse(legacyUser)
            const updatedLegacyData = { ...legacyData, ...userData }
            if (userData.picture !== undefined) {
              updatedLegacyData.picture = userData.picture
            }
            localStorage.setItem('user', JSON.stringify(updatedLegacyData))
          } catch (e) {
            console.warn('Failed to update legacy user data')
          }
        }

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('userDataUpdated', {
          detail: updatedData
        }))

        console.log('✅ Local user data updated:', updatedData)
        return updatedData
      }
    } catch (error) {
      console.error('❌ Failed to update local user data:', error)
    }
    return null
  }, [])

  /**
   * Refresh user data from server
   */
  const refreshUserData = useCallback(async (): Promise<UserData | null> => {
    setIsRefreshing(true)
    try {
      const result = await userApi.getMe()
      
      if (result.success && result.data) {
        const freshUserData = result.data
        updateLocalUserData(freshUserData)
        setLastRefresh(new Date())
        console.log('🔄 User data refreshed from server:', freshUserData)
        return freshUserData
      } else {
        throw new Error(result.error || 'Failed to fetch user data')
      }
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error)
      throw error
    } finally {
      setIsRefreshing(false)
    }
  }, [updateLocalUserData])

  /**
   * Update profile and sync locally
   */
  const updateProfileWithLocalSync = useCallback(async (profileData: Partial<UserData>): Promise<UserData | null> => {
    try {
      const result = await userApi.updateProfile(profileData)
      
      if (result.success) {
        // Update local data immediately with the changes we made
        const updatedData = updateLocalUserData(profileData)
        console.log('✅ Profile updated and synced locally')
        
        // Optionally refresh from server to get complete data
        // This ensures we have the latest server state
        setTimeout(() => {
          refreshUserData().catch(console.error)
        }, 500)
        
        return updatedData
      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('❌ Failed to update profile:', error)
      throw error
    }
  }, [updateLocalUserData, refreshUserData])

  /**
   * Get current user data from localStorage
   */
  const getCurrentUserData = useCallback((): UserData | null => {
    try {
      if (typeof window !== 'undefined') {
        const pubflowData = localStorage.getItem('pubflow_user_data')
        if (pubflowData) {
          return JSON.parse(pubflowData)
        }
        
        // Fallback to legacy user data
        const legacyData = localStorage.getItem('user')
        if (legacyData) {
          return JSON.parse(legacyData)
        }
      }
    } catch (error) {
      console.error('❌ Failed to get current user data:', error)
    }
    return null
  }, [])

  return {
    isRefreshing,
    lastRefresh,
    getUserInitials,
    updateLocalUserData,
    refreshUserData,
    updateProfileWithLocalSync,
    getCurrentUserData
  }
}
