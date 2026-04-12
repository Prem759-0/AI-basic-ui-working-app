// Backend integration: OpenRouter image generation API

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { prompt: string; aspectRatio?: string };
    const { prompt, aspectRatio = '1:1' } = body;

    // Backend integration: Real OpenRouter image generation
    // const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'sourceful/riverflow-v2-pro',
    //     prompt,
    //     n: 1,
    //     size: aspectRatio === '16:9' ? '1792x1024' : aspectRatio === '9:16' ? '1024x1792' : '1024x1024',
    //   }),
    // });
    // const data = await response.json();
    // return NextResponse.json({ imageUrl: data.data[0].url });

    // Mock response — returns a placeholder image
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    
    const seed = Math.abs(prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const mockImageUrl = `https://picsum.photos/seed/${seed}/1024/1024`;

    return NextResponse.json({
      imageUrl: mockImageUrl,
      prompt,
      model: 'sourceful/riverflow-v2-pro',
      aspectRatio,
      id: `img-${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ error: 'Image generation failed. Please try again.' }, { status: 500 });
  }
}