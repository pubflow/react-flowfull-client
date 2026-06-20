import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const isSpanish = i18n.language?.startsWith('es')

  return (
    <div className="segmented-control" aria-label={t('language.label')}>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="segmented-button"
        title={isSpanish ? t('language.english') : t('language.spanish')}
        aria-label={isSpanish ? t('language.english') : t('language.spanish')}
        onClick={() => i18n.changeLanguage(isSpanish ? 'en' : 'es')}
      >
        <Languages size={16} />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={cn('segmented-text', isSpanish && 'is-active')}
        onClick={() => i18n.changeLanguage('es')}
      >
        ES
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={cn('segmented-text', !isSpanish && 'is-active')}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </Button>
    </div>
  )
}
