'use client';

import React from 'react';
import { MessageSquare, Zap, Shield, Globe2, Cpu, Sparkles } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';


const FEATURES = [
  {
    id: 'feat-001',
    icon: Cpu,
    title: '9 Specialized AI Models',
    desc: 'Auto-routing picks the best model for coding, science, finance, translation & more',
  },
  {
    id: 'feat-002',
    icon: Zap,
    title: 'Real-time Streaming',
    desc: 'Responses appear word-by-word — no waiting for the full reply to generate',
  },
  {
    id: 'feat-003',
    icon: MessageSquare,
    title: 'Full Chat History',
    desc: 'Every conversation saved, searchable, and accessible from any device',
  },
  {
    id: 'feat-004',
    icon: Sparkles,
    title: 'Image Generation',
    desc: 'Create stunning images from text prompts using Riverflow v2 Pro',
  },
  {
    id: 'feat-005',
    icon: Globe2,
    title: 'Voice & File Input',
    desc: 'Speak your questions or upload .txt/.pdf files for instant AI analysis',
  },
  {
    id: 'feat-006',
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT authentication, encrypted storage, and no data sold to third parties',
  },
];

export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <AppLogo size={24} />
        </div>
        <span className="text-xl font-bold gradient-text">ChatAI</span>
      </div>
      {/* Hero text */}
      <div className="relative">
        <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
          The AI assistant
          <br />
          <span className="gradient-text">that thinks with you.</span>
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
          Multi-model intelligence, streaming responses, and a memory that keeps up with your work.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-8">
          {[
            { value: '9', label: 'AI Models' },
            { value: '∞', label: 'Chat history' },
            { value: '< 1s', label: 'First token' },
          ]?.map((stat) => (
            <div key={`stat-${stat?.label}`} className="text-center">
              <p className="text-2xl font-bold gradient-text tabular-nums">{stat?.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Features grid */}
      <div className="relative grid grid-cols-2 gap-3">
        {FEATURES?.map((feat) => {
          const Icon = feat?.icon;
          return (
            <div
              key={feat?.id}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/6 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{feat?.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feat?.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="relative">
        <p className="text-xs text-muted-foreground/50">
          Powered by OpenRouter · Built with Next.js · Deployed on Vercel
        </p>
      </div>
    </div>
  );
}