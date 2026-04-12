import { Chat, ModelType } from './models';

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat-001',
    title: 'Building a REST API in Node.js',
    userId: 'user-001',
    createdAt: new Date('2026-04-12T04:30:00Z'),
    updatedAt: new Date('2026-04-12T04:55:00Z'),
    messages: [
      {
        id: 'msg-001-1',
        role: 'user',
        content: 'How do I build a REST API in Node.js with Express?',
        timestamp: new Date('2026-04-12T04:30:00Z'),
      },
      {
        id: 'msg-001-2',
        role: 'assistant',
        content: `Here's a complete guide to building a REST API with Node.js and Express:\n\n## Setup\n\n\`\`\`bash\nnpm init -y\nnpm install express cors dotenv\n\`\`\`\n\n## Basic Server\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\napp.use(cors());\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: [] });\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));\n\`\`\`\n\nThis creates a basic REST API with a single endpoint. You can expand this with more routes, middleware, and database connections.`,
        model: 'coding' as ModelType,
        timestamp: new Date('2026-04-12T04:31:00Z'),
        tokens: 312,
      },
    ],
  },
  {
    id: 'chat-002',
    title: 'Explain quantum entanglement',
    userId: 'user-001',
    createdAt: new Date('2026-04-11T18:20:00Z'),
    updatedAt: new Date('2026-04-11T18:45:00Z'),
    messages: [
      {
        id: 'msg-002-1',
        role: 'user',
        content: 'Can you explain quantum entanglement in simple terms?',
        timestamp: new Date('2026-04-11T18:20:00Z'),
      },
      {
        id: 'msg-002-2',
        role: 'assistant',
        content: 'Quantum entanglement is one of the most fascinating phenomena in physics. Imagine two particles that become "linked" — measuring one instantly affects the other, regardless of the distance between them.\n\n**Key concepts:**\n- When particles interact, they can become entangled\n- Measuring one particle\'s state instantly determines the other\'s\n- This happens faster than light — but cannot be used for communication\n\nEinstein famously called this "spooky action at a distance" because it seemed to violate his theory of relativity.',
        model: 'science' as ModelType,
        timestamp: new Date('2026-04-11T18:21:00Z'),
        tokens: 198,
      },
    ],
  },
  {
    id: 'chat-003',
    title: 'SEO strategy for SaaS startup',
    userId: 'user-001',
    createdAt: new Date('2026-04-10T10:00:00Z'),
    updatedAt: new Date('2026-04-10T10:30:00Z'),
    messages: [
      {
        id: 'msg-003-1',
        role: 'user',
        content: 'What SEO strategy should I use for a new SaaS startup?',
        timestamp: new Date('2026-04-10T10:00:00Z'),
      },
      {
        id: 'msg-003-2',
        role: 'assistant',
        content: 'For a new SaaS startup, focus on **bottom-of-funnel keywords** first — people actively searching for solutions like yours.\n\n**Priority actions:**\n1. Target comparison keywords: "YourProduct vs Competitor"\n2. Create landing pages for integrations\n3. Write use-case content for each customer segment\n4. Build a programmatic SEO strategy for scale\n\nStart with 10-15 high-intent keywords rather than broad terms.',
        model: 'seo' as ModelType,
        timestamp: new Date('2026-04-10T10:02:00Z'),
        tokens: 156,
      },
    ],
  },
  {
    id: 'chat-004',
    title: 'Translate this to Japanese',
    userId: 'user-001',
    createdAt: new Date('2026-04-09T15:10:00Z'),
    updatedAt: new Date('2026-04-09T15:15:00Z'),
    messages: [
      {
        id: 'msg-004-1',
        role: 'user',
        content: 'Translate "The future belongs to those who believe in the beauty of their dreams" to Japanese',
        timestamp: new Date('2026-04-09T15:10:00Z'),
      },
      {
        id: 'msg-004-2',
        role: 'assistant',
        content: '未来は自分の夢の美しさを信じる人のものです。\n\n*(Mirai wa jibun no yume no utsukushisa wo shinjiru hito no mono desu.)*\n\nThis is a direct and natural translation. The phrase maintains the inspirational tone of the original English quote.',
        model: 'translation' as ModelType,
        timestamp: new Date('2026-04-09T15:11:00Z'),
        tokens: 89,
      },
    ],
  },
  {
    id: 'chat-005',
    title: 'Investment portfolio diversification',
    userId: 'user-001',
    createdAt: new Date('2026-04-08T09:00:00Z'),
    updatedAt: new Date('2026-04-08T09:25:00Z'),
    messages: [
      {
        id: 'msg-005-1',
        role: 'user',
        content: 'How should I diversify my investment portfolio in 2026?',
        timestamp: new Date('2026-04-08T09:00:00Z'),
      },
      {
        id: 'msg-005-2',
        role: 'assistant',
        content: 'Portfolio diversification in 2026 requires balancing traditional and emerging asset classes.\n\n**Recommended allocation for moderate risk:**\n- 40% — Broad market index funds (S&P 500, total market)\n- 20% — International developed markets\n- 15% — Bonds and fixed income\n- 15% — Real estate (REITs)\n- 10% — Alternatives (crypto, commodities)\n\n**Key principle:** Rebalance quarterly and avoid timing the market.',
        model: 'finance' as ModelType,
        timestamp: new Date('2026-04-08T09:02:00Z'),
        tokens: 178,
      },
    ],
  },
  {
    id: 'chat-006',
    title: 'Write a short adventure story',
    userId: 'user-001',
    createdAt: new Date('2026-04-07T20:00:00Z'),
    updatedAt: new Date('2026-04-07T20:10:00Z'),
    messages: [
      {
        id: 'msg-006-1',
        role: 'user',
        content: 'Write a short adventure story about a lost astronaut',
        timestamp: new Date('2026-04-07T20:00:00Z'),
      },
      {
        id: 'msg-006-2',
        role: 'assistant',
        content: '**The Last Signal**\n\nCommander Yara Chen\'s oxygen gauge read 4%. The Kepler Station had gone dark three hours ago.\n\nShe drifted through the silent expanse, her suit\'s beacon pulsing its lonely SOS into the void. Mars hung below her like a rusted coin.\n\n*"Kepler, this is Chen. Does anyone copy?"*\n\nStatic. Then — faint, crackling — a voice.\n\n*"Commander Chen. We see you."*\n\nShe closed her eyes and smiled. Sometimes, three words are enough to save a life.',
        model: 'roleplay' as ModelType,
        timestamp: new Date('2026-04-07T20:01:00Z'),
        tokens: 134,
      },
    ],
  },
  {
    id: 'chat-007',
    title: 'Cloud infrastructure best practices',
    userId: 'user-001',
    createdAt: new Date('2026-04-06T11:30:00Z'),
    updatedAt: new Date('2026-04-06T12:00:00Z'),
    messages: [
      {
        id: 'msg-007-1',
        role: 'user',
        content: 'What are the best practices for cloud infrastructure on AWS?',
        timestamp: new Date('2026-04-06T11:30:00Z'),
      },
      {
        id: 'msg-007-2',
        role: 'assistant',
        content: 'AWS infrastructure best practices cover security, cost, and reliability:\n\n**Security**\n- Use IAM roles, not root accounts\n- Enable MFA on all accounts\n- Encrypt data at rest and in transit\n\n**Cost optimization**\n- Use Reserved Instances for predictable workloads\n- Enable Cost Explorer and budgets\n- Right-size EC2 instances regularly\n\n**Reliability**\n- Deploy across multiple Availability Zones\n- Use Auto Scaling groups\n- Implement health checks and circuit breakers',
        model: 'technology' as ModelType,
        timestamp: new Date('2026-04-06T11:32:00Z'),
        tokens: 201,
      },
    ],
  },
];

export const PROMPT_TEMPLATES = [
  { id: 'tpl-001', label: 'Explain a concept', prompt: 'Explain [concept] in simple terms with examples' },
  { id: 'tpl-002', label: 'Write code', prompt: 'Write a [language] function that [does something]' },
  { id: 'tpl-003', label: 'Summarize text', prompt: 'Summarize the following text in 3 bullet points:\n\n[paste text here]' },
  { id: 'tpl-004', label: 'Debug code', prompt: 'Debug this code and explain what\'s wrong:\n\n```\n[paste code here]\n```' },
  { id: 'tpl-005', label: 'Translate', prompt: 'Translate the following to [language]:\n\n[text to translate]' },
  { id: 'tpl-006', label: 'Write essay', prompt: 'Write a well-structured essay about [topic] covering [key points]' },
];