export function FirstPaintThemeScript({ storageKey = 'flowfull-theme' }: { storageKey?: string }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              var stored = localStorage.getItem('${storageKey}');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var dark = stored === 'dark' || ((stored === 'system' || !stored) && prefersDark);
              var root = document.documentElement;
              root.classList.toggle('dark', dark);
              root.classList.toggle('light', !dark);
            } catch (_) {}
          `,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body {
              margin: 0;
              background-color: #f7f8fb;
              color: #1a1f2e;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            }
            html.dark, html.dark body {
              background-color: #020617;
              color: #f8fafc;
            }
          `,
        }}
      />
    </>
  )
}
