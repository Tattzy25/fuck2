"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { BrainIcon, ChevronDownIcon, LoaderIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { createContext, memo, useContext, useState } from "react";
import { Streamdown } from "streamdown";

type ReasoningContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isStreaming?: boolean;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);

  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }

  return context;
};

export type ReasoningProps = HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
  defaultOpen?: boolean;
};

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    defaultOpen = false,
    children,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <ReasoningContext.Provider value={{ isOpen, setIsOpen, isStreaming }}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div
            className={cn(
              "not-prose w-full rounded-lg border bg-muted/30 p-3",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

Reasoning.displayName = "Reasoning";

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
>;

export const ReasoningTrigger = memo(
  ({ className, children, ...props }: ReasoningTriggerProps) => {
    const { isOpen, isStreaming } = useReasoning();

    return (
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
          className
        )}
        {...props}
      >
        <BrainIcon className="size-4 shrink-0" />
        <span className="flex-1 text-left">
          {children ?? (
            <span className="flex items-center gap-2">
              Reasoning
              {isStreaming && (
                <LoaderIcon className="size-3 animate-spin" />
              )}
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 transition-transform",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </CollapsibleTrigger>
    );
  }
);

ReasoningTrigger.displayName = "ReasoningTrigger";

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children?: React.ReactNode;
};

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => {
    return (
      <CollapsibleContent
        className={cn("mt-3 space-y-2", className)}
        {...props}
      >
        <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
          {typeof children === "string" ? (
            <Streamdown>{children}</Streamdown>
          ) : (
            children
          )}
        </div>
      </CollapsibleContent>
    );
  }
);

ReasoningContent.displayName = "ReasoningContent";
