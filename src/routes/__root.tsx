import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { PubflowProvider, ThemeProvider } from '@pubflow/react'

import Header from '../components/Header'
import { PUBFLOW_CONFIG } from '../lib/pubflow-config'

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
        title: 'TanStack Start Starter',
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
        {/* TESTING OPTIMIZED PubflowProvider */}
        <PubflowProvider
          config={{
            id: 'default',
            baseUrl: PUBFLOW_CONFIG.API_BASE_URL,
            authBasePath: PUBFLOW_CONFIG.AUTH_BASE_PATH
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
          <ThemeProvider
            theme={{
              primaryColor: PUBFLOW_CONFIG.PRIMARY_COLOR,
              secondaryColor: PUBFLOW_CONFIG.SECONDARY_COLOR,
              appName: PUBFLOW_CONFIG.APP_NAME,
              logo: PUBFLOW_CONFIG.APP_LOGO
            }}
          >
            <Header />
            {children}
          </ThemeProvider>
        </PubflowProvider>
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
