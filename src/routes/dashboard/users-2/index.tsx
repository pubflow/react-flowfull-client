/**
 * Professional Users Management Route for TanStack Start
 * 
 * Comprehensive user management with Flowless API integration
 */

import React from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '@pubflow/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { DashboardLayout, LoadingLayout, PageContainer } from '../../../components/dashboard-layout'
import { adminApi } from '../../../lib/api-client'
import { PUBFLOW_CONFIG } from '../../../lib/pubflow-config'
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Shield,
  GraduationCap,
  BookOpen,
  RefreshCw,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/users-2/')({
  component: UsersPage,
})

interface User {
  id: string
  name: string
  last_name: string
  email: string
  user_name?: string
  phone?: string
  user_type: 'admin' | 'superadmin' | 'teacher' | 'student' | 'user'
  picture?: string
  lang?: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

interface ApiResponse {
  success: boolean
  data: any
  error?: string
  message?: string
}

function UsersPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()

  // State management
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [refreshing, setRefreshing] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(false)

  // Filter states
  const [filters, setFilters] = React.useState({
    user_type: '',
    orderBy: 'created_at',
    orderDir: 'desc' as 'asc' | 'desc'
  })
  const [showFilters, setShowFilters] = React.useState(false)

  // Pagination settings
  const pageSize = 10

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate({
        to: '/login',
        search: { message: undefined, redirect: '/dashboard/users' }
      })
    } else if (!isLoading && user && !['admin', 'superadmin'].includes(user.userType?.toLowerCase())) {
      navigate({
        to: '/dashboard',
        search: { message: 'Access denied: Administrator permissions required' }
      })
    }
  }, [isLoading, isAuthenticated, user, navigate])

  // Build API URL with parameters
  const buildApiUrl = (page: number, search: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString()
    })

    // Add search parameter if provided
    if (search.trim()) {
      params.set('q', search.trim())
    }

    // Add filters
    if (filters.user_type) {
      params.set('user_type', filters.user_type)
    }
    if (filters.orderBy) {
      params.set('orderBy', filters.orderBy)
      params.set('orderDir', filters.orderDir)
    }

    // Use search endpoint if search term or filters are provided
    const endpoint = search.trim() || filters.user_type ? '/auth/users/search' : '/auth/users'
    return `${endpoint}?${params.toString()}`
  }

  // Fetch users from API
  const fetchUsers = React.useCallback(async (page = 1, search = '') => {
    try {
      setLoading(page === 1)
      setError(null)

      console.log(`Fetching users - Page: ${page}, Search: "${search}", Filters:`, filters)

      // Build the API URL
      const apiUrl = buildApiUrl(page, search)
      console.log('API URL:', apiUrl)

      // Make the API request directly since adminApi.getUsers doesn't support search
      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL}${apiUrl}`, {
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const apiResponse = await response.json()
      console.log('API Response:', apiResponse)

      if (apiResponse.success) {
        // Handle different response structures from Flowless API
        let usersData: User[] = []

        console.log('Processing API response data:', apiResponse.data)

        if (Array.isArray(apiResponse.data)) {
          // Case 1: Direct array of users (legacy format)
          usersData = apiResponse.data
        } else if (apiResponse.data && Array.isArray(apiResponse.data.rows)) {
          // Case 2: Flowless format with rows array (primary format)
          usersData = apiResponse.data.rows
        } else if (apiResponse.data && Array.isArray(apiResponse.data.users)) {
          // Case 3: Object with users array property
          usersData = apiResponse.data.users
        } else if (apiResponse.data && apiResponse.data.data && Array.isArray(apiResponse.data.data)) {
          // Case 4: Nested data array
          usersData = apiResponse.data.data
        } else if (apiResponse.data && typeof apiResponse.data === 'object' && apiResponse.data.id) {
          // Case 5: Single user object (convert to array)
          usersData = [apiResponse.data]
        } else if (apiResponse.data && typeof apiResponse.data === 'object') {
          // Case 6: Check if it's a single user object without explicit id check
          const hasUserProperties = apiResponse.data.email || apiResponse.data.name || apiResponse.data.user_type
          if (hasUserProperties) {
            usersData = [apiResponse.data]
          } else {
            console.warn('Unexpected API response structure:', apiResponse)
            usersData = []
          }
        } else {
          console.warn('Unexpected API response structure:', apiResponse)
          usersData = []
        }

        console.log('Processed users data:', usersData)

        setUsers(usersData)

        // Handle pagination metadata from Flowless API
        if (apiResponse.meta) {
          const meta = apiResponse.meta
          setHasMore(meta.hasMore || false)

          // Calculate total pages if we have total count
          if (meta.total !== undefined) {
            setTotalUsers(meta.total)
            setTotalPages(Math.ceil(meta.total / pageSize))
          } else if (meta.hasMore) {
            // If we don't have total but have hasMore, estimate
            setTotalPages(page + 1)
            setTotalUsers((page * pageSize) + usersData.length)
          } else {
            // Last page
            setTotalPages(page)
            setTotalUsers((page - 1) * pageSize + usersData.length)
          }
        } else {
          // Fallback if no pagination metadata
          setTotalPages(1)
          setTotalUsers(usersData.length)
          setHasMore(false)
        }
      } else {
        throw new Error(apiResponse.error || 'Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)

      // For development: provide mock data if API is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development')
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            user_name: 'johndoe',
            phone: '+1234567890',
            user_type: 'admin',
            picture: '',
            lang: 'en',
            created_at: '2024-01-15T10:30:00Z',
            is_active: true
          },
          {
            id: '2',
            name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            user_name: 'janesmith',
            phone: '+1234567891',
            user_type: 'teacher',
            picture: '',
            lang: 'en',
            created_at: '2024-01-16T14:20:00Z',
            is_active: true
          },
          {
            id: '3',
            name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
            user_name: 'bobjohnson',
            user_type: 'student',
            picture: '',
            lang: 'es',
            created_at: '2024-01-17T09:15:00Z',
            is_active: false
          }
        ]

        setUsers(mockUsers)
        setTotalPages(1)
        setTotalUsers(mockUsers.length)
        setError(null) // Clear error when using mock data
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load users')
        setUsers([])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [pageSize, filters])

  // Initial load and filter changes
  React.useEffect(() => {
    if (user && ['admin', 'superadmin'].includes(user.userType?.toLowerCase())) {
      fetchUsers(currentPage, searchTerm)
    }
  }, [user, currentPage, fetchUsers, filters])

  // Separate effect for search term changes (with debouncing)
  React.useEffect(() => {
    if (user && ['admin', 'superadmin'].includes(user.userType?.toLowerCase())) {
      const timeoutId = setTimeout(() => {
        if (currentPage === 1) {
          fetchUsers(1, searchTerm)
        } else {
          setCurrentPage(1) // This will trigger the main effect
        }
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm])

  // Search handler with debouncing
  const handleSearch = React.useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchUsers(1, term)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [fetchUsers])

  // Filter handler
  const handleFilterChange = React.useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
    // Filters will trigger fetchUsers through the useEffect dependency
  }, [])

  // Refresh handler
  const handleRefresh = () => {
    setRefreshing(true)
    fetchUsers(currentPage, searchTerm)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      user_type: '',
      orderBy: 'created_at',
      orderDir: 'desc'
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  // Get user type display and styling
  const getUserTypeInfo = (userType: string) => {
    switch (userType?.toLowerCase()) {
      case 'superadmin':
        return { 
          label: 'Super Admin', 
          icon: Crown, 
          variant: 'default' as const,
          className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
        }
      case 'admin':
        return { 
          label: 'Administrator', 
          icon: Shield, 
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
        }
      case 'teacher':
        return { 
          label: 'Teacher', 
          icon: BookOpen, 
          variant: 'outline' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
        }
      case 'student':
        return { 
          label: 'Student', 
          icon: GraduationCap, 
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
        }
      default:
        return { 
          label: 'User', 
          icon: Users, 
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        }
    }
  }

  // Get user initials
  const getUserInitials = (user: User) => {
    const firstName = user.name || ''
    const lastName = user.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  // Loading state
  if (isLoading) {
    return <LoadingLayout message="Loading users management..." />
  }

  return (
    <DashboardLayout 
      currentPage="users"
      title="User Management"
      description="Manage system users, roles, and permissions"
    >
      <PageContainer>
        {/* Header Actions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Users ({totalUsers.toLocaleString()})
                  {(searchTerm || filters.user_type || filters.orderBy !== 'created_at') && (
                    <Badge variant="secondary" className="text-xs">
                      Filtered
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                  {searchTerm && (
                    <span className="block text-sm mt-1">
                      Searching for: "{searchTerm}"
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {(filters.user_type || filters.orderBy !== 'created_at') && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>

          {/* Advanced Filters */}
          {showFilters && (
            <CardContent className="pt-0">
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_type_filter">User Type</Label>
                    <select
                      id="user_type_filter"
                      value={filters.user_type}
                      onChange={(e) => handleFilterChange({ user_type: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="admin">Administrator</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order_by_filter">Sort By</Label>
                    <select
                      id="order_by_filter"
                      value={filters.orderBy}
                      onChange={(e) => handleFilterChange({ orderBy: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="created_at">Created Date</option>
                      <option value="updated_at">Updated Date</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="user_type">User Type</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order_dir_filter">Sort Direction</Label>
                    <select
                      id="order_dir_filter"
                      value={filters.orderDir}
                      onChange={(e) => handleFilterChange({ orderDir: e.target.value as 'asc' | 'desc' })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No users match your search criteria.' : 'No users available.'}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => handleSearch("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => {
                    const typeInfo = getUserTypeInfo(userData.user_type)
                    const TypeIcon = typeInfo.icon
                    
                    return (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              {userData.picture ? (
                                <AvatarImage src={userData.picture} alt={userData.name} />
                              ) : (
                                <AvatarFallback>
                                  {getUserInitials(userData)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <Link
                                to="/dashboard/users/$userId"
                                params={{ userId: userData.id }}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {`${userData.name || ''} ${userData.last_name || ''}`.trim() || 'Unnamed User'}
                              </Link>
                              <div className="text-sm text-muted-foreground">
                                @{userData.user_name || userData.email?.split('@')[0] || 'unknown'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                              {userData.email || 'No email'}
                            </div>
                            {userData.phone && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1" />
                                {userData.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={typeInfo.variant} className={typeInfo.className}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={userData.is_active !== false ? "default" : "secondary"}>
                            {userData.is_active !== false ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(userData.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.location.href = `/dashboard/users/${userData.id}`}
                              title="View user details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.location.href = `/dashboard/users/${userData.id}`}
                              title="Edit user"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete user"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${userData.name} ${userData.last_name}?`)) {
                                  // TODO: Implement delete functionality
                                  console.log('Delete user:', userData.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {(totalPages > 1 || hasMore) && (
          <Card className="mt-6">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalUsers)}
                  {totalUsers > 0 ? ` of ${totalUsers.toLocaleString()}` : ''} users
                  {hasMore && totalUsers === 0 && ' (more available)'}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {/* Page numbers for small pagination */}
                    {totalPages <= 5 ? (
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))
                    ) : (
                      <span className="text-sm px-2">
                        Page {currentPage} {totalPages > 0 ? `of ${totalPages}` : ''}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={(!hasMore && currentPage >= totalPages) || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </DashboardLayout>
  )
}
