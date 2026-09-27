"use client";

import {
  createContext,
  useContext,
  forwardRef,
  useState,
  useId,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import styles from "./collapsible.module.css";

interface CollapsibleContextValue {
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Controlled open state */
  open?: boolean;
  /** Initial state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback fired on state transition */
  onOpenChange?: (open: boolean) => void;
  /** Disable toggle interactions */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * `<Collapsible>` — Compound expandable container adhering to Strata DL 3.0 / shadcn pattern.
 *
 * Provides `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` subcomponents.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isOpen = isControlled ? controlledOpen! : uncontrolledOpen;
    const contentId = useId();

    const handleToggle = () => {
      if (disabled) return;
      const next = !isOpen;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    return (
      <CollapsibleContext.Provider
        value={{
          open: isOpen,
          onToggle: handleToggle,
          disabled,
          contentId,
        }}
      >
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={`${styles.collapsible} ${className}`.trim()}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);

Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * `<CollapsibleTrigger>` — Interactive button that toggles the open state.
 */
export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, disabled: buttonDisabled, className = "", onClick, ...props }, ref) => {
    const ctx = useContext(CollapsibleContext);
    if (!ctx) {
      throw new Error("CollapsibleTrigger must be used within Collapsible");
    }

    const isDisabled = Boolean(ctx.disabled || buttonDisabled);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      ctx.onToggle();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={ctx.open}
        aria-controls={ctx.contentId}
        data-state={ctx.open ? "open" : "closed"}
        disabled={isDisabled}
        className={`${styles.trigger} ${className}`.trim()}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * `<CollapsibleContent>` — Expandable content container.
 */
export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, className = "", ...props }, ref) => {
    const ctx = useContext(CollapsibleContext);
    if (!ctx) {
      throw new Error("CollapsibleContent must be used within Collapsible");
    }

    if (!ctx.open) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={ctx.contentId}
        data-state={ctx.open ? "open" : "closed"}
        className={`${styles.content} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";
