'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Copy, Check, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/lib/auth';

type AuthTab = 'login' | 'signup';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface DemoCredential {
  role: string;
  email: string;
  password: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  { role: 'Demo User', email: 'demo@chatai.app', password: 'ChatAI@2026' },
];

function CredentialBox({ onAutofill }: { onAutofill: (email: string, password: string) => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }, []);

  return (
    <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
      <p className="text-xs font-medium text-violet-300 mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
        Demo Credentials
      </p>
      {DEMO_CREDENTIALS.map((cred, idx) => (
        <div key={`cred-${idx}`} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16 shrink-0">Email</span>
            <code className="flex-1 text-xs bg-white/5 px-2 py-1 rounded text-foreground font-mono">{cred.email}</code>
            <button
              onClick={() => handleCopy(cred.email, 'email')}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedField === 'email' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16 shrink-0">Password</span>
            <code className="flex-1 text-xs bg-white/5 px-2 py-1 rounded text-foreground font-mono">{cred.password}</code>
            <button
              onClick={() => handleCopy(cred.password, 'password')}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedField === 'password' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            </button>
          </div>
          <button
            onClick={() => onAutofill(cred.email, cred.password)}
            className="w-full mt-1 flex items-center justify-center gap-1.5 text-xs text-violet-300 hover:text-violet-200 border border-violet-500/20 hover:border-violet-500/40 rounded-lg py-1.5 transition-all hover:bg-violet-500/10"
          >
            Use these credentials
            <ArrowRight size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const signupForm = useForm<SignupFormData>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', agreeTerms: false },
  });

  const handleAutofill = useCallback(
    (email: string, password: string) => {
      loginForm.setValue('email', email);
      loginForm.setValue('password', password);
      toast.info('Credentials filled — click Sign In');
    },
    [loginForm]
  );

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      try {
        // Backend integration: POST /api/auth with { action: 'login', email, password }
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email: data.email, password: data.password }),
        });

        const result = await response.json() as { token?: string; error?: string };

        if (!response.ok || !result.token) {
          throw new Error(result.error ?? 'Login failed');
        }

        setAuthToken(result.token);
        toast.success('Welcome back! Redirecting...');
        setTimeout(() => router.push('/chat-interface'), 800);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
        loginForm.setError('root', { message });
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [loginForm, router]
  );

  const handleSignup = useCallback(
    async (data: SignupFormData) => {
      if (data.password !== data.confirmPassword) {
        signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
        return;
      }
      setIsLoading(true);
      try {
        // Backend integration: POST /api/auth with { action: 'signup', email, password, name }
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signup', email: data.email, password: data.password, name: data.name }),
        });

        const result = await response.json() as { token?: string; error?: string };

        if (!response.ok || !result.token) {
          throw new Error(result.error ?? 'Signup failed');
        }

        setAuthToken(result.token);
        toast.success('Account created! Welcome to ChatAI.');
        setTimeout(() => router.push('/chat-interface'), 800);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
        signupForm.setError('root', { message });
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [signupForm, router]
  );

  return (
    <div className="w-full max-w-md">
      {/* Tab switcher */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
        {(['login', 'signup'] as AuthTab[]).map((t) => (
          <button
            key={`tab-${t}`}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              tab === t
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>

      {/* Login Form */}
      {tab === 'login' && (
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
          {loginForm.formState.errors.root && (
            <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {loginForm.formState.errors.root.message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                {...loginForm.register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            {loginForm.formState.errors.email && (
              <p className="mt-1.5 text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...loginForm.register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="mt-1.5 text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...loginForm.register('remember')}
                className="w-4 h-4 rounded border-border bg-white/5 accent-primary"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-150 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <CredentialBox onAutofill={handleAutofill} />
        </form>
      )}

      {/* Signup Form */}
      {tab === 'signup' && (
        <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
          {signupForm.formState.errors.root && (
            <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {signupForm.formState.errors.root.message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                {...signupForm.register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                placeholder="Arjun Mehta"
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            {signupForm.formState.errors.name && (
              <p className="mt-1.5 text-xs text-destructive">{signupForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                {...signupForm.register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            {signupForm.formState.errors.email && (
              <p className="mt-1.5 text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <p className="text-xs text-muted-foreground mb-1.5">Minimum 8 characters with at least one number</p>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...signupForm.register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: { value: /(?=.*[0-9])/, message: 'Password must contain at least one number' },
                })}
                placeholder="Create a strong password"
                className="w-full pl-9 pr-10 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {signupForm.formState.errors.password && (
              <p className="mt-1.5 text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...signupForm.register('confirmPassword', {
                  required: 'Please confirm your password',
                })}
                placeholder="Repeat your password"
                className="w-full pl-9 pr-10 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {signupForm.formState.errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...signupForm.register('agreeTerms', { required: 'You must agree to the terms' })}
                className="w-4 h-4 mt-0.5 rounded border-border bg-white/5 accent-primary shrink-0"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2">Privacy Policy</a>
              </span>
            </label>
            {signupForm.formState.errors.agreeTerms && (
              <p className="mt-1.5 text-xs text-destructive">{signupForm.formState.errors.agreeTerms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-150 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}