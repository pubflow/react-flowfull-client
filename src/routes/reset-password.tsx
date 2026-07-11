import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { KeyRound } from 'lucide-react'
import { OfflineIndicator } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { AuthPageShell } from '@/components/auth-page-shell'
import { CustomPasswordResetForm } from '@/components/pubflow-auth-forms'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || undefined,
  }),
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { token } = useSearch({ from: '/reset-password' })

  return (
    <>
      <OfflineIndicator />
      <AuthPageShell
        eyebrow={t('passwordReset.eyebrow')}
        title={token ? t('passwordReset.resetTitle') : t('passwordReset.title')}
        subtitle={token ? t('passwordReset.resetSubtitle') : t('passwordReset.subtitle')}
        icon={KeyRound}
      >
        <CustomPasswordResetForm
          resetToken={token}
          onSuccess={() => navigate({ to: '/login', search: { message: t('passwordReset.success'), redirect: undefined } })}
          onError={(error) => console.error('Password reset error:', error)}
          onBackToLogin={() => navigate({ to: '/login', search: { message: undefined, redirect: undefined } })}
        />
      </AuthPageShell>
    </>
  )
}
