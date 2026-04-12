'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MessageSquare, Image as ImageIcon, Sparkles, Grid3X3, List, Trash2, ChevronLeft } from 'lucide-react';
import ImagePromptInput from './components/ImagePromptInput';
import GeneratedImageCard, { GeneratedImage } from './components/GeneratedImageCard';
import ImagePreviewModal from './components/ImagePreviewModal';
import GeneratingPlaceholder from './components/GeneratingPlaceholder';
import { ThemeProvider } from '@/components/ThemeProvider';

import { getAuthHeaders } from '@/lib/auth';

// Seed images for demo gallery
const SEED_IMAGES: GeneratedImage[] = [
  {
    id: 'img-seed-001',
    imageUrl: 'https://picsum.photos/seed/futuristic-city/1024/1024',
    prompt: 'A futuristic city at sunset with flying cars and neon lights, photorealistic 8K rendering',
    aspectRatio: '1:1',
    model: 'sourceful/riverflow-v2-pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'img-seed-002',
    imageUrl: 'https://picsum.photos/seed/japanese-garden/1024/576',
    prompt: 'A serene Japanese garden with cherry blossoms, koi pond, and morning mist, oil painting style',
    aspectRatio: '16:9',
    model: 'sourceful/riverflow-v2-pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 'img-seed-003',
    imageUrl: 'https://picsum.photos/seed/astronaut-space/1024/1024',
    prompt: 'An astronaut floating in deep space surrounded by colorful nebulae, cinematic lighting',
    aspectRatio: '1:1',
    model: 'sourceful/riverflow-v2-pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: 'img-seed-004',
    imageUrl: 'https://picsum.photos/seed/snowy-cabin/576/1024',
    prompt: 'A cozy cabin in a snowy forest at night with warm glowing windows and aurora borealis',
    aspectRatio: '9:16',
    model: 'sourceful/riverflow-v2-pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: 'img-seed-005',
    imageUrl: 'https://picsum.photos/seed/neural-network/1024/1024',
    prompt: 'Abstract digital art of interconnected neural networks pulsing with violet and cyan light',
    aspectRatio: '1:1',
    model: 'sourceful/riverflow-v2-pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: 'img-seed-006',
    imageUrl: 'https://picsum.photos/seed/underwater-city/1024/683',
    prompt: 'Underwater city ruins with bioluminescent coral and mysterious ancient architecture',
    aspectRatio: '3:2',
    model: 'sourceful/riverflow-v2-pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
  },
];

type ViewMode = 'grid' | 'list';

interface PendingGeneration {
  prompt: string;
  aspectRatio: string;
}

function ImageGenerationInner() {
  const router = useRouter();
  const [images, setImages] = useState<GeneratedImage[]>(SEED_IMAGES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState<PendingGeneration | null>(null);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleGenerate = useCallback(async (prompt: string, aspectRatio: string) => {
    setIsGenerating(true);
    setPendingGeneration({ prompt, aspectRatio });

    try {
      // Backend integration: POST /api/image with { prompt, aspectRatio }
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      if (!response.ok) {
        const err = await response.json() as { error?: string };
        throw new Error(err.error ?? 'Image generation failed');
      }

      const data = await response.json() as {
        imageUrl: string;
        prompt: string;
        model: string;
        aspectRatio: string;
        id: string;
      };

      const newImage: GeneratedImage = {
        id: data.id,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        aspectRatio: data.aspectRatio,
        model: data.model,
        createdAt: new Date(),
      };

      setImages((prev) => [newImage, ...prev]);
      toast.success('Image generated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Image generation failed. Please try again.';
      toast.error(message);
    } finally {
      setIsGenerating(false);
      setPendingGeneration(null);
    }
  }, []);

  const handleRegenerate = useCallback(
    (prompt: string, aspectRatio: string) => {
      handleGenerate(prompt, aspectRatio);
    },
    [handleGenerate]
  );

  const handleClearAll = useCallback(() => {
    if (images.length === 0) return;
    setImages([]);
    toast.success('Gallery cleared');
  }, [images.length]);

  const totalGenerated = images.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/chat-interface')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Back to Chat</span>
            </button>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <ImageIcon size={14} className="text-white" />
              </div>
              <span className="font-semibold text-foreground">Image Generation</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block tabular-nums">
              {totalGenerated} image{totalGenerated !== 1 ? 's' : ''} generated
            </span>

            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title="Grid view"
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title="List view"
              >
                <List size={14} />
              </button>
            </div>

            {images.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 hover:bg-destructive/10 rounded-lg transition-all"
              >
                <Trash2 size={12} />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            )}

            <button
              onClick={() => router.push('/chat-interface')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-white/20 rounded-lg transition-all"
            >
              <MessageSquare size={12} />
              <span className="hidden sm:inline">Chat</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left panel — input */}
          <div className="w-full xl:w-[420px] shrink-0">
            <div className="sticky top-24">
              {/* Panel header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles size={18} className="text-primary" />
                  <h1 className="text-xl font-bold text-foreground">Create an Image</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Describe what you want to see and let Riverflow v2 Pro bring it to life.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <ImagePromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>

              {/* Tips */}
              <div className="mt-4 p-4 bg-white/3 border border-border rounded-xl">
                <p className="text-xs font-medium text-foreground mb-2.5">Tips for better results</p>
                <ul className="space-y-1.5">
                  {[
                    'Include lighting details (golden hour, studio lighting, soft bokeh)',
                    'Specify art style (photorealistic, oil painting, anime, watercolor)',
                    'Add camera details (wide angle, macro, portrait lens)',
                    'Describe mood and atmosphere (dramatic, serene, mysterious)',
                  ].map((tip, idx) => (
                    <li key={`tip-${idx}`} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right panel — gallery */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {images.length === 0 && !isGenerating ? 'Your Gallery' : `Gallery · ${totalGenerated} images`}
              </h2>
            </div>

            {/* Empty state */}
            {images.length === 0 && !isGenerating ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-500/20 flex items-center justify-center mb-4 border border-white/10">
                  <ImageIcon size={28} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No images yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Describe an image in the prompt box and click Generate to create your first AI image.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5' :'flex flex-col gap-4'
                }
              >
                {/* Generating placeholder */}
                {isGenerating && pendingGeneration && (
                  <GeneratingPlaceholder
                    prompt={pendingGeneration.prompt}
                    aspectRatio={pendingGeneration.aspectRatio}
                  />
                )}

                {/* Generated images */}
                {images.map((img) => (
                  <GeneratedImageCard
                    key={img.id}
                    image={img}
                    onRegenerate={handleRegenerate}
                    onOpenPreview={setPreviewImage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}

export default function ImageGenerationPage() {
  return (
    <ThemeProvider>
      <ImageGenerationInner />
    </ThemeProvider>
  );
}