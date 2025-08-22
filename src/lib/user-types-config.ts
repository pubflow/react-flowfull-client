/**
 * User Types Configuration
 * 
 * Simple user types system using environment variables
 */

import { Shield } from 'lucide-react'

export interface UserTypeConfig {
  label: string
  icon: any
  className: string
}

// Default user types - can be overridden by VITE_USER_TYPES environment variable
const DEFAULT_USER_TYPES = ['admin', 'superadmin', 'manager', 'moderator', 'customer']

// Get user types from environment variable or use defaults
function getUserTypes(): string[] {
  const userTypesEnv = import.meta.env.VITE_USER_TYPES
  if (userTypesEnv) {
    return userTypesEnv.split(',').map((type: string) => type.trim())
  }
  return DEFAULT_USER_TYPES
}

// Get the default user type (first in the list)
export function getDefaultUserType(): string {
  const types = getUserTypes()
  return types[0] || 'admin'
}

// Function to get user type info
export function getUserTypeInfo(userType: string): UserTypeConfig {
  return {
    label: userType?.charAt(0).toUpperCase() + userType?.slice(1) || 'User',
    icon: Shield,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  }
}

// Function to get available user types for dropdowns
export function getAvailableUserTypes(): Array<{ value: string; label: string }> {
  const types = getUserTypes()
  return types.map((type: string) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))
}
