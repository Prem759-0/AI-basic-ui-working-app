'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, MessageSquare, Pencil, Trash2,
  Check, X, ChevronLeft, ChevronRight, Sparkles,
  Image as ImageIcon, LogOut, Moon, Sun, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import { Chat } from '@/lib/models';
import { useTheme } from '@/components/ThemeProvider';
import { removeAuthToken } from '@/lib/auth';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

function formatChatDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function groupChatsByDate(chats: Chat[]): Array<{ label: string; chats: Chat[] }> {
  const groups: Record<string, Chat[]> = {};
  chats.forEach((chat) => {
    const label = formatChatDate(chat.updatedAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(chat);
  });
  return Object.entries(groups).map(([label, chats]) => ({ label, chats }));
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = groupChatsByDate(filteredChats);

  const handleStartEdit = useCallback((chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  }, []);

  const handleSaveEdit = useCallback(
    (id: string) => {
      if (editTitle.trim()) {
        onRenameChat(id, editTitle.trim());
        toast.success('Chat renamed');
      }
      setEditingId(null);
    },
    [editTitle, onRenameChat]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle('');
  }, []);

  const handleDeleteConfirm = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setDeletingId(id);
    },
    []
  );

  const handleDeleteExecute = useCallback(
    (id: string) => {
      onDeleteChat(id);
      setDeletingId(null);
      toast.success('Chat deleted');
    },
    [onDeleteChat]
  );

  const handleLogout = useCallback(() => {
    removeAuthToken();
    router.push('/sign-up-login-screen');
    toast.success('Signed out successfully');
  }, [router]);

  const handleExportChats = useCallback(() => {
    const exportData = JSON.stringify(chats, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatai-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat history exported');
  }, [chats]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) onMobileClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobileOpen, onMobileClose]);

  const sidebarContent = (
    <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
      {/* Header */}
      <div className={`flex items-center p-4 border-b border-border ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <AppLogo size={28} />
            <span className="font-semibold text-base gradient-text">ChatAI</span>
          </div>
        )}
        {isCollapsed && <AppLogo size={28} />}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-150 hidden lg:flex"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className={`p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onNewChat}
          className={`flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-150 active:scale-95 font-medium text-sm ${
            isCollapsed ? 'p-2.5 justify-center' : 'w-full px-4 py-2.5'
          }`}
          title={isCollapsed ? 'New Chat' : undefined}
        >
          <Plus size={16} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white/5 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground text-foreground transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nav Links */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <button
            onClick={() => router.push('/image-generation-page')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 rounded-lg transition-all duration-150"
          >
            <ImageIcon size={15} />
            <span>Image Generation</span>
            <span className="ml-auto text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">New</span>
          </button>
        </div>
      )}

      {isCollapsed && (
        <div className="px-2 pb-2 flex flex-col gap-1">
          <button
            onClick={() => router.push('/image-generation-page')}
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-all"
            title="Image Generation"
          >
            <ImageIcon size={16} />
          </button>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        {!isCollapsed && (
          <>
            {filteredChats.length === 0 && searchQuery ? (
              <div className="text-center py-8 px-4">
                <MessageSquare size={24} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No chats match "{searchQuery}"</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Sparkles size={24} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No chats yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Start a new conversation above</p>
              </div>
            ) : (
              groupedChats.map(({ label, chats: groupChats }) => (
                <div key={`group-${label}`} className="mb-2">
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                    {label}
                  </p>
                  {groupChats.map((chat) => (
                    <div
                      key={`sidebar-chat-${chat.id}`}
                      className={`group relative flex items-center rounded-lg mb-0.5 cursor-pointer transition-all duration-150 ${
                        activeChatId === chat.id
                          ? 'bg-primary/15 text-foreground'
                          : 'hover:bg-white/6 text-foreground/80 hover:text-foreground'
                      }`}
                      onClick={() => onSelectChat(chat.id)}
                    >
                      {activeChatId === chat.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full" />
                      )}

                      {editingId === chat.id ? (
                        <div className="flex-1 flex items-center gap-1 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(chat.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="flex-1 text-sm bg-white/10 border border-primary/50 rounded px-2 py-0.5 focus:outline-none text-foreground"
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(chat.id)} className="text-emerald-400 hover:text-emerald-300 p-0.5">
                            <Check size={13} />
                          </button>
                          <button onClick={handleCancelEdit} className="text-muted-foreground hover:text-foreground p-0.5">
                            <X size={13} />
                          </button>
                        </div>
                      ) : deletingId === chat.id ? (
                        <div className="flex-1 flex items-center gap-1.5 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-destructive flex-1">Delete this chat?</span>
                          <button
                            onClick={() => handleDeleteExecute(chat.id)}
                            className="text-xs bg-destructive/20 text-destructive border border-destructive/30 px-2 py-0.5 rounded hover:bg-destructive/30 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 flex items-center gap-2 px-3 py-2 min-w-0">
                            <MessageSquare size={13} className="shrink-0 text-muted-foreground" />
                            <span className="text-sm truncate">{chat.title}</span>
                          </div>
                          <div className="hidden group-hover:flex items-center gap-0.5 pr-2 shrink-0">
                            <button
                              onClick={(e) => handleStartEdit(chat, e)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/15 transition-all"
                              title="Rename chat"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteConfirm(chat.id, e)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                              title="Delete chat"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}

        {isCollapsed && chats.slice(0, 8).map((chat) => (
          <button
            key={`collapsed-chat-${chat.id}`}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex justify-center p-2.5 rounded-lg mb-0.5 transition-all ${
              activeChatId === chat.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
            }`}
            title={chat.title}
          >
            <MessageSquare size={15} />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className={`border-t border-border p-3 flex flex-col gap-1 ${isCollapsed ? 'items-center' : ''}`}>
        {!isCollapsed ? (
          <>
            <button
              onClick={handleExportChats}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 rounded-lg transition-all"
            >
              <Download size={14} />
              <span>Export chats</span>
            </button>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 rounded-lg transition-all"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={toggleTheme} className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-all" title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={handleLogout} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all" title="Sign out">
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}