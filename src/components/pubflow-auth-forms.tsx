'use client';

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { type TwoFactorMethod, useAuth } from '@pubflow/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PUBFLOW_CONFIG } from '@/lib/pubflow-config';

type ProviderId = 'google' | 'github' | string;
export type LoginStep = 'credentials' | 'two-factor';

type AuthFormBaseProps = {
  onSuccess?: (user?: unknown) => void;
  onError?: (error: string) => void;
  onBackToLogin?: () => void;
};

type LoginProps = AuthFormBaseProps & {
  redirectPath: string;
  onPasswordReset: () => void;
  onAccountCreation: () => void;
  onSocialLogin: (provider: ProviderId) => void;
  onStepChange?: (step: LoginStep) => void;
};

type RegisterProps = AuthFormBaseProps;

type PasswordResetProps = AuthFormBaseProps & {
  resetToken?: string;
};

function providerLabel(provider: ProviderId) {
  if (provider === 'google') return 'Google';
  if (provider === 'github') return 'GitHub';
  return provider.replace(/(^|-)([a-z])/g, segment => segment.toUpperCase()).replaceAll('-', ' ');
}

function ProviderIcon({ provider }: { provider: ProviderId }) {
  if (provider === 'github') return <span className="auth-provider-gh">GH</span>;
  if (provider === 'google') return <span className="auth-provider-g">G</span>;
  return <Sparkles size={18} />;
}

function methodLabel(method: TwoFactorMethod) {
  const methodName = method.method.toUpperCase();
  return method.identifier ? `${methodName} · ${method.identifier}` : methodName;
}

async function parseError(response: Response, fallback: string) {
  try {
    const data = await response.json() as Record<string, unknown>;
    return String(data?.error || data?.message || fallback);
  } catch {
    return fallback;
  }
}

function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="custom-auth-alert custom-auth-alert-error" role="alert">
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
}

function AuthSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="custom-auth-alert custom-auth-alert-success" role="status">
      <CheckCircle2 size={16} />
      <span>{message}</span>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="custom-auth-field" htmlFor={id}>
      <span className="custom-auth-label">{label}</span>
      <span className={`custom-auth-input-wrap ${error ? 'is-invalid' : ''}`}>
        <span className="custom-auth-input-icon">{icon}</span>
        {children}
      </span>
      {error ? <span className="custom-auth-field-error">{error}</span> : null}
    </label>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  showPassword,
  onToggleShow,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  showPassword: boolean;
  onToggleShow: () => void;
}) {
  return (
    <Field id={id} label={label} icon={<Lock size={18} />}>
      <input
        id={id}
        className="custom-auth-input"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={event => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <button className="custom-auth-eye" type="button" onClick={onToggleShow} aria-label={showPassword ? 'Hide password' : 'Show password'}>
        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </Field>
  );
}

export function CustomLoginForm({
  redirectPath: _redirectPath,
  onSuccess,
  onError,
  onPasswordReset,
  onAccountCreation,
  onSocialLogin,
  onStepChange,
}: LoginProps) {
  const { t } = useTranslation();
  const {
    login,
    verifyTwoFactor,
    startTwoFactor,
    isLoading,
    twoFactorPending,
    twoFactorMethods,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<LoginStep>('credentials');
  const [otp, setOtp] = useState('');
  const [activeMethodId, setActiveMethodId] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const socialProviders = PUBFLOW_CONFIG.LOGIN_PROVIDERS;

  function goToStep(next: LoginStep) {
    setStep(next);
    onStepChange?.(next);
  }

  useEffect(() => {
    if (!twoFactorPending) return;
    setStep('two-factor');
    onStepChange?.('two-factor');
    if (!activeMethodId && twoFactorMethods[0]) {
      setActiveMethodId(twoFactorMethods[0].id);
    }
  }, [activeMethodId, onStepChange, twoFactorMethods, twoFactorPending]);

  const activeMethod = useMemo(
    () => twoFactorMethods.find(method => method.id === activeMethodId) || twoFactorMethods[0],
    [activeMethodId, twoFactorMethods],
  );

  async function submitCredentials(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t('authCustom.errors.credentials', 'Enter your email and password.'));
      return;
    }

    try {
      const result = await login({ email: email.trim().toLowerCase(), password });
      if (result?.requires2fa) {
        goToStep('two-factor');
        const firstMethod = result.availableMethods?.[0] || twoFactorMethods[0];
        if (firstMethod) setActiveMethodId(firstMethod.id);
        return;
      }
      if (result?.success) {
        onSuccess?.(result.user);
        return;
      }
      const message = String(result?.error || t('authCustom.errors.invalidLogin', 'Invalid credentials.'));
      setError(message);
      onError?.(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('authCustom.errors.connection', 'Connection error. Please try again.');
      setError(message);
      onError?.(message);
    }
  }

  async function submitTwoFactor(event: FormEvent) {
    event.preventDefault();
    if (!activeMethod) {
      setError(t('authCustom.errors.noTwoFactorMethod', 'No verification method is available.'));
      return;
    }

    setError('');
    setOtpLoading(true);
    try {
      const result = await verifyTwoFactor(activeMethod.id, otp.trim());
      if (result.verified || result.session_activated) {
        onSuccess?.();
        return;
      }
      const message = String(result.error || t('authCustom.errors.invalidCode', 'The verification code is not valid.'));
      setError(message);
      onError?.(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('authCustom.errors.verifyFailed', 'Verification failed.');
      setError(message);
      onError?.(message);
    } finally {
      setOtpLoading(false);
    }
  }

  async function resendCode() {
    if (!activeMethod) return;
    setOtpLoading(true);
    setError('');
    try {
      await startTwoFactor(activeMethod.id, activeMethod.method);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('authCustom.errors.resendFailed', 'Could not resend the code.');
      setError(message);
      onError?.(message);
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <div className="custom-auth-form">
      <AuthError message={error} />

      {step === 'two-factor' ? (
        <form onSubmit={submitTwoFactor} className="custom-auth-stack">
          {twoFactorMethods.length > 1 ? (
            <label className="custom-auth-field">
              <span className="custom-auth-label">{t('authCustom.method', 'Verification method')}</span>
              <select
                className="custom-auth-select"
                value={activeMethodId}
                onChange={event => setActiveMethodId(event.target.value)}
                disabled={otpLoading}
              >
                {twoFactorMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {methodLabel(method)}
                  </option>
                ))}
              </select>
            </label>
          ) : activeMethod ? (
            <div className="custom-auth-method-pill">{methodLabel(activeMethod)}</div>
          ) : null}

          <Field id="otp" label={t('authCustom.code', 'Security code')} icon={<KeyRound size={18} />}>
            <input
              id="otp"
              className="custom-auth-input custom-auth-otp"
              value={otp}
              onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 8))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              autoFocus
            />
          </Field>

          <Button className="custom-auth-primary" type="submit" disabled={otpLoading || otp.length < 4}>
            {otpLoading ? <Loader2 className="spin" size={16} /> : <ShieldCheck size={16} />}
            {t('authCustom.verify', 'Verify code')}
          </Button>
          <div className="custom-auth-link-row">
            <button type="button" onClick={resendCode} disabled={otpLoading}>
              {t('authCustom.resend', 'Resend code')}
            </button>
            <button type="button" onClick={() => goToStep('credentials')} disabled={otpLoading}>
              {t('actions.goLogin', 'Back to login')}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitCredentials} className="custom-auth-stack">
          {socialProviders.length ? (
            <div className="custom-auth-social-grid">
              {socialProviders.map(provider => (
                <button key={provider} type="button" className="custom-auth-provider" onClick={() => onSocialLogin(provider)}>
                  <ProviderIcon provider={provider} />
                  {t('authCustom.continueWith', 'Continue with')} {providerLabel(provider)}
                </button>
              ))}
            </div>
          ) : null}

          {socialProviders.length ? <div className="custom-auth-divider"><span>{t('authCustom.orEmail', 'or use email')}</span></div> : null}

          <Field id="email" label={t('authCustom.email', 'Email address')} icon={<Mail size={18} />}>
            <input
              id="email"
              className="custom-auth-input"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="email"
              placeholder={t('authCustom.emailPlaceholder', 'you@example.com')}
            />
          </Field>

          <PasswordField
            id="password"
            label={t('authCustom.password', 'Password')}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder={t('authCustom.passwordPlaceholder', 'Enter your password')}
            showPassword={showPassword}
            onToggleShow={() => setShowPassword(value => !value)}
          />

          <div className="custom-auth-options">
            <label>
              <input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} />
              <span>{t('authCustom.remember', 'Remember me')}</span>
            </label>
            {PUBFLOW_CONFIG.ENABLE_PASSWORD_RESET ? (
              <button type="button" onClick={onPasswordReset}>
                {t('auth.forgotPassword', 'Forgot password?')}
              </button>
            ) : null}
          </div>

          <Button className="custom-auth-primary" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="spin" size={16} /> : <ShieldCheck size={16} />}
            {t('login.signIn', 'Sign in')}
          </Button>

          {PUBFLOW_CONFIG.ENABLE_ACCOUNT_CREATION ? (
            <button className="custom-auth-secondary-action" type="button" onClick={onAccountCreation}>
              {t('register.title', 'Create new account')}
            </button>
          ) : null}
        </form>
      )}
    </div>
  );
}

export function CustomRegisterForm({ onSuccess, onError, onBackToLogin }: RegisterProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
      setError(t('authCustom.errors.requiredFields', 'Complete all required fields.'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('authCustom.errors.passwordLength', 'Password must be at least 6 characters.'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('authCustom.errors.passwordMismatch', 'Passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL.replace(/\/$/, '')}/auth/register/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          name: form.name.trim(),
          lastName: form.lastName.trim(),
        }),
      });
      if (!response.ok) throw new Error(await parseError(response, t('authCustom.errors.registerFailed', 'Could not create the account.')));
      setSuccess(t('register.success', 'Account created successfully.'));
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('authCustom.errors.registerFailed', 'Could not create the account.');
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="custom-auth-form custom-auth-stack" onSubmit={submit}>
      <AuthError message={error} />
      <AuthSuccess message={success} />

      <div className="custom-auth-two-cols">
        <Field id="name" label={t('authCustom.firstName', 'First name')} icon={<User size={18} />}>
          <input id="name" className="custom-auth-input" value={form.name} onChange={event => update('name', event.target.value)} autoComplete="given-name" />
        </Field>
        <Field id="lastName" label={t('authCustom.lastName', 'Last name')} icon={<User size={18} />}>
          <input id="lastName" className="custom-auth-input" value={form.lastName} onChange={event => update('lastName', event.target.value)} autoComplete="family-name" />
        </Field>
      </div>

      <Field id="registerEmail" label={t('authCustom.email', 'Email address')} icon={<Mail size={18} />}>
        <input id="registerEmail" className="custom-auth-input" type="email" value={form.email} onChange={event => update('email', event.target.value)} autoComplete="email" />
      </Field>

      <PasswordField
        id="registerPassword"
        label={t('authCustom.password', 'Password')}
        value={form.password}
        onChange={value => update('password', value)}
        autoComplete="new-password"
        showPassword={showPassword}
        onToggleShow={() => setShowPassword(value => !value)}
      />

      <PasswordField
        id="confirmPassword"
        label={t('authCustom.confirmPassword', 'Confirm password')}
        value={form.confirmPassword}
        onChange={value => update('confirmPassword', value)}
        autoComplete="new-password"
        showPassword={showPassword}
        onToggleShow={() => setShowPassword(value => !value)}
      />

      <Button className="custom-auth-primary" type="submit" disabled={loading}>
        {loading ? <Loader2 className="spin" size={16} /> : <CheckCircle2 size={16} />}
        {t('register.title', 'Create account')}
      </Button>
      <button className="custom-auth-secondary-action" type="button" onClick={onBackToLogin}>
        <ArrowLeft size={15} /> {t('actions.goLogin', 'Back to login')}
      </button>
    </form>
  );
}

export function CustomPasswordResetForm({ resetToken, onSuccess, onError, onBackToLogin }: PasswordResetProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (resetToken) {
        if (password.length < 6) throw new Error(t('authCustom.errors.passwordLength', 'Password must be at least 6 characters.'));
        if (password !== confirmPassword) throw new Error(t('authCustom.errors.passwordMismatch', 'Passwords do not match.'));

        const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL.replace(/\/$/, '')}/auth/password-reset/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, password }),
        });
        if (!response.ok) throw new Error(await parseError(response, t('authCustom.errors.resetFailed', 'Could not reset the password.')));
        setSuccess(t('passwordReset.success', 'Password reset successfully.'));
        onSuccess?.();
        return;
      }

      if (!email.trim()) throw new Error(t('authCustom.errors.emailRequired', 'Enter your email address.'));
      const resetUrl = `${window.location.origin}/reset-password`;
      const response = await fetch(`${PUBFLOW_CONFIG.API_BASE_URL.replace(/\/$/, '')}/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), resetUrl }),
      });
      if (!response.ok) throw new Error(await parseError(response, t('authCustom.errors.resetRequestFailed', 'Could not send reset instructions.')));
      setSuccess(t('authCustom.resetSent', 'If the account exists, reset instructions were sent.'));
    } catch (err) {
      const message = err instanceof Error ? err.message : t('authCustom.errors.resetFailed', 'Could not reset the password.');
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="custom-auth-form custom-auth-stack" onSubmit={submit}>
      <AuthError message={error} />
      <AuthSuccess message={success} />

      {resetToken ? (
        <>
          <PasswordField
            id="newPassword"
            label={t('authCustom.newPassword', 'New password')}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            showPassword={showPassword}
            onToggleShow={() => setShowPassword(value => !value)}
          />
          <PasswordField
            id="newPasswordConfirm"
            label={t('authCustom.confirmPassword', 'Confirm password')}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            showPassword={showPassword}
            onToggleShow={() => setShowPassword(value => !value)}
          />
        </>
      ) : (
        <Field id="resetEmail" label={t('authCustom.email', 'Email address')} icon={<Mail size={18} />}>
          <input id="resetEmail" className="custom-auth-input" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" />
        </Field>
      )}

      <Button className="custom-auth-primary" type="submit" disabled={loading}>
        {loading ? <Loader2 className="spin" size={16} /> : <KeyRound size={16} />}
        {resetToken ? t('passwordReset.resetTitle', 'Reset password') : t('passwordReset.title', 'Send reset link')}
      </Button>
      <button className="custom-auth-secondary-action" type="button" onClick={onBackToLogin}>
        <ArrowLeft size={15} /> {t('actions.goLogin', 'Back to login')}
      </button>
    </form>
  );
}
