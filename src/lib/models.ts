// Backend integration: MongoDB models via Mongoose
// Connect to MONGODB_URI from .env.local

export const AI_MODELS = {
  general: 'google/gemma-4-26b-a4b-it:free',
  coding: 'openai/gpt-oss-120b:free',
  roleplay: 'z-ai/glm-4.5-air:free',
  seo: 'openai/gpt-oss-120b:free',
  technology: 'nvidia/nemotron-3-super-120b-a12b:free',
  science: 'nvidia/nemotron-3-super-120b-a12b:free',
  translation: 'minimax/minimax-m2.5:free',
  finance: 'openai/gpt-oss-120b:free',
  academic: 'nvidia/nemotron-3-super-120b-a12b:free',
  image: 'sourceful/riverflow-v2-pro',
} as const;

export type ModelType = keyof typeof AI_MODELS;

export const MODEL_LABELS: Record<ModelType, string> = {
  general: 'General',
  coding: 'Coding',
  roleplay: 'Roleplay',
  seo: 'SEO',
  technology: 'Technology',
  science: 'Science',
  translation: 'Translation',
  finance: 'Finance',
  academic: 'Academic',
  image: 'Image Gen',
};

export const MODEL_COLORS: Record<ModelType, string> = {
  general: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  coding: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  roleplay: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  seo: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  technology: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  science: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  translation: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  finance: 'bg-green-500/20 text-green-300 border-green-500/30',
  academic: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  image: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

export function detectModelType(message: string): ModelType {
  const lower = message.toLowerCase();
  if (/\b(code|function|bug|debug|programming|javascript|python|typescript|react|api|algorithm|syntax|compile|error|stack|array|loop|class|object|method)\b/.test(lower)) return 'coding';
  if (/\b(translate|translation|spanish|french|german|japanese|chinese|arabic|portuguese|hindi|language)\b/.test(lower)) return 'translation';
  if (/\b(finance|stock|invest|money|portfolio|crypto|bitcoin|dividend|revenue|profit|loss|market|trading|fund)\b/.test(lower)) return 'finance';
  if (/\b(science|biology|chemistry|physics|molecule|atom|evolution|experiment|hypothesis|research|lab|dna|cell)\b/.test(lower)) return 'science';
  if (/\b(technology|tech|software|hardware|ai|machine learning|neural|cloud|server|database|infrastructure|devops)\b/.test(lower)) return 'technology';
  if (/\b(seo|keyword|ranking|google|search engine|backlink|meta|traffic|serp|optimization|content marketing)\b/.test(lower)) return 'seo';
  if (/\b(academic|research|paper|thesis|dissertation|citation|study|journal|peer review|scholarly|literature review)\b/.test(lower)) return 'academic';
  if (/\b(roleplay|story|character|fiction|fantasy|adventure|narrative|imagine|pretend|role|play)\b/.test(lower)) return 'roleplay';
  return 'general';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: ModelType;
  timestamp: Date;
  tokens?: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
const PROMPT_TEMPLATES: any = null;

export { PROMPT_TEMPLATES };