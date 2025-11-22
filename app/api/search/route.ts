import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    // Use OpenAI as fallback since perplexity is not installed
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const result = streamText({
      model: openai('gpt-4o'),
      system:
        'You are a helpful assistant with search capabilities. Keep your responses short (< 100 words) unless you are asked for more details. Provide sources and citations when possible.',
      messages: convertToModelMessages(messages),
    });
    
    return result.toUIMessageStreamResponse({
      sendSources: true,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process search request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
