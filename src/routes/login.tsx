import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LogIn, ShieldCheck } from 'lucide-react'
import { useAuth } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthPageShell } from '@/components/auth-page-shell'
import { CustomLoginForm, type LoginStep } from '@/components/pubflow-auth-forms'
import { buildSocialLoginUrl, getRedirectUrl } from '@/lib/pubflow-config'

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
  const [step, setStep] = useState<LoginStep>('credentials')

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate({ to: redirectPath })
    }
  }, [isAuthenticated, navigate, redirectPath, user])

  const isTwoFactor = step === 'two-factor'

  return (
    <AuthPageShell
      eyebrow={isTwoFactor ? t('authCustom.twoFactorTitle', 'Verify it is you') : t('login.title')}
      title={isTwoFactor ? t('authCustom.twoFactorTitle', 'Verify it is you') : t('login.cardTitle', 'Welcome back')}
      subtitle={
        isTwoFactor
          ? t('authCustom.twoFactorSubtitle', 'Enter the security code for your Flowless account.')
          : t('login.subtitle')
      }
      icon={isTwoFactor ? ShieldCheck : LogIn}
    >
      {message ? (
        <Alert className="auth-message">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <CustomLoginForm
        redirectPath={redirectPath}
        onStepChange={setStep}
        onSuccess={() => navigate({ to: redirectPath })}
        onError={(error) => console.error('Login error:', error)}
        onPasswordReset={() => navigate({ to: '/forgot-password', search: { token: undefined } })}
        onAccountCreation={() => navigate({ to: '/register' })}
        onSocialLogin={(provider) => {
          window.location.href = buildSocialLoginUrl(provider, redirectPath)
        }}
      />
    </AuthPageShell>
  )
}
