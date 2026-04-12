'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Loader2, Shuffle, X } from 'lucide-react';


interface ImagePromptInputProps {
  onGenerate: (prompt: string, aspectRatio: string) => void;
  isGenerating: boolean;
}

const ASPECT_RATIOS = [
  { id: 'ar-square', value: '1:1', label: '1:1', description: 'Square' },
  { id: 'ar-landscape', value: '16:9', label: '16:9', description: 'Landscape' },
  { id: 'ar-portrait', value: '9:16', label: '9:16', description: 'Portrait' },
  { id: 'ar-wide', value: '3:2', label: '3:2', description: 'Wide' },
];

const EXAMPLE_PROMPTS = [
  'A futuristic city at sunset with flying cars and neon lights, photorealistic',
  'A serene Japanese garden with cherry blossoms, koi pond, and morning mist, oil painting style',
  'An astronaut floating in deep space surrounded by colorful nebulae, cinematic lighting',
  'A cozy cabin in a snowy forest at night with warm glowing windows and aurora borealis',
  'A hyperrealistic portrait of a wise elderly wizard with silver hair and glowing eyes',
  'Abstract digital art of interconnected neural networks pulsing with violet and cyan light',
  'A majestic dragon perched on a mountain peak at dawn, fantasy illustration',
  'Underwater city ruins with bioluminescent coral and mysterious ancient architecture',
];

export default function ImagePromptInput({ onGenerate, isGenerating }: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRandomPrompt = useCallback(() => {
    const randomIdx = Math.floor(Date.now() / 1000) % EXAMPLE_PROMPTS.length;
    setPrompt(EXAMPLE_PROMPTS[randomIdx]);
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || isGenerating) return;
      onGenerate(prompt.trim(), aspectRatio);
    },
    [prompt, aspectRatio, isGenerating, onGenerate]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Prompt textarea */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Describe your image
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Be specific about style, lighting, composition, and mood for best results
        </p>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A breathtaking mountain landscape at golden hour, with dramatic clouds and a lone hiker silhouetted against the sky, photorealistic 8K..."
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none scrollbar-thin"
          />
          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground/50 tabular-nums">{prompt.length} chars</span>
          <button
            type="button"
            onClick={handleRandomPrompt}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Shuffle size={11} />
            Random prompt
          </button>
        </div>
      </div>

      {/* Aspect ratio selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Aspect ratio</label>
        <div className="flex gap-2 flex-wrap">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.id}
              type="button"
              onClick={() => setAspectRatio(ar.value)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                aspectRatio === ar.value
                  ? 'bg-primary/15 border-primary/50 text-primary' :'bg-white/5 border-border text-muted-foreground hover:text-foreground hover:border-white/20'
              }`}
            >
              <span className="font-semibold">{ar.label}</span>
              <span className="text-xs opacity-70 mt-0.5">{ar.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Model info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/8 border border-rose-500/20 rounded-xl">
        <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
        <span className="text-xs text-rose-300 font-medium">Model:</span>
        <span className="text-xs font-mono text-muted-foreground">sourceful/riverflow-v2-pro</span>
      </div>

      {/* Generate button */}
      <button
        type="submit"
        disabled={!prompt.trim() || isGenerating}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-violet-500/25"
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Generating image...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Generate Image</span>
          </>
        )}
      </button>
    </form>
  );
}