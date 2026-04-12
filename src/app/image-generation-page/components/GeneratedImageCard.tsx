'use client';

import React, { useState, useCallback } from 'react';
import { Download, Copy, RefreshCw, ZoomIn, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
  model: string;
  createdAt: Date;
}

interface GeneratedImageCardProps {
  image: GeneratedImage;
  onRegenerate: (prompt: string, aspectRatio: string) => void;
  onOpenPreview: (image: GeneratedImage) => void;
}

export default function GeneratedImageCard({ image, onRegenerate, onOpenPreview }: GeneratedImageCardProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleDownload = useCallback(async () => {
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
      // Fallback: open in new tab
      window.open(image.imageUrl, '_blank');
      toast.info('Image opened in new tab');
    }
  }, [image]);

  const handleCopyPrompt = useCallback(async () => {
    await navigator.clipboard.writeText(image.prompt);
    setCopiedPrompt(true);
    toast.success('Prompt copied');
    setTimeout(() => setCopiedPrompt(false), 2000);
  }, [image.prompt]);

  const aspectClass =
    image.aspectRatio === '16:9' ?'aspect-video'
      : image.aspectRatio === '9:16' ?'aspect-[9/16]'
      : image.aspectRatio === '3:2' ?'aspect-[3/2]' :'aspect-square';

  const timeAgo = (() => {
    const diffMs = Date.now() - new Date(image.createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  })();

  return (
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-200 hover:shadow-xl hover:shadow-black/20">
      {/* Image */}
      <div className={`relative ${aspectClass} overflow-hidden bg-white/5`}>
        <AppImage
          src={image.imageUrl}
          alt={`AI generated image: ${image.prompt.substring(0, 80)}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onOpenPreview(image)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all"
          >
            <ZoomIn size={15} />
            Preview
          </button>
        </div>

        {/* Aspect ratio badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80 font-mono">
          {image.aspectRatio}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed mb-3">
          {image.prompt}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo}
          </span>
          <span className="font-mono truncate max-w-[120px]">{image.model.split('/')[1]}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/8 hover:bg-white/12 border border-border hover:border-white/20 rounded-lg text-xs text-foreground transition-all"
          >
            <Download size={12} />
            Download
          </button>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-border hover:border-white/20 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
            title="Copy prompt"
          >
            {copiedPrompt ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
          <button
            onClick={() => onRegenerate(image.prompt, image.aspectRatio)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-border hover:border-white/20 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
            title="Regenerate with same prompt"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}