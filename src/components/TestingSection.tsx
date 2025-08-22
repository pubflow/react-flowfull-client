/**
 * Professional Testing Section Component
 *
 * Modern development tools with shadcn/ui components
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import {
  TestTube,
  Shield,
  RefreshCw,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Terminal,
  Database
} from 'lucide-react'

interface TestingSectionProps {
  enabled?: boolean
  sessionId: string | null
  validationResult: any
  lastValidation: Date | null
  isValidating: boolean
  isAuthenticated: boolean
  isLoading: boolean
  onTestValidation: () => void
  onRefresh: () => void
  onInvalidateSession: () => void
}

export default function TestingSection({
  enabled = true,
  sessionId,
  validationResult,
  lastValidation,
  isValidating,
  isAuthenticated,
  isLoading,
  onTestValidation,
  onRefresh,
  onInvalidateSession
}: TestingSectionProps) {
  // Don't render if disabled
  if (!enabled) {
    return null
  }

  // Get status indicators
  const getAuthStatus = () => {
    if (isAuthenticated) {
      return { icon: CheckCircle, text: 'Authenticated', variant: 'default' as const, color: 'text-green-600' }
    }
    return { icon: XCircle, text: 'Not Authenticated', variant: 'destructive' as const, color: 'text-red-600' }
  }

  const getLoadingStatus = () => {
    if (isLoading) {
      return { icon: Clock, text: 'Loading', variant: 'secondary' as const, color: 'text-yellow-600' }
    }
    return { icon: CheckCircle, text: 'Loaded', variant: 'default' as const, color: 'text-green-600' }
  }

  const getValidationStatus = () => {
    if (!validationResult) return null
    if (validationResult.isValid) {
      return { icon: CheckCircle, text: 'Valid Session', variant: 'default' as const, color: 'text-green-600' }
    }
    return { icon: XCircle, text: 'Invalid Session', variant: 'destructive' as const, color: 'text-red-600' }
  }

  const authStatus = getAuthStatus()
  const loadingStatus = getLoadingStatus()
  const validationStatus = getValidationStatus()

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25 bg-muted/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Development Tools</CardTitle>
        </div>
        <CardDescription>
          Session testing and validation tools for development and debugging
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg">Session Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Session ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Session ID</label>
                <div className="p-3 bg-muted rounded-md border">
                  <code className="text-xs font-mono break-all">
                    {sessionId || 'No session ID found'}
                  </code>
                </div>
              </div>

              {/* Status Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication</span>
                  <Badge variant={authStatus.variant} className="flex items-center gap-1">
                    <authStatus.icon className="h-3 w-3" />
                    {authStatus.text}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Loading State</span>
                  <Badge variant={loadingStatus.variant} className="flex items-center gap-1">
                    <loadingStatus.icon className="h-3 w-3" />
                    {loadingStatus.text}
                  </Badge>
                </div>

                {validationStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Validation</span>
                    <Badge variant={validationStatus.variant} className="flex items-center gap-1">
                      <validationStatus.icon className="h-3 w-3" />
                      {validationStatus.text}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              {validationResult?.expiresAt && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires At</span>
                    <span className="font-mono text-xs">
                      {new Date(validationResult.expiresAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {lastValidation && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Check</span>
                  <span className="font-mono text-xs">
                    {lastValidation.toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Error Alert */}
              {validationResult?.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Validation Error:</strong> {validationResult.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          {/* Test Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg">Test Actions</CardTitle>
              </div>
              <CardDescription>
                Development tools for testing session functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={onTestValidation}
                disabled={isValidating}
                className="w-full justify-start"
                variant="default"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Validating Session...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Validate Session
                  </>
                )}
              </Button>

              <Button
                onClick={onRefresh}
                className="w-full justify-start"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>

              <Separator />

              <Button
                onClick={onInvalidateSession}
                className="w-full justify-start"
                variant="destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Force Logout (Test)
              </Button>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Development Mode:</strong> These tools are only available in development environment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
