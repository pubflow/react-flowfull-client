/**
 * Pubflow Configuration for TanStack Start
 * 
 * Environment-based configuration for the Pubflow framework
 */

// Environment variables with fallbacks
export const PUBFLOW_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787',
  BRIDGE_BASE_PATH: import.meta.env.VITE_BRIDGE_BASE_PATH || '/bridge',
  AUTH_BASE_PATH: import.meta.env.VITE_AUTH_BASE_PATH || '/auth',
  BRIDGE_SECRET: import.meta.env.VITE_BRIDGE_SECRET || import.meta.env.VITE_BRIDGE_VALIDATION_SECRET || '',
  
  // Branding Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Flowfull Client',
  APP_LOGO: import.meta.env.VITE_APP_LOGO || '',
  PRIMARY_COLOR: import.meta.env.VITE_PRIMARY_COLOR || '#006aff',
  SECONDARY_COLOR: import.meta.env.VITE_SECONDARY_COLOR || '#4a90e2',
  ACCENT_COLOR: import.meta.env.VITE_ACCENT_COLOR || '#06b6d4',
  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'system',
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  
  // Authentication Configuration
  LOGIN_REDIRECT_PATH: import.meta.env.VITE_LOGIN_REDIRECT_PATH || '/login',
  PUBLIC_PATHS: import.meta.env.VITE_PUBLIC_PATHS || '/login,/register,/forgot-password,/',
  ENABLE_ACCOUNT_CREATION: import.meta.env.VITE_ENABLE_ACCOUNT_CREATION !== 'false',
  ENABLE_PASSWORD_RESET: import.meta.env.VITE_ENABLE_PASSWORD_RESET !== 'false',
  
  // Debug Configuration
  ENABLE_DEBUG_TOOLS: import.meta.env.VITE_ENABLE_DEBUG_TOOLS === 'true',
  
  // Session Configuration
  SHOW_SESSION_ALERTS: import.meta.env.VITE_SHOW_SESSION_ALERTS === 'true',
  
  // Cache Configuration
  ENABLE_PERSISTENT_CACHE: import.meta.env.VITE_ENABLE_PERSISTENT_CACHE === 'true'
};

/**
 * Build API URL helper
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = PUBFLOW_CONFIG.API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `${baseUrl}/${cleanEndpoint}`;
}

/**
 * Check if current path is public (manual configuration)
 */
export function isPublicPath(pathname: string): boolean {
  const publicPaths = PUBFLOW_CONFIG.PUBLIC_PATHS.split(',')
    .map((path: string) => path.trim())
    .filter(Boolean);

  return publicPaths.some((path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });
}

/**
 * Get redirect URL after login
 */
export function getRedirectUrl(): string {
  if (typeof window === 'undefined') return '/';
  
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  
  return redirect && !isPublicPath(redirect) ? redirect : '/dashboard';
}
