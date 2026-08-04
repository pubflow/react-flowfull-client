import { Link } from '@tanstack/react-router'
import { Code2, LayoutDashboard, LogIn, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HomeWelcome() {
  const { t } = useTranslation()

  return (
    <main className="home-welcome-shell">
      <section className="home-welcome-hero">
        <div className="home-welcome-logo" aria-hidden="true">
          <img src="/Pubflow-Favicon.png" alt="" />
        </div>
        <Badge variant="secondary" className="eyebrow-badge">
          <Sparkles size={14} />
          {t('home.welcome.eyebrow')}
        </Badge>
        <h1>{t('home.welcome.title')}</h1>
        <p>{t('home.welcome.subtitle')}</p>
        <div className="home-welcome-actions">
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

      <Card className="home-welcome-card">
        <CardHeader>
          <CardTitle>{t('home.welcome.editTitle')}</CardTitle>
          <CardDescription>{t('home.welcome.editSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="home-welcome-steps">
          <div>
            <Code2 size={18} />
            <span>{t('home.welcome.steps.home')}</span>
          </div>
          <div>
            <Code2 size={18} />
            <span>{t('home.welcome.steps.auth')}</span>
          </div>
          <div>
            <Code2 size={18} />
            <span>{t('home.welcome.steps.config')}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
