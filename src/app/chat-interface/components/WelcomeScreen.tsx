'use client';

import React from 'react';
import { Zap, Code2, Globe2, TrendingUp, FlaskConical, BookOpen } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { ModelType } from '@/lib/models';
import Icon from '@/components/ui/AppIcon';


interface WelcomeScreenProps {
  onPromptSelect: (prompt: string, model: ModelType) => void;
  userName?: string;
}

const SUGGESTED_PROMPTS = [
  {
    id: 'wp-001',
    icon: Code2,
    label: 'Write a function',
    prompt: 'Write a TypeScript function that debounces async API calls with proper error handling',
    model: 'coding' as ModelType,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 hover:bg-cyan-500/15 border-cyan-500/20',
  },
  {
    id: 'wp-002',
    icon: Zap,
    label: 'Explain a concept',
    prompt: 'Explain how transformer models work in AI, with simple analogies',
    model: 'technology' as ModelType,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 hover:bg-violet-500/15 border-violet-500/20',
  },
  {
    id: 'wp-003',
    icon: Globe2,
    label: 'Translate text',
    prompt: 'Translate "Innovation drives progress" into French, Spanish, and Japanese',
    model: 'translation' as ModelType,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 hover:bg-yellow-500/15 border-yellow-500/20',
  },
  {
    id: 'wp-004',
    icon: TrendingUp,
    label: 'Finance advice',
    prompt: 'What are the key differences between ETFs and index funds for a long-term investor?',
    model: 'finance' as ModelType,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/20',
  },
  {
    id: 'wp-005',
    icon: FlaskConical,
    label: 'Science question',
    prompt: 'How does CRISPR gene editing work and what are its current medical applications?',
    model: 'science' as ModelType,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20',
  },
  {
    id: 'wp-006',
    icon: BookOpen,
    label: 'Academic research',
    prompt: 'Summarize the key findings in recent research on large language model alignment',
    model: 'academic' as ModelType,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 hover:bg-indigo-500/15 border-indigo-500/20',
  },
];

export default function WelcomeScreen({ onPromptSelect, userName }: WelcomeScreenProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      {/* Logo + greeting */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
          <AppLogo size={36} className="rounded-xl" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">
          {greeting}{userName ? `, ${userName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground text-base">
          How can I help you today?
        </p>
      </div>

      {/* Suggested prompts */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SUGGESTED_PROMPTS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPromptSelect(item.prompt, item.model)}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-150 active:scale-98 ${item.bg}`}
            >
              <Icon size={18} className={item.color} />
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground/40 mt-8">
        Multi-model AI • Streaming responses • 9 specialized models
      </p>
    </div>
  );
}