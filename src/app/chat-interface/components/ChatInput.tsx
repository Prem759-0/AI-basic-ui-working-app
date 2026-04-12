'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Square, Mic, MicOff, Paperclip, X, Sparkles,  } from 'lucide-react';
import { toast } from 'sonner';
import ModelSelector from './ModelSelector';
import { ModelType } from '@/lib/models';
import { PROMPT_TEMPLATES as PT } from '@/lib/mockData';

interface ChatInputProps {
  onSend: (message: string, modelType: ModelType, file?: File) => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled?: boolean;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export default function ChatInput({
  onSend,
  isStreaming,
  onStop,
  disabled,
  selectedModel,
  onModelChange,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed && !attachedFile) return;
    if (isStreaming) return;
    onSend(trimmed, selectedModel, attachedFile ?? undefined);
    setInput('');
    setAttachedFile(null);
    setShowTemplates(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, isStreaming, onSend, selectedModel, attachedFile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ??
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition failed. Please try again.');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast.info('Listening... speak now');
  }, [isListening]);

  const handleFileAttach = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only .txt and .pdf files are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    setAttachedFile(file);
    toast.success(`${file.name} attached`);
    e.target.value = '';
  }, []);

  const handleTemplateSelect = useCallback((prompt: string) => {
    setInput(prompt);
    setShowTemplates(false);
    textareaRef.current?.focus();
  }, []);

  const charCount = input.length;
  const isNearLimit = charCount > 3500;

  return (
    <div className="relative">
      {/* Prompt Templates */}
      {showTemplates && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prompt Templates</span>
          </div>
          <div className="p-2 grid grid-cols-2 gap-1.5">
            {PT.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleTemplateSelect(tpl.prompt)}
                className="text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-all group"
              >
                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{tpl.label}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{tpl.prompt.substring(0, 50)}...</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attached file indicator */}
      {attachedFile && (
        <div className="absolute bottom-full mb-1 left-0 flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-xs">
          <Paperclip size={12} className="text-primary" />
          <span className="text-primary font-medium">{attachedFile.name}</span>
          <span className="text-muted-foreground">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
          <button
            onClick={() => setAttachedFile(null)}
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main input container */}
      <div className={`glass rounded-2xl border transition-all duration-200 ${
        isListening ? 'border-rose-500/50 shadow-rose-500/10 shadow-lg' : 'border-border focus-within:border-primary/50 focus-within:shadow-primary/10 focus-within:shadow-lg'
      }`}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Message ChatAI... (Enter to send, Shift+Enter for new line)'}
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none min-h-[52px] max-h-[200px] scrollbar-thin"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 gap-2">
          <div className="flex items-center gap-1.5">
            {/* Model selector */}
            <ModelSelector value={selectedModel} onChange={onModelChange} />

            {/* Templates button */}
            <button
              onClick={() => setShowTemplates((p) => !p)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                showTemplates
                  ? 'bg-primary/15 text-primary border-primary/30' :'text-muted-foreground hover:text-foreground border-border hover:border-white/20 hover:bg-white/8'
              }`}
              title="Prompt templates"
            >
              <Sparkles size={12} />
              <span className="hidden sm:inline">Templates</span>
            </button>

            {/* File attach */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
              title="Attach file (.txt or .pdf)"
            >
              <Paperclip size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileAttach}
              className="hidden"
            />

            {/* Voice input */}
            <button
              onClick={handleVoiceInput}
              className={`p-1.5 rounded-lg border transition-all ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' :'text-muted-foreground hover:text-foreground border-transparent hover:border-white/10 hover:bg-white/10'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Char count */}
            {charCount > 100 && (
              <span className={`text-xs tabular-nums ${isNearLimit ? 'text-amber-400' : 'text-muted-foreground/50'}`}>
                {charCount}/4000
              </span>
            )}

            {/* Send/Stop button */}
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30 rounded-xl text-xs font-medium transition-all active:scale-95"
                title="Stop generating"
              >
                <Square size={12} fill="currentColor" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !attachedFile) || disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-medium transition-all active:scale-95 duration-150"
                title="Send message"
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground/40 mt-2">
        ChatAI can make mistakes. Verify important information.
      </p>
    </div>
  );
}