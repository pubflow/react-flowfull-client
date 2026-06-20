import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { PubflowProvider } from '@pubflow/react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '../components/theme-provider'

import { PUBFLOW_CONFIG } from '../lib/pubflow-config'
import { i18n } from '../lib/i18n'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: PUBFLOW_CONFIG.APP_NAME,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <PubflowProvider
            config={{
              id: 'default',
              baseUrl: PUBFLOW_CONFIG.API_BASE_URL,
              bridgeBasePath: PUBFLOW_CONFIG.BRIDGE_BASE_PATH,
              authBasePath: PUBFLOW_CONFIG.AUTH_BASE_PATH,
              headers: PUBFLOW_CONFIG.BRIDGE_SECRET
                ? { 'X-Bridge-Secret': PUBFLOW_CONFIG.BRIDGE_SECRET }
                : undefined,
            }}
            loginRedirectPath={PUBFLOW_CONFIG.LOGIN_REDIRECT_PATH}
            enableDebugTools={PUBFLOW_CONFIG.ENABLE_DEBUG_TOOLS}
            showSessionAlerts={PUBFLOW_CONFIG.SHOW_SESSION_ALERTS}
            persistentCache={{ enabled: PUBFLOW_CONFIG.ENABLE_PERSISTENT_CACHE }}
            theme={{
              primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
              secondaryColor: PUBFLOW_CONFIG.SECONDARY_COLOR,
              appName: PUBFLOW_CONFIG.APP_NAME,
              logo: PUBFLOW_CONFIG.APP_LOGO
            }}
          >
            <ThemeProvider defaultTheme={PUBFLOW_CONFIG.DEFAULT_THEME as 'light' | 'dark' | 'system'} storageKey="flowfull-theme">
              {children}
            </ThemeProvider>
          </PubflowProvider>
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  )
}
