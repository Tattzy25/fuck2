import { streamObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export const taskItemSchema = z.object({
  type: z.enum(['text', 'file']),
  text: z.string(),
  file: z
    .object({
      name: z.string(),
      icon: z.string(),
      color: z.string().optional(),
    })
    .optional(),
});

export const taskSchema = z.object({
  title: z.string(),
  items: z.array(taskItemSchema),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

export const tasksSchema = z.object({
  tasks: z.array(taskSchema),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const result = streamObject({
      model: openai('gpt-4o'),
      schema: tasksSchema,
      prompt: `You are an AI assistant that generates realistic development task workflows. Generate a set of tasks that would occur during ${prompt}.
    Each task should have:
    - A descriptive title
    - Multiple task items showing the progression
    - Some items should be plain text, others should reference files
    - Use realistic file names and appropriate file types
    - Status should progress from pending to in_progress to completed
    For file items, use these icon types: 'react', 'typescript', 'javascript', 'css', 'html', 'json', 'markdown'
    Generate 3-4 tasks total, with 4-6 items each.`,
    });
    
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Tasks API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process tasks request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
