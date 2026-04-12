'use client';

import React from 'react';
import AuthBrandPanel from './components/AuthBrandPanel';
import AuthForm from './components/AuthForm';
import { ThemeProvider } from '@/components/ThemeProvider';
import AppLogo from '@/components/ui/AppLogo';

function SignUpLoginInner() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left brand panel */}
      <div className="flex-1 border-r border-border">
        <AuthBrandPanel />
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 py-12 shrink-0">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <AppLogo size={32} />
          <span className="text-lg font-bold gradient-text">ChatAI</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1.5">Welcome to ChatAI</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account or create a new one to get started.
          </p>
        </div>

        <AuthForm />

        <p className="text-xs text-muted-foreground/40 text-center mt-8">
          © 2026 ChatAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function SignUpLoginPage() {
  return (
    <ThemeProvider>
      <SignUpLoginInner />
    </ThemeProvider>
  );
}