/**
 * Professional Admin Dashboard Route for TanStack Start
 *
 * Impactful admin panel with modern UI and comprehensive management tools
 */

import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@pubflow/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { DashboardLayout, LoadingLayout, PageContainer } from '../../../components/dashboard-layout'
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Lock,
  Globe,
  Zap,
  Crown,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/admin/')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate({
        to: '/login',
        search: { message: undefined, redirect: '/dashboard/admin' }
      })
    } else if (!isLoading && user && !['admin', 'superadmin'].includes(user.userType?.toLowerCase())) {
      // Redirect non-admin users to their appropriate dashboard
      navigate({
        to: '/dashboard',
        search: { message: 'Access denied: Administrator permissions required' }
      })
    }
  }, [isLoading, isAuthenticated, user, navigate])

  // Mock data for demonstration (replace with real API calls)
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    newUsersToday: 23,
    systemUptime: '99.9%',
    totalSessions: 3456,
    activeSessions: 234,
    errorRate: '0.1%',
    responseTime: '120ms'
  }

  const recentActivity = [
    { id: 1, action: 'User registration', user: 'john.doe@example.com', time: '2 minutes ago', status: 'success' },
    { id: 2, action: 'Password reset', user: 'jane.smith@example.com', time: '5 minutes ago', status: 'success' },
    { id: 3, action: 'Failed login attempt', user: 'suspicious@email.com', time: '8 minutes ago', status: 'warning' },
    { id: 4, action: 'Profile update', user: 'user@example.com', time: '12 minutes ago', status: 'success' },
    { id: 5, action: 'System backup', user: 'system', time: '1 hour ago', status: 'success' }
  ]

  // Get user type display
  const getUserTypeDisplay = () => {
    const userType = user?.userType || user?.user_type
    switch (userType?.toLowerCase()) {
      case 'superadmin': return 'Super Administrator'
      case 'admin': return 'Administrator'
      default: return 'Administrator'
    }
  }

  // Loading state
  if (isLoading) {
    return <LoadingLayout message="Loading admin panel..." />
  }

  return (
    <DashboardLayout
      currentPage="admin"
      title="Administration Panel"
      description="Comprehensive system management and user administration"
    >
      <PageContainer>
        {/* Admin Header with User Info */}
        {user && (
          <Card className="mb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Welcome, {getUserTypeDisplay()}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {`${user.name || ''} ${user.last_name || ''}`.trim() || 'Administrator'} • {user.email}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <Shield className="h-4 w-4 mr-1" />
                  {getUserTypeDisplay()}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +{systemStats.newUsersToday} today
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{systemStats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 dark:text-green-400">
                <Activity className="h-3 w-3 inline mr-1" />
                {systemStats.activeSessions} active sessions
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">System Health</CardTitle>
              <Zap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{systemStats.systemUptime}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                <Clock className="h-3 w-3 inline mr-1" />
                {systemStats.responseTime} avg response
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{systemStats.errorRate}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                System stable
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Main Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest system events and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          {activity.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : activity.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    System Status
                  </CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Services</span>
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cache System</span>
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Optimal
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <Badge variant="secondary">
                        <Database className="h-3 w-3 mr-1" />
                        78% Used
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        View All Users
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Add New User
                      </Button>
                    </div>
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        User management features will be available in the next update. Currently showing {systemStats.totalUsers} registered users.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View User Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Reset Passwords
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export User Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Configure system settings and parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    General Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Database Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    API Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics & Reports
                  </CardTitle>
                  <CardDescription>View system analytics and generate reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Performance Metrics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Monitoring
                  </CardTitle>
                  <CardDescription>Monitor security events and system logs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View Security Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Security Alerts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Logs</CardTitle>
                  <CardDescription>Recent system events and errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Advanced security monitoring and logging features are being developed. Basic system monitoring is currently active.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </DashboardLayout>
  )
}
