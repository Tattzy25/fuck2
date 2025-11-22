import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { model, messages }: { messages: UIMessage[]; model: string } =
      await req.json();
    
    // Parse the model string to determine provider
    let modelInstance;
    if (model.startsWith('openai/')) {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
      });
      const modelName = model.replace('openai/', '');
      modelInstance = openai(modelName);
    } else if (model.startsWith('deepseek/')) {
      const deepseek = createDeepSeek({
        apiKey: process.env.DEEPSEEK_API_KEY || '',
      });
      const modelName = model.replace('deepseek/', '');
      modelInstance = deepseek(modelName);
    } else {
      // Default to OpenAI if no provider specified
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
      });
      modelInstance = openai('gpt-4o');
    }
    
    const result = streamText({
      model: modelInstance,
      messages: convertToModelMessages(messages),
    });
    
    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error('Reasoning API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process reasoning request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
