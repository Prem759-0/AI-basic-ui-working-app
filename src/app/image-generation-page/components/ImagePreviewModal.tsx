'use client';

import React, { useEffect, useCallback } from 'react';
import { X, Download, Copy, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import { GeneratedImage } from './GeneratedImageCard';

interface ImagePreviewModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onRegenerate: (prompt: string, aspectRatio: string) => void;
}

export default function ImagePreviewModal({ image, onClose, onRegenerate }: ImagePreviewModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleDownload = useCallback(async () => {
    if (!image) return;
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatai-image-${image.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image downloaded');
    } catch {
      window.open(image?.imageUrl, '_blank');
    }
  }, [image]);

  const handleCopyPrompt = useCallback(async () => {
    if (!image) return;
    await navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
  }, [image]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all"
        >
          <X size={16} />
        </button>

        {/* Image */}
        <div className="relative flex-1 bg-black/50 min-h-[300px] lg:min-h-0">
          <AppImage
            src={image.imageUrl}
            alt={`Full preview: ${image.prompt.substring(0, 80)}`}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-80 p-6 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto scrollbar-thin">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Prompt</p>
            <p className="text-sm text-foreground leading-relaxed">{image.prompt}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Aspect ratio</p>
              <p className="text-sm font-mono font-medium text-foreground">{image.aspectRatio}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Model</p>
              <p className="text-sm font-mono font-medium text-foreground truncate">{image.model.split('/')[1]}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Generated</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(image.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Image ID</p>
              <p className="text-sm font-mono text-muted-foreground truncate">{image.id}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
            >
              <Download size={15} />
              Download Image
            </button>
            <button
              onClick={handleCopyPrompt}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/8 hover:bg-white/12 border border-border rounded-xl text-sm text-foreground transition-all"
            >
              <Copy size={15} />
              Copy Prompt
            </button>
            <button
              onClick={() => { onRegenerate(image.prompt, image.aspectRatio); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/8 hover:bg-white/12 border border-border rounded-xl text-sm text-foreground transition-all"
            >
              <RefreshCw size={15} />
              Regenerate
            </button>
            <a
              href={image.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/8 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <ExternalLink size={15} />
              Open original
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}