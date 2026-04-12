'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import WelcomeScreen from './components/WelcomeScreen';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Chat, Message, ModelType, detectModelType } from '@/lib/models';
import { MOCK_CHATS } from '@/lib/mockData';
import { getAuthHeaders, getUserFromToken, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function ChatInterfaceInner() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('general');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const user = getUserFromToken();

  // Redirect to login if not authenticated (demo: skip for mock)
  useEffect(() => {
    // Backend integration: Uncomment when real auth is in place
    // if (!isAuthenticated()) router.push('/sign-up-login-screen');
  }, [router]);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setIsMobileSidebarOpen(false);
  }, []);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveChatId(id);
      setIsMobileSidebarOpen(false);
      const chat = chats.find((c) => c.id === id);
      if (chat?.messages.length) {
        const lastAiMsg = [...chat.messages].reverse().find((m) => m.role === 'assistant');
        if (lastAiMsg?.model) setSelectedModel(lastAiMsg.model);
      }
    },
    [chats]
  );

  const handleDeleteChat = useCallback(
    (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
      // Backend integration: DELETE /api/chat/[id]
    },
    [activeChatId]
  );

  const handleRenameChat = useCallback((id: string, title: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title, updatedAt: new Date() } : c)));
    // Backend integration: PATCH /api/chat/[id] with { title }
  }, []);

  const handleExportChat = useCallback(() => {
    if (!activeChat) return;
    const text = activeChat.messages
      .map((m) => `[${m.role.toUpperCase()}] ${new Date(m.timestamp).toLocaleString()}\n${m.content}`)
      .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChat.title.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported');
  }, [activeChat]);

  const handleSend = useCallback(
    async (content: string, modelType: ModelType, file?: File) => {
      let finalContent = content;

      // Read file content if attached
      if (file) {
        try {
          const text = await file.text();
          finalContent = content
            ? `${content}\n\nFile: ${file.name}\n\`\`\`\n${text.substring(0, 8000)}\n\`\`\``
            : `Summarize this file (${file.name}):\n\`\`\`\n${text.substring(0, 8000)}\n\`\`\``;
        } catch {
          toast.error('Failed to read file content');
          return;
        }
      }

      if (!finalContent.trim()) return;

      const detectedModel = detectModelType(finalContent);
      const effectiveModel = modelType !== 'general' ? modelType : detectedModel;
      setSelectedModel(effectiveModel);

      const userMessage: Message = {
        id: generateId('msg'),
        role: 'user',
        content: finalContent,
        timestamp: new Date(),
      };

      const assistantMessageId = generateId('msg');
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        model: effectiveModel,
        timestamp: new Date(),
      };

      let currentChatId = activeChatId;

      // Create new chat if none active
      if (!currentChatId) {
        const newChat: Chat = {
          id: generateId('chat'),
          title: finalContent.substring(0, 50) + (finalContent.length > 50 ? '...' : ''),
          userId: user?.userId ?? 'user-001',
          messages: [userMessage, assistantMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        currentChatId = newChat.id;
        // Backend integration: POST /api/chat to create, then POST /api/chat/[id] to add messages
      } else {
        setChats((prev) =>
          prev.map((c) =>
            c.id === currentChatId
              ? { ...c, messages: [...c.messages, userMessage, assistantMessage], updatedAt: new Date() }
              : c
          )
        );
      }

      setIsStreaming(true);
      setStreamingMessageId(assistantMessageId);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        // Backend integration: POST /api/ai with message context
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            message: finalContent,
            type: effectiveModel,
            messages: activeChat?.messages.slice(-10).map((m) => ({ role: m.role, content: m.content })) ?? [],
            chatId: currentChatId,
          }),
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to get AI response');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let tokenCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr) as {
                type: string;
                content?: string;
                model?: string;
                tokens?: number;
              };

              if (data.type === 'content' && data.content) {
                accumulatedContent += data.content + ' ';
                const trimmedContent = accumulatedContent.trimEnd();

                setChats((prev) =>
                  prev.map((c) =>
                    c.id === currentChatId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMessageId
                              ? { ...m, content: trimmedContent }
                              : m
                          ),
                        }
                      : c
                  )
                );
              }

              if (data.type === 'done' && data.tokens) {
                tokenCount = data.tokens;
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Finalize message with token count
        if (tokenCount > 0) {
          setChats((prev) =>
            prev.map((c) =>
              c.id === currentChatId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId ? { ...m, tokens: tokenCount } : m
                    ),
                  }
                : c
            )
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          toast.info('Generation stopped');
        } else {
          toast.error('Failed to get AI response. Check your connection and try again.');
          // Remove the empty assistant message
          setChats((prev) =>
            prev.map((c) =>
              c.id === currentChatId
                ? { ...c, messages: c.messages.filter((m) => m.id !== assistantMessageId) }
                : c
            )
          );
        }
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
        abortControllerRef.current = null;
      }
    },
    [activeChatId, activeChat, user]
  );

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleRegenerate = useCallback(
    (messageId: string) => {
      if (!activeChat) return;
      const msgIdx = activeChat.messages.findIndex((m) => m.id === messageId);
      if (msgIdx === -1) return;
      const prevUserMsg = activeChat.messages.slice(0, msgIdx).reverse().find((m) => m.role === 'user');
      if (!prevUserMsg) return;

      // Remove the assistant message and resend
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) }
            : c
        )
      );
      setTimeout(() => handleSend(prevUserMsg.content, selectedModel), 100);
    },
    [activeChat, activeChatId, handleSend, selectedModel]
  );

  const handleWelcomePrompt = useCallback(
    (prompt: string, model: ModelType) => {
      setSelectedModel(model);
      handleSend(prompt, model);
    },
    [handleSend]
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((p) => !p)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatHeader
          activeChat={activeChat}
          onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
          onRename={(title) => activeChat && handleRenameChat(activeChat.id, title)}
          onDelete={() => activeChat && handleDeleteChat(activeChat.id)}
          onExport={handleExportChat}
        />

        {activeChat && activeChat.messages.length > 0 ? (
          <ChatArea
            messages={activeChat.messages}
            streamingMessageId={streamingMessageId}
            onRegenerate={handleRegenerate}
          />
        ) : (
          <WelcomeScreen
            onPromptSelect={handleWelcomePrompt}
            userName={user?.email?.split('@')[0]}
          />
        )}

        {/* Input area */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={handleSend}
              isStreaming={isStreaming}
              onStop={handleStop}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterfacePage() {
  return (
    <ThemeProvider>
      <ChatInterfaceInner />
    </ThemeProvider>
  );
}