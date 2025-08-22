/**
 * Professional Navigation Component
 * Responsive navigation with mobile support and theme integration
 */

import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@pubflow/react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ThemeToggle } from './theme-provider'
import {
  Home,
  User,
  Users,
  Settings,
  Shield,
  LogOut,
  Menu,
  ChevronDown
} from 'lucide-react'

interface NavigationProps {
  currentPage?: 'dashboard' | 'profile' | 'admin' | 'users' | 'settings'
}

export function Navigation({ currentPage = 'dashboard' }: NavigationProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U'
    const firstName = user.name || ''
    const lastName = user.last_name || ''
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate({ to: '/login', search: { message: 'Logged out successfully', redirect: undefined } })
    } catch (error) {
      console.error('Error during logout:', error)
      navigate({ to: '/login', search: { message: 'Error logging out', redirect: undefined } })
    }
  }

  // Navigation items
  const navigationItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      active: currentPage === 'dashboard'
    },
    {
      label: 'Profile',
      icon: User,
      href: '/dashboard/profile',
      active: currentPage === 'profile'
    },
    ...(user?.userType === 'admin' || user?.userType === 'superadmin' ? [
      {
        label: 'Users',
        icon: Users,
        href: '/dashboard/users',
        active: currentPage === 'users'
      },
      {
        label: 'Admin Panel',
        icon: Shield,
        href: '/dashboard/admin',
        active: currentPage === 'admin'
      }
    ] : [])
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-lg">Flowfull</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate({ to: item.href })}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Desktop User Menu & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2">
                  <Avatar className="h-8 w-8">
                    {user?.picture ? (
                      <AvatarImage src={user.picture} alt={user?.name || 'User'} />
                    ) : (
                      <AvatarFallback className="text-xs font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {`${user?.name || ''} ${user?.last_name || ''}`.trim() || 'User'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getUserTypeDisplay()}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/profile' })}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {(user?.userType === 'admin' || user?.userType === 'superadmin') && (
                  <>
                    <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/users' })}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Users</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/admin' })}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      {user?.picture ? (
                        <AvatarImage src={user.picture} alt={user?.name || 'User'} />
                      ) : (
                        <AvatarFallback className="text-sm font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {`${user?.name || ''} ${user?.last_name || ''}`.trim() || 'User'}
                      </span>
                      <span className="text-sm text-muted-foreground">{user?.email}</span>
                      <Badge variant="secondary" className="text-xs w-fit mt-1">
                        {getUserTypeDisplay()}
                      </Badge>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={item.active ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => {
                          navigate({ to: item.href as any })
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>

                  {/* Logout Button */}
                  <Button
                    variant="destructive"
                    className="justify-start mt-4"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
