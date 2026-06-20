import { PUBFLOW_CONFIG } from '@/lib/pubflow-config'

export function AppLogo() {
  return (
    <span className="app-logo" aria-label={PUBFLOW_CONFIG.APP_NAME}>
      {PUBFLOW_CONFIG.APP_LOGO ? (
        <img src={PUBFLOW_CONFIG.APP_LOGO} alt={PUBFLOW_CONFIG.APP_NAME} />
      ) : (
        <span className="app-logo-mark">F</span>
      )}
      <span>{PUBFLOW_CONFIG.APP_NAME}</span>
    </span>
  )
}
