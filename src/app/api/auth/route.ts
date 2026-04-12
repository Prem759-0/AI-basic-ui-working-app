// Backend integration: Connect to MongoDB with Mongoose
// Hash passwords with bcryptjs, sign JWT with JWT_SECRET

import { NextRequest, NextResponse } from 'next/server';

// Mock user store — replace with MongoDB User model
const MOCK_USERS: Array<{ id: string; email: string; passwordHash: string; name: string }> = [
  {
    id: 'user-001',
    email: 'demo@chatai.app',
    passwordHash: '$2a$10$mockHashForDemoUser', // In production: bcrypt.hash(password, 10)
    name: 'Demo User',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { action: string; email: string; password: string; name?: string };
    const { action, email, password, name } = body;

    if (action === 'login') {
      // Backend integration: Find user in MongoDB, compare bcrypt hash
      const user = MOCK_USERS.find((u) => u.email === email);
      
      // Mock credential check — in production use bcrypt.compare
      if (!user || !(email === 'demo@chatai.app' && password === 'ChatAI@2026')) {
        return NextResponse.json(
          { error: 'Invalid credentials — use the demo accounts below to sign in' },
          { status: 401 }
        );
      }

      // Backend integration: Sign JWT with JWT_SECRET
      // const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMSIsImVtYWlsIjoiZGVtb0BjaGF0YWkuYXBwIiwiaWF0IjoxNzQ0NDI3NTE2LCJleHAiOjE3NDUwMzIzMTZ9.mockSignature`;

      return NextResponse.json({
        token: mockToken,
        user: { id: user.id, email: user.email, name: user.name },
      });
    }

    if (action === 'signup') {
      // Backend integration: Check if email exists in MongoDB, hash password, create user
      const existing = MOCK_USERS.find((u) => u.email === email);
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }

      const newUser = { id: `user-${Date.now()}`, email, passwordHash: 'hashed', name: name ?? 'New User' };
      MOCK_USERS.push(newUser);

      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIke25ld1VzZXIuaWR9IiwiZW1haWwiOiIke2VtYWlsfSIsImlhdCI6MTc0NDQyNzUxNiwiZXhwIjoxNzQ1MDMyMzE2fQ.mockSignature`;

      return NextResponse.json({
        token: mockToken,
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 500 });
  }
}