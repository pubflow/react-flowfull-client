/**
 * Professional Theme Configuration
 * Supports environment variables for customization
 */

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: check for Vite environment variables
    return (window as any).__ENV__?.[key] || 
           import.meta.env?.[key] || 
           fallback;
  }
  // Server-side: check process.env
  return process.env[key] || fallback;
}

/**
 * Professional theme configuration with environment variable support
 */
export const theme: ThemeConfig = {
  colors: {
    primary: getEnvVar('VITE_PRIMARY_COLOR', '#3b82f6'), // Professional Blue
    secondary: getEnvVar('VITE_SECONDARY_COLOR', '#64748b'), // Slate Gray
    accent: getEnvVar('VITE_ACCENT_COLOR', '#06b6d4'), // Cyan
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    border: '#e2e8f0',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

/**
 * Dark theme configuration
 */
export const darkTheme: ThemeConfig = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#1e293b',
    border: '#334155',
  },
};

/**
 * CSS custom properties for theme integration
 */
export function generateCSSVariables(themeConfig: ThemeConfig): Record<string, string> {
  return {
    '--theme-primary': themeConfig.colors.primary,
    '--theme-secondary': themeConfig.colors.secondary,
    '--theme-accent': themeConfig.colors.accent,
    '--theme-success': themeConfig.colors.success,
    '--theme-warning': themeConfig.colors.warning,
    '--theme-error': themeConfig.colors.error,
    '--theme-background': themeConfig.colors.background,
    '--theme-foreground': themeConfig.colors.foreground,
    '--theme-muted': themeConfig.colors.muted,
    '--theme-border': themeConfig.colors.border,
    '--theme-radius-sm': themeConfig.borderRadius.sm,
    '--theme-radius-md': themeConfig.borderRadius.md,
    '--theme-radius-lg': themeConfig.borderRadius.lg,
    '--theme-radius-xl': themeConfig.borderRadius.xl,
    '--theme-shadow-sm': themeConfig.shadows.sm,
    '--theme-shadow-md': themeConfig.shadows.md,
    '--theme-shadow-lg': themeConfig.shadows.lg,
    '--theme-shadow-xl': themeConfig.shadows.xl,
  };
}

/**
 * Apply theme to document root
 */
export function applyTheme(themeConfig: ThemeConfig): void {
  if (typeof document === 'undefined') return;
  
  const variables = generateCSSVariables(themeConfig);
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Theme context for React components
 */
export const themeContext = {
  light: theme,
  dark: darkTheme,
  current: theme,
};

export default theme;
