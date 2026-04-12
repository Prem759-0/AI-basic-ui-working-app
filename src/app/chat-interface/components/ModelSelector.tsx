'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { ModelType, MODEL_LABELS, MODEL_COLORS, AI_MODELS } from '@/lib/models';

interface ModelSelectorProps {
  value: ModelType;
  onChange: (model: ModelType) => void;
}

const MODEL_DESCRIPTIONS: Record<ModelType, string> = {
  general: 'Balanced responses for everyday questions',
  coding: 'Optimized for code, debugging & technical tasks',
  roleplay: 'Creative writing, stories & character roleplay',
  seo: 'SEO strategy, keywords & content optimization',
  technology: 'Deep tech, infrastructure & engineering',
  science: 'Scientific research, biology, physics & chemistry',
  translation: 'Accurate multilingual translation',
  finance: 'Financial analysis, markets & investment',
  academic: 'Research papers, citations & scholarly content',
  image: 'Generate images from text prompts',
};

const MODEL_ICONS: Record<ModelType, string> = {
  general: '✦',
  coding: '⟨⟩',
  roleplay: '◈',
  seo: '⊕',
  technology: '⚙',
  science: '⬡',
  translation: '⇄',
  finance: '◎',
  academic: '⊞',
  image: '◉',
};

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modelTypes = Object.keys(MODEL_LABELS).filter((k) => k !== 'image') as ModelType[];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 hover:bg-white/10 ${MODEL_COLORS[value]}`}
      >
        <span className="font-mono text-base leading-none">{MODEL_ICONS[value]}</span>
        <span>{MODEL_LABELS[value]}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center gap-2">
            <Cpu size={13} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select AI Model</span>
          </div>
          <div className="p-1.5 max-h-72 overflow-y-auto scrollbar-thin">
            {modelTypes.map((modelType) => (
              <button
                key={`model-opt-${modelType}`}
                onClick={() => {
                  onChange(modelType);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 hover:bg-white/8 ${
                  value === modelType ? 'bg-primary/10' : ''
                }`}
              >
                <span className="font-mono text-base mt-0.5 w-5 text-center">{MODEL_ICONS[modelType]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${MODEL_COLORS[modelType]}`}>
                      {MODEL_LABELS[modelType]}
                    </span>
                    {value === modelType && (
                      <span className="text-xs text-primary font-medium">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{MODEL_DESCRIPTIONS[modelType]}</p>
                  <p className="text-xs text-muted-foreground/50 mt-0.5 font-mono truncate">{AI_MODELS[modelType]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}