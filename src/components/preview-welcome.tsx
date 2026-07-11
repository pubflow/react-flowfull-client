import { Link } from '@tanstack/react-router'
import { Code2, LayoutDashboard, LogIn, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PreviewWelcome() {
  const { t } = useTranslation()

  return (
    <main className="preview-welcome-shell">
      <section className="preview-welcome-hero">
        <div className="preview-welcome-logo" aria-hidden="true">
          <img src="/Pubflow-Favicon.png" alt="" />
        </div>
        <Badge variant="secondary" className="eyebrow-badge">
          <Sparkles size={14} />
          {t('preview.eyebrow')}
        </Badge>
        <h1>{t('preview.title')}</h1>
        <p>{t('preview.subtitle')}</p>
        <div className="preview-welcome-actions">
          <Button asChild size="lg">
            <Link to="/login">
              <LogIn size={16} />
              {t('actions.goLogin')}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">
              <LayoutDashboard size={16} />
              {t('actions.openDashboard')}
            </Link>
          </Button>
        </div>
      </section>

      <Card className="preview-welcome-card">
        <CardHeader>
          <CardTitle>{t('preview.editTitle')}</CardTitle>
          <CardDescription>{t('preview.editSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="preview-welcome-steps">
          <div>
            <Code2 size={18} />
            <span>{t('preview.steps.home')}</span>
          </div>
          <div>
            <Code2 size={18} />
            <span>{t('preview.steps.auth')}</span>
          </div>
          <div>
            <Code2 size={18} />
            <span>{t('preview.steps.config')}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
