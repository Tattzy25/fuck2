"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { createContext, useContext } from "react";

type ConfirmationApproval = {
  onApprove: () => void;
  onReject: () => void;
};

type ConfirmationState = "pending" | "approved" | "rejected";

type ConfirmationContextValue = {
  approval?: ConfirmationApproval;
  state?: ConfirmationState;
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

const useConfirmation = () => {
  const context = useContext(ConfirmationContext);

  if (!context) {
    throw new Error("Confirmation components must be used within Confirmation");
  }

  return context;
};

export type ConfirmationProps = HTMLAttributes<HTMLDivElement> & {
  approval?: ConfirmationApproval;
  state?: ConfirmationState;
};

export const Confirmation = ({
  className,
  approval,
  state = "pending",
  children,
  ...props
}: ConfirmationProps) => {
  return (
    <ConfirmationContext.Provider value={{ approval, state }}>
      <div
        className={cn(
          "rounded-lg border bg-card p-4 space-y-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ConfirmationContext.Provider>
  );
};

export type ConfirmationContentProps = HTMLAttributes<HTMLDivElement>;

export const ConfirmationContent = ({
  className,
  children,
  ...props
}: ConfirmationContentProps) => (
  <div className={cn("text-sm", className)} {...props}>
    {children}
  </div>
);

export type ConfirmationRequestProps = HTMLAttributes<HTMLDivElement>;

export const ConfirmationRequest = ({
  className,
  children,
  ...props
}: ConfirmationRequestProps) => {
  const { state } = useConfirmation();

  if (state !== "pending") {
    return null;
  }

  return (
    <div
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export type ConfirmationAcceptedProps = HTMLAttributes<HTMLDivElement>;

export const ConfirmationAccepted = ({
  className,
  children,
  ...props
}: ConfirmationAcceptedProps) => {
  const { state } = useConfirmation();

  if (state !== "approved") {
    return null;
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-green-600", className)}
      {...props}
    >
      <CheckIcon className="size-4" />
      <span>{children || "Approved"}</span>
    </div>
  );
};

export type ConfirmationRejectedProps = HTMLAttributes<HTMLDivElement>;

export const ConfirmationRejected = ({
  className,
  children,
  ...props
}: ConfirmationRejectedProps) => {
  const { state } = useConfirmation();

  if (state !== "rejected") {
    return null;
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-red-600", className)}
      {...props}
    >
      <XIcon className="size-4" />
      <span>{children || "Rejected"}</span>
    </div>
  );
};

export type ConfirmationActionsProps = HTMLAttributes<HTMLDivElement>;

export const ConfirmationActions = ({
  className,
  children,
  ...props
}: ConfirmationActionsProps) => {
  const { state } = useConfirmation();

  if (state !== "pending") {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
};

export type ConfirmationActionProps = ComponentProps<typeof Button> & {
  action?: "approve" | "reject";
};

export const ConfirmationAction = ({
  action,
  onClick,
  children,
  ...props
}: ConfirmationActionProps) => {
  const { approval } = useConfirmation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (action === "approve") {
      approval?.onApprove();
    } else if (action === "reject") {
      approval?.onReject();
    }
    onClick?.(e);
  };

  return (
    <Button onClick={handleClick} size="sm" {...props}>
      {children}
    </Button>
  );
};
