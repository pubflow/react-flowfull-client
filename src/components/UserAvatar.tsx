/**
 * User Avatar Component
 * 
 * Shows user profile picture with fallback to initials
 */

import React from 'react'
import { useTheme } from '@pubflow/react'

interface UserAvatarProps {
  user?: {
    name?: string
    last_name?: string
    email?: string
    picture?: string
  } | null
  size?: number
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export default function UserAvatar({
  user,
  size = 120,
  onClick,
  className = '',
  style = {}
}: UserAvatarProps) {
  const theme = useTheme()
  const [imageError, setImageError] = React.useState(false)
  const [imageLoading, setImageLoading] = React.useState(false)

  // Debug logging
  React.useEffect(() => {
    console.log('👤 UserAvatar received user data:', {
      user,
      hasPicture: !!user?.picture,
      pictureUrl: user?.picture
    })
  }, [user])

  // Get user initials
  const getUserInitials = (): string => {
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
  }

  // Reset image error when picture changes
  React.useEffect(() => {
    if (user?.picture) {
      setImageError(false)
      setImageLoading(true)
      console.log('🖼️ UserAvatar: Picture detected, setting loading to true')
    } else {
      // No picture, don't show loading
      setImageError(false)
      setImageLoading(false)
      console.log('🚫 UserAvatar: No picture, setting loading to false')
    }
  }, [user?.picture])

  const handleImageLoad = () => {
    console.log('✅ UserAvatar: Image loaded successfully')
    setImageLoading(false)
  }

  const handleImageError = () => {
    console.log('❌ UserAvatar: Image failed to load')
    setImageError(true)
    setImageLoading(false)
  }

  const hasValidPicture = user?.picture && user.picture.trim() !== ''
  const initials = getUserInitials()

  // Debug current state
  console.log('🔍 UserAvatar render state:', {
    hasValidPicture,
    imageError,
    imageLoading,
    pictureUrl: user?.picture,
    willShowImage: hasValidPicture && !imageError && !imageLoading,
    willShowLoading: hasValidPicture && !imageError && imageLoading,
    willShowInitials: !hasValidPicture || imageError
  })

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    border: `3px solid ${theme.borderColor}`,
    position: 'relative', // IMPORTANTE: Para que position: absolute funcione
    ...style
  }

  const initialsStyle: React.CSSProperties = {
    fontSize: `${size * 0.4}px`,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: theme.primaryColor,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none'
  }



  const loadingStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.3}px`,
    color: '#999'
  }

  return (
    <div 
      className={className}
      style={containerStyle}
      onClick={onClick}
      title={user?.name ? `${user.name} ${user.last_name || ''}`.trim() : 'Usuario'}
    >
      {hasValidPicture && !imageError ? (
        imageLoading ? (
          // Show loading while image loads
          <div style={loadingStyle}>
            ⏳
          </div>
        ) : (
          // Show image when loaded
          <img
            src={user.picture}
            alt={`${user.name || 'Usuario'} avatar`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )
      ) : (
        // Show initials (no picture or image error)
        <div style={initialsStyle}>
          {initials}
        </div>
      )}

      {/* Hidden image for loading detection when we have a picture */}
      {hasValidPicture && imageLoading && (
        <img
          src={user.picture}
          alt=""
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  )
}
