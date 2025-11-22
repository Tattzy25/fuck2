'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
