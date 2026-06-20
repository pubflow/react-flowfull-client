import { createFileRoute } from '@tanstack/react-router'
import { UserRound } from 'lucide-react'
import { useAuth } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout, LoadingLayout } from '@/components/dashboard-layout'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const empty = t('user.notAvailable')

  if (isLoading) {
    return <LoadingLayout message={t('status.loading')} />
  }

  return (
    <DashboardLayout currentPage="profile">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">{t('profile.account')}</p>
          <h1>{t('profile.title')}</h1>
          <p>{t('profile.subtitle')}</p>
        </div>
        <div className="user-pill">
          <UserRound size={18} />
          <span>{user?.email || user?.name || empty}</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <Card className="panel">
          <CardHeader>
            <CardTitle>{t('profile.account')}</CardTitle>
            <CardDescription>{t('profile.details')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="quiet-list">
              <span>{t('user.email')}: {user?.email || empty}</span>
              <span>{t('user.id')}: {user?.id || empty}</span>
              <span>{t('user.type')}: {user?.userType || user?.user_type || empty}</span>
              <span>{t('user.language')}: {user?.lang || empty}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="panel">
          <CardHeader>
            <CardTitle>{t('profile.raw')}</CardTitle>
            <CardDescription>{t('dashboard.modules')}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="json-panel">{JSON.stringify(user || {}, null, 2)}</pre>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  )
}
