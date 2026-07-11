import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { OfflineIndicator } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { AuthPageShell } from '@/components/auth-page-shell'
import { CustomRegisterForm } from '@/components/pubflow-auth-forms'

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
        <CustomRegisterForm
          onSuccess={() => navigate({ to: '/login', search: { message: t('register.success'), redirect: undefined } })}
          onError={(error) => console.error('Account creation error:', error)}
          onBackToLogin={() => navigate({ to: '/login', search: { message: undefined, redirect: undefined } })}
        />
      </AuthPageShell>
    </>
  )
}
