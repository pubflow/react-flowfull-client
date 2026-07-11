import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@pubflow/react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { PreviewWelcome } from '@/components/preview-welcome'
import { PUBFLOW_CONFIG } from '@/lib/pubflow-config'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!PUBFLOW_CONFIG.PREVIEW_MODE && !isLoading) {
      navigate({ to: isAuthenticated ? '/dashboard' : '/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (PUBFLOW_CONFIG.PREVIEW_MODE) {
    return <PreviewWelcome />
  }

  return (
    <main className="center-screen">
      <Card className="status-panel">
        <Loader2 className="spin" size={28} />
        <div>
          <p className="eyebrow">{t('home.preparing')}</p>
          <h1>{t('home.checking')}</h1>
        </div>
      </Card>
    </main>
  )
}
