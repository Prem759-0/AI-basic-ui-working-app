'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/lib/models';

interface ChatAreaProps {
  messages: Message[];
  streamingMessageId: string | null;
  onRegenerate: (messageId: string) => void;
}

export default function ChatArea({ messages, streamingMessageId, onRegenerate }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessageId]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin py-4"
    >
      <div className="max-w-3xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={`msg-${msg.id}`}
            message={msg}
            isStreaming={streamingMessageId === msg.id}
            onRegenerate={
              msg.role === 'assistant' && idx === messages.length - 1
                ? () => onRegenerate(msg.id)
                : undefined
            }
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}