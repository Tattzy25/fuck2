import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    // Use openai provider with API key from environment
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
      tools: {
        fetch_weather_data: {
          description: 'Fetch weather information for a specific location',
          parameters: z.object({
            location: z
              .string()
              .describe('The city or location to get weather for'),
            units: z
              .enum(['celsius', 'fahrenheit'])
              .default('celsius')
              .describe('Temperature units'),
          }),
          inputSchema: z.object({
            location: z.string(),
            units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
          }),
          execute: async ({ location, units }) => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const temp =
              units === 'celsius'
                ? Math.floor(Math.random() * 35) + 5
                : Math.floor(Math.random() * 63) + 41;
            return {
              location,
              temperature: `${temp}°${units === 'celsius' ? 'C' : 'F'}`,
              conditions: 'Sunny',
              humidity: `12%`,
              windSpeed: `35 ${units === 'celsius' ? 'km/h' : 'mph'}`,
              lastUpdated: new Date().toLocaleString(),
            };
          },
        },
      },
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
