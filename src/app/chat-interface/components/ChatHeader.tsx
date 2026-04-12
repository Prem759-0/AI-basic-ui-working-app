'use client';

import React, { useState, useCallback } from 'react';
import { Menu, Pencil, Check, X, MoreHorizontal, Trash2, Download, Share2 } from 'lucide-react';
import { Chat } from '@/lib/models';

interface ChatHeaderProps {
  activeChat: Chat | null;
  onMobileMenuOpen: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onExport: () => void;
}

export default function ChatHeader({
  activeChat,
  onMobileMenuOpen,
  onRename,
  onDelete,
  onExport,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleStartEdit = useCallback(() => {
    if (!activeChat) return;
    setEditTitle(activeChat.title);
    setIsEditing(true);
    setShowMenu(false);
  }, [activeChat]);

  const handleSaveEdit = useCallback(() => {
    if (editTitle.trim()) onRename(editTitle.trim());
    setIsEditing(false);
  }, [editTitle, onRename]);

  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/80 backdrop-blur-sm">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
        >
          <Menu size={18} />
        </button>

        {activeChat ? (
          isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="text-sm font-medium bg-white/10 border border-primary/50 rounded-lg px-3 py-1 focus:outline-none text-foreground w-64"
                autoFocus
              />
              <button onClick={handleSaveEdit} className="text-emerald-400 hover:text-emerald-300 p-1">
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate max-w-[280px]">
                {activeChat.title}
              </h1>
              <span className="text-xs text-muted-foreground/50 shrink-0">
                {activeChat.messages.length} messages
              </span>
            </div>
          )
        ) : (
          <h1 className="text-sm font-semibold text-foreground">New Chat</h1>
        )}
      </div>

      {/* Right actions */}
      {activeChat && !isEditing && (
        <div className="flex items-center gap-1 relative">
          <button
            onClick={handleStartEdit}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            title="Rename chat"
          >
            <Pencil size={14} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              title="More options"
            >
              <MoreHorizontal size={14} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                <button
                  onClick={() => { onExport(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                >
                  <Download size={13} />
                  Export chat
                </button>
                <button
                  onClick={() => { setShowMenu(false); toast.info('Share link copied'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                >
                  <Share2 size={13} />
                  Share
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 size={13} />
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function toast(arg0: string, arg1: string) {
  // placeholder — real toast imported in the parent
}