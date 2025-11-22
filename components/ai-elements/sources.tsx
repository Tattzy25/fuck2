'use client';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DefaultChatTransport } from 'ai';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';

// Source component - individual source link
export const Source = ({ href, title, className, ...props }: { href: string; title: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "block py-2 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors",
      className
    )}
    {...props}
  >
    {title || href}
  </a>
);

// SourcesTrigger component - trigger to show/hide sources
export const SourcesTrigger = ({ count, className, ...props }: { count: number } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <CollapsibleTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      className={cn("h-6 px-2 text-xs", className)}
      {...props}
    >
      Sources ({count})
      <ChevronDownIcon className="ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </Button>
  </CollapsibleTrigger>
);

// SourcesContent component - container for source links
export const SourcesContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <CollapsibleContent className={cn("space-y-2 pt-2", className)} {...props}>
    {props.children}
  </CollapsibleContent>
);

// Sources component - main collapsible container
export const Sources = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className={cn("rounded-lg border bg-card p-3", className)} {...props}>
        {children}
      </div>
    </Collapsible>
  );
};
export default function SourceDemo() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/sources',
    }),
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto mb-4">
          <Conversation>
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'assistant' && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === 'source-url',
                          ).length
                        }
                      />
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'source-url':
                            return (
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            );
                        }
                      })}
                    </Sources>
                  )}
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <MessageResponse key={`${message.id}-${i}`}>
                                {part.text}
                              </MessageResponse>
                            );
                          default:
                            return null;
                        }
                      })}
                    </MessageContent>
                  </Message>
                </div>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Ask a question and search the..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};
