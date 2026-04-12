'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface GeneratingPlaceholderProps {
  prompt: string;
  aspectRatio: string;
}

export default function GeneratingPlaceholder({ prompt, aspectRatio }: GeneratingPlaceholderProps) {
  const aspectClass =
    aspectRatio === '16:9' ?'aspect-video'
      : aspectRatio === '9:16' ?'aspect-[9/16]'
      : aspectRatio === '3:2' ?'aspect-[3/2]' :'aspect-square';

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Animated placeholder */}
      <div className={`relative ${aspectClass} bg-gradient-to-br from-violet-900/30 to-cyan-900/20 overflow-hidden`}>
        {/* Animated shimmer */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* Floating particles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600/50 to-cyan-500/50 flex items-center justify-center animate-pulse-slow">
              <Sparkles size={20} className="text-white/80" />
            </div>
            <div className="space-y-1.5 text-center">
              <div className="h-2 w-32 bg-white/10 rounded-full animate-pulse" />
              <div className="h-2 w-24 bg-white/8 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Aspect ratio badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80 font-mono">
          {aspectRatio}
        </div>

        {/* Generating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/30 backdrop-blur-sm border border-violet-500/40 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs text-violet-200 font-medium">Generating</span>
        </div>
      </div>

      {/* Info skeleton */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed">{prompt}</p>
        <div className="space-y-2">
          <div className="h-2 w-full bg-white/8 rounded-full animate-pulse" />
          <div className="h-2 w-3/4 bg-white/6 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 h-8 bg-white/8 rounded-lg animate-pulse" />
          <div className="w-10 h-8 bg-white/6 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="w-10 h-8 bg-white/6 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}