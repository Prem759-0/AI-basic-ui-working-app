// Backend integration: MongoDB Chat document operations by ID

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CHATS } from '@/lib/mockData';
import { Chat, Message } from '@/lib/models';

let chatStore: Chat[] = [...MOCK_CHATS];

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Backend integration: Chat.findById(id) with user ownership check
  const chat = chatStore.find((c) => c.id === id);
  if (!chat) return NextResponse.json({ error: `Chat ${id} not found` }, { status: 404 });
  return NextResponse.json({ chat });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { title?: string; messages?: Message[] };
  const idx = chatStore.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: `Chat ${id} not found` }, { status: 404 });

  chatStore[idx] = {
    ...chatStore[idx],
    ...(body.title !== undefined && { title: body.title }),
    ...(body.messages !== undefined && { messages: body.messages }),
    updatedAt: new Date(),
  };

  return NextResponse.json({ chat: chatStore[idx] });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = chatStore.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: `Chat ${id} not found` }, { status: 404 });
  chatStore.splice(idx, 1);
  return NextResponse.json({ success: true });
}