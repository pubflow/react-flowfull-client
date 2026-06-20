import React, { createContext, useContext, useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { theme, darkTheme, applyTheme, type ThemeConfig } from '../lib/theme'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderContextType {
  theme: Theme
  themeConfig: ThemeConfig
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'flowfull-theme',
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setCurrentTheme(stored)
      return
    }
    setCurrentTheme(defaultTheme)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    const effectiveTheme = currentTheme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : currentTheme

    root.classList.add(effectiveTheme)
    root.dataset.theme = effectiveTheme
    root.style.setProperty('--brand-primary', theme.colors.primary)
    root.style.setProperty('--brand-secondary', theme.colors.secondary)
    root.style.setProperty('--brand-accent', theme.colors.accent)
    setIsDark(effectiveTheme === 'dark')
    applyTheme(effectiveTheme === 'dark' ? darkTheme : theme)
  }, [currentTheme])

  useEffect(() => {
    if (currentTheme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const effectiveTheme = mediaQuery.matches ? 'dark' : 'light'
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(effectiveTheme)
      root.dataset.theme = effectiveTheme
      setIsDark(effectiveTheme === 'dark')
      applyTheme(effectiveTheme === 'dark' ? darkTheme : theme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [currentTheme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setCurrentTheme(newTheme)
  }

  const toggleTheme = () => {
    if (currentTheme === 'light') setTheme('dark')
    else if (currentTheme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <ThemeProviderContext.Provider
      value={{
        theme: currentTheme,
        themeConfig: isDark ? darkTheme : theme,
        setTheme,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme: currentTheme, toggleTheme, isDark } = useTheme()
  const { t } = useTranslation()
  const label = currentTheme === 'system' ? t('theme.system') : isDark ? t('theme.dark') : t('theme.light')

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ''}`}
      title={`${t('theme.toggle')}: ${label}`}
      aria-label={`${t('theme.toggle')}: ${label}`}
      type="button"
    >
      {currentTheme === 'system' ? <Monitor className="h-5 w-5" /> : isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">{t('theme.toggle')}</span>
    </button>
  )
}
