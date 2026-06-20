import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LogIn } from 'lucide-react'
import { LoginForm, useAuth } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AppLogo } from '@/components/ui/app-logo'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/theme-provider'
import { PUBFLOW_CONFIG, getRedirectUrl } from '@/lib/pubflow-config'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    message: (search.message as string) || undefined,
    redirect: (search.redirect as string) || undefined,
  }),
})

function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { message, redirect } = useSearch({ from: '/login' })
  const { isAuthenticated, user } = useAuth()
  const redirectPath = redirect || getRedirectUrl()

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate({ to: redirectPath })
    }
  }, [isAuthenticated, navigate, redirectPath, user])

  return (
    <main className="login-shell">
      <section className="login-form-panel">
        <div className="login-toolbar">
          <AppLogo />
          <div className="topbar-actions">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <div className="login-form-heading">
          <div className="eyebrow">
            <LogIn size={14} />
            <span>{t('login.title')}</span>
          </div>
          <h2>{PUBFLOW_CONFIG.APP_NAME}</h2>
          <p>{t('login.subtitle')}</p>
        </div>

        {message ? (
          <Alert className="auth-message">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <LoginForm
          config={{
            primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
            secondaryColor: PUBFLOW_CONFIG.SECONDARY_COLOR,
            appName: PUBFLOW_CONFIG.APP_NAME,
            logo: PUBFLOW_CONFIG.APP_LOGO,
            showPasswordReset: PUBFLOW_CONFIG.ENABLE_PASSWORD_RESET,
            showAccountCreation: PUBFLOW_CONFIG.ENABLE_ACCOUNT_CREATION,
            redirectPath,
          }}
          onSuccess={() => navigate({ to: redirectPath })}
          onError={(error) => console.error('Login error:', error)}
          onPasswordReset={() => navigate({ to: '/forgot-password', search: { token: undefined } })}
          onAccountCreation={() => navigate({ to: '/register' })}
        />
      </section>
    </main>
  )
}
