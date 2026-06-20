import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { AccountCreationForm, OfflineIndicator } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { AuthPageShell } from '@/components/auth-page-shell'
import { PUBFLOW_CONFIG } from '@/lib/pubflow-config'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <OfflineIndicator />
      <AuthPageShell
        eyebrow={t('register.eyebrow')}
        title={t('register.title')}
        subtitle={t('register.subtitle')}
        icon={UserPlus}
      >
        <AccountCreationForm
          config={{
            primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
            appName: PUBFLOW_CONFIG.APP_NAME,
            logo: PUBFLOW_CONFIG.APP_LOGO,
            apiBaseUrl: PUBFLOW_CONFIG.API_BASE_URL,
            requiredFields: ['name', 'lastName', 'email', 'password'],
          }}
          onSuccess={() => navigate({ to: '/login', search: { message: t('register.success'), redirect: undefined } })}
          onError={(error) => console.error('Account creation error:', error)}
          onBackToLogin={() => navigate({ to: '/login', search: { message: undefined, redirect: undefined } })}
        />
      </AuthPageShell>
    </>
  )
}
