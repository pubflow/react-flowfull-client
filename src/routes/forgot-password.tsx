import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { KeyRound } from 'lucide-react'
import { PasswordResetForm, OfflineIndicator } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { AuthPageShell } from '@/components/auth-page-shell'
import { PUBFLOW_CONFIG } from '@/lib/pubflow-config'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || undefined,
  }),
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { token } = useSearch({ from: '/forgot-password' })

  return (
    <>
      <OfflineIndicator />
      <AuthPageShell
        eyebrow={t('passwordReset.eyebrow')}
        title={token ? t('passwordReset.resetTitle') : t('passwordReset.title')}
        subtitle={token ? t('passwordReset.resetSubtitle') : t('passwordReset.subtitle')}
        icon={KeyRound}
      >
        <PasswordResetForm
          config={{
            primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
            appName: PUBFLOW_CONFIG.APP_NAME,
            logo: PUBFLOW_CONFIG.APP_LOGO,
            apiBaseUrl: PUBFLOW_CONFIG.API_BASE_URL,
          }}
          resetToken={token}
          onSuccess={() => navigate({ to: '/login', search: { message: t('passwordReset.success'), redirect: undefined } })}
          onError={(error) => console.error('Password reset error:', error)}
          onBackToLogin={() => navigate({ to: '/login', search: { message: undefined, redirect: undefined } })}
        />
      </AuthPageShell>
    </>
  )
}
