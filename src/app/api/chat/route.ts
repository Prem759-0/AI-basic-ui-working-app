// Backend integration: MongoDB Chat model operations
// Protected route — verify JWT from Authorization header

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CHATS } from '@/lib/mockData';
import { Chat } from '@/lib/models';

// In-memory store for demo — replace with MongoDB
let chatStore: Chat[] = [...MOCK_CHATS];

export async function GET(request: NextRequest) {
  // Backend integration: Verify JWT, query MongoDB Chat.find({ userId })
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const userId = 'user-001'; // Backend integration: Extract from verified JWT
  const userChats = chatStore
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((c) => ({ id: c.id, title: c.title, createdAt: c.createdAt, updatedAt: c.updatedAt, messageCount: c.messages.length }));

  return NextResponse.json({ chats: userChats });
}

export async function POST(request: NextRequest) {
  // Backend integration: Create new Chat document in MongoDB
  const body = await request.json() as { title?: string };
  const newChat: Chat = {
    id: `chat-${Date.now()}`,
    title: body.title ?? 'New Chat',
    userId: 'user-001',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  chatStore.push(newChat);
  return NextResponse.json({ chat: newChat }, { status: 201 });
}