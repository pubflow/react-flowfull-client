import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Home, LogOut, Menu, User } from 'lucide-react'
import { useAuth } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { AppLogo } from './ui/app-logo'
import { Button } from './ui/button'
import { LanguageToggle } from './ui/language-toggle'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ThemeToggle } from './theme-provider'

interface NavigationProps {
  currentPage?: 'dashboard' | 'profile'
}

export function Navigation({ currentPage = 'dashboard' }: NavigationProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navigationItems = [
    {
      label: t('nav.dashboard'),
      icon: Home,
      href: '/dashboard',
      active: currentPage === 'dashboard',
    },
    {
      label: t('nav.profile'),
      icon: User,
      href: '/dashboard/profile',
      active: currentPage === 'profile',
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login', search: { message: undefined, redirect: undefined } })
  }

  return (
    <header className="topbar">
      <button className="topbar-brand" type="button" onClick={() => navigate({ to: '/dashboard' })}>
        <AppLogo />
      </button>

      <nav className="hidden md:flex items-center gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            variant={item.active ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: item.href as any })}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="hidden md:flex topbar-actions">
        <ThemeToggle />
        <LanguageToggle />
        <Button type="button" variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>{t('nav.logout')}</span>
        </Button>
      </div>

      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('nav.dashboard')}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-3 mt-8">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.active ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => {
                    navigate({ to: item.href as any })
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              <Button type="button" variant="outline" className="justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
