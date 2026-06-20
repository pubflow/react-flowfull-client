import type { ReactNode } from 'react'
import { ShieldCheck, type LucideIcon } from 'lucide-react'
import { AppLogo } from './ui/app-logo'
import { Badge } from './ui/badge'
import { LanguageToggle } from './ui/language-toggle'
import { ThemeToggle } from './theme-provider'

export function AuthPageShell({
  eyebrow,
  title,
  subtitle,
  icon: Icon = ShieldCheck,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  icon?: LucideIcon
  children: ReactNode
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="login-toolbar">
          <AppLogo />
          <div className="topbar-actions">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <div className="auth-copy">
          <Badge className="feature-badge">
            <Icon size={16} />
            <span>{eyebrow}</span>
          </Badge>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="auth-form-wrap">{children}</div>
      </section>
    </main>
  )
}
