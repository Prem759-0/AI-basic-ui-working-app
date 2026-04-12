// Backend integration: Real OpenRouter API call with OPENROUTER_API_KEY from .env.local
// This mock simulates SSE streaming — replace with real fetch to OpenRouter

import { NextRequest, NextResponse } from 'next/server';
import { AI_MODELS, detectModelType, ModelType } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      message: string;
      type?: ModelType;
      messages?: Array<{ role: string; content: string }>;
      chatId?: string;
    };

    const { message, type, messages = [] } = body;
    const modelType = type ?? detectModelType(message);
    const modelId = AI_MODELS[modelType];

    // Backend integration: Replace this block with real OpenRouter streaming call
    // const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //     'Content-Type': 'application/json',
    //     'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL!,
    //     'X-Title': 'ChatAI',
    //   },
    //   body: JSON.stringify({
    //     model: modelId,
    //     messages: [...messages, { role: 'user', content: message }],
    //     stream: true,
    //   }),
    // });
    // return new Response(response.body, { headers: { 'Content-Type': 'text/event-stream' } });

    // Mock streaming response
    const mockResponses: Record<string, string> = {
      coding: `Here's a solution to your coding question:\n\n\`\`\`typescript\nfunction greet(name: string): string {\n  return \`Hello, \${name}! Welcome to ChatAI.\`;\n}\n\nconsole.log(greet('Developer'));\n\`\`\`\n\nThis TypeScript function takes a name parameter and returns a greeting string. The template literal syntax \`\${name}\` interpolates the variable into the string.\n\n**Key points:**\n- Type-safe with TypeScript\n- Uses template literals for string interpolation\n- Returns a string type\n\nYou can extend this with more complex logic as needed.`,
      science: `That's a fascinating scientific question! Let me break it down:\n\n**The Science Behind It**\n\nThe phenomenon you're asking about involves several key principles:\n\n1. **Thermodynamics** — Energy conservation plays a central role\n2. **Quantum mechanics** — At the subatomic level, particles behave probabilistically\n3. **Electromagnetism** — Forces govern interactions between charged particles\n\nResearch in this area has advanced significantly since 2020, with new discoveries challenging our previous understanding.\n\n> *"The important thing is not to stop questioning." — Albert Einstein*\n\nWould you like me to dive deeper into any specific aspect?`,
      translation: `Here is the translation:\n\n**Original:** Your text\n\n**Translated:** La traducción de tu texto\n\n*Pronunciation guide:* [lah tra-dook-SYOHN deh too TEKS-toh]\n\nThe translation maintains the original meaning while adapting naturally to the target language's grammar and idioms.`,
      finance: `Here's a comprehensive financial analysis:\n\n## Market Overview\n\nCurrent market conditions suggest a **cautious optimistic** outlook for Q2 2026.\n\n**Key indicators:**\n- Inflation: 2.8% (trending down)\n- Fed Funds Rate: 4.25%\n- S&P 500 P/E: 21.4x\n\n**Recommended actions:**\n1. Maintain emergency fund (6 months expenses)\n2. Max out tax-advantaged accounts first\n3. Consider dollar-cost averaging into index funds\n\n*This is not financial advice. Consult a licensed financial advisor.*`,
      general: `That's a great question! Let me provide a comprehensive answer.\n\nBased on the latest information available, here's what you should know:\n\n**Overview**\nThe topic you've raised touches on several important areas that are worth exploring in detail.\n\n**Key Points**\n- First, consider the foundational aspects of the subject\n- Second, look at how context shapes the answer\n- Third, practical applications matter most\n\n**Conclusion**\nThe answer depends on your specific situation, but the general guidance above should give you a strong starting point. Feel free to ask follow-up questions for more specific guidance!\n\nIs there a particular aspect you'd like me to elaborate on?`,
    };

    const responseText = mockResponses[modelType] ?? mockResponses.general;
    const words = responseText.split(' ');

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Send model info header
        const headerChunk = `data: ${JSON.stringify({ type: 'model', model: modelId, modelType })}\n\n`;
        controller.enqueue(encoder.encode(headerChunk));

        // Stream words with realistic delay
        let buffer = '';
        for (let i = 0; i < words.length; i++) {
          buffer += (i === 0 ? '' : ' ') + words[i];

          if (i % 3 === 0 || i === words.length - 1) {
            const chunk = `data: ${JSON.stringify({ type: 'content', content: buffer })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
            buffer = '';
            await new Promise<void>((resolve) => setTimeout(resolve, 30 + Math.random() * 20));
          }
        }

        // Send done signal
        const doneChunk = `data: ${JSON.stringify({ type: 'done', tokens: Math.floor(responseText.length / 4) })}\n\n`;
        controller.enqueue(encoder.encode(doneChunk));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again.' }, { status: 500 });
  }
}