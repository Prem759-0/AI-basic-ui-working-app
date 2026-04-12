'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { toast } from 'sonner';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Message, MODEL_LABELS, MODEL_COLORS } from '@/lib/models';
import { useTheme } from '@/components/ThemeProvider';
import AppLogo from '@/components/ui/AppLogo';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export default function ChatMessage({ message, isStreaming, onRegenerate }: ChatMessageProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<'up' | 'down' | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy message');
    }
  }, [message.content]);

  const isUser = message.role === 'user';

  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group px-4 py-2 message-enter">
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          <div className="bg-primary/90 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
            {message.content}
          </div>
          <span className="text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
            {formattedTime}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-1">
          <User size={14} className="text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 group px-4 py-2 message-enter">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0 mt-1">
        <AppLogo size={20} className="rounded-full" />
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        {/* Model badge */}
        {message.model && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${MODEL_COLORS[message.model]}`}>
              {MODEL_LABELS[message.model]}
            </span>
            {message.tokens && (
              <span className="text-xs text-muted-foreground/50">
                ~{message.tokens} tokens
              </span>
            )}
          </div>
        )}

        {/* Message content */}
        <div className="text-sm">
          <MarkdownRenderer
            content={message.content}
            isStreaming={isStreaming}
            theme={theme}
          />
        </div>

        {/* Actions */}
        {!isStreaming && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-md transition-all"
              title="Copy message"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-md transition-all"
                title="Regenerate response"
              >
                <RefreshCw size={12} />
                <span>Regenerate</span>
              </button>
            )}
            <div className="flex items-center gap-0.5 ml-1">
              <button
                onClick={() => setLiked(liked === 'up' ? null : 'up')}
                className={`p-1.5 rounded-md transition-all ${liked === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'}`}
                title="Good response"
              >
                <ThumbsUp size={12} />
              </button>
              <button
                onClick={() => setLiked(liked === 'down' ? null : 'down')}
                className={`p-1.5 rounded-md transition-all ${liked === 'down' ? 'text-rose-400 bg-rose-400/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'}`}
                title="Bad response"
              >
                <ThumbsDown size={12} />
              </button>
            </div>
            <span className="text-xs text-muted-foreground/40 ml-auto">{formattedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}