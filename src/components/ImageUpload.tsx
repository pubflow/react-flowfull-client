/**
 * Image Upload Component
 * 
 * Handles file upload with drag & drop and preview
 */

import React from 'react'
import { useTheme } from '@pubflow/react'
import { userApi } from '../lib/api-client'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (imageUrl: string, updatedUserData?: any) => void
  onError: (error: string) => void
  disabled?: boolean
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  onError,
  disabled = false,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) {
  const theme = useTheme()
  const [isUploading, setIsUploading] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check if file exists
    if (!file) {
      return 'No se seleccionó ningún archivo'
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de archivo no soportado. Formatos permitidos: JPG, PNG, GIF, WebP`
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      return `El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB (tu archivo: ${sizeMB.toFixed(2)}MB)`
    }

    // Check minimum size (avoid empty files)
    if (file.size < 1024) {
      return 'El archivo es muy pequeño. Mínimo 1KB'
    }

    return null
  }

  const createPreview = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError(validationError)
      setPreviewUrl(null)
      return
    }

    // Create preview
    createPreview(file)

    setIsUploading(true)
    setUploadProgress(0)

    try {
      console.log('🔄 Uploading file:', file.name, file.size, file.type)

      // Simulate progress (since we can't track real progress with fetch easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const result = await userApi.uploadPicture(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log('📤 Upload result:', result)

      if (result.success) {
        // Based on your logs, the URL is in result.data.picture_url
        const imageUrl = result.data?.picture_url

        if (imageUrl) {
          console.log('✅ Image uploaded successfully:', imageUrl)
          console.log('📤 Full upload response:', result)

          // Check if profile was automatically updated
          if ((result as any).profileUpdated) {
            console.log('🎉 Profile was automatically updated on server!')
            onImageUploaded(imageUrl, (result as any).updatedUserData)
          } else {
            console.log('⚠️ Image uploaded but profile not auto-updated, will update manually')
            onImageUploaded(imageUrl)
          }

          setPreviewUrl(null) // Clear preview after successful upload
        } else {
          console.error('❌ No picture_url in response data:', result.data)
          console.error('❌ Full response:', result)
          throw new Error('No se recibió la URL de la imagen en data.picture_url')
        }
      } else {
        throw new Error(result.error || 'Error al subir la imagen')
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      onError(error instanceof Error ? error.message : 'Error al subir la imagen')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const containerStyle: React.CSSProperties = {
    border: `2px dashed ${dragOver ? theme.primaryColor : theme.borderColor}`,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    textAlign: 'center',
    cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
    backgroundColor: dragOver ? `${theme.primaryColor}10` : theme.backgroundColor,
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '48px',
    color: theme.textSecondary,
    marginBottom: theme.spacing.sm
  }

  const textStyle: React.CSSProperties = {
    color: theme.textPrimary,
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: theme.spacing.xs
  }

  const subtextStyle: React.CSSProperties = {
    color: theme.textSecondary,
    fontSize: '14px',
    marginBottom: theme.spacing.sm
  }

  const buttonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.primaryColor,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    fontSize: '14px',
    fontWeight: '500',
    cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
    opacity: disabled || isUploading ? 0.6 : 1
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />
      
      <div
        style={containerStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {isUploading ? (
          <>
            <div style={iconStyle}>⏳</div>
            <div style={textStyle}>Subiendo imagen...</div>
            <div style={subtextStyle}>Progreso: {uploadProgress}%</div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              marginTop: theme.spacing.sm,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: theme.primaryColor,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </>
        ) : previewUrl ? (
          <>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 16px auto',
              borderRadius: '8px',
              overflow: 'hidden',
              border: `2px solid ${theme.borderColor}`
            }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={textStyle}>Vista previa</div>
            <div style={subtextStyle}>La imagen se subirá automáticamente</div>
          </>
        ) : (
          <>
            <div style={iconStyle}>📷</div>
            <div style={textStyle}>
              {currentImageUrl ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
            </div>
            <div style={subtextStyle}>
              Arrastra una imagen aquí o haz clic para seleccionar
            </div>
            <div style={subtextStyle}>
              Formatos: JPG, PNG, GIF, WebP (máx. {maxSizeMB}MB)
            </div>
            <button
              type="button"
              style={buttonStyle}
              disabled={disabled || isUploading}
            >
              📁 Seleccionar Archivo
            </button>
          </>
        )}
      </div>
    </div>
  )
}
