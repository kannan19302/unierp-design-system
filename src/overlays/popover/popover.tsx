"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { Portal } from "../../primitives/portal";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import { useEscapeKey } from "../overlay-hooks";
import styles from "./popover.module.css";

export const popoverVariants = cva(styles.popover, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: {
    density: "standard",
    size: "md",
  },
});

export interface PopoverProps extends VariantProps<typeof popoverVariants> {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "left" | "right" | "center";
  className?: string;
}

/**
 * `<Popover>` — Floating non-modal content container anchored to an interactive trigger element.
 * Benchmarked against Radix Popover and shadcn/ui Popover.
 *
 * @maturity stable
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      children,
      open: controlledOpen,
      onOpenChange,
      align = "left",
      density = "standard",
      size = "md",
      className = "",
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
      if (onOpenChange) onOpenChange(false);
      else setInternalOpen(false);
    }, [onOpenChange]);

    const toggle = () => {
      const next = !open;
      if (onOpenChange) onOpenChange(next);
      else setInternalOpen(next);
    };

    useEscapeKey(close, open);

    useEffect(() => {
      if (!open) return;
      const onClick = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          close();
        }
      };
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }, [open, close]);

    const [coords, setCoords] = useState<{ blockStart: number; inlineStart: number } | null>(null);

    useEffect(() => {
      if (open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const blockStart = rect.bottom + 4;
        let inlineStart = rect.left;
        if (align === "right") inlineStart = rect.right - 200;
        else if (align === "center") inlineStart = rect.left + rect.width / 2 - 100;
        setCoords({ blockStart, inlineStart });
      }
    }, [open, align]);

    const combinedRef = (node: HTMLDivElement | null) => {
      (triggerRef as any).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as any).current = node;
    };

    return (
      <div ref={combinedRef} data-slot="popover-container" className={styles.container}>
        <div
          data-slot="popover-trigger"
          onClick={toggle}
          className={styles.triggerWrap}
        >
          {trigger}
        </div>
        {open && coords && (
          <Portal>
            <div
              ref={contentRef}
              role="dialog"
              aria-modal="false"
              data-slot="popover"
              data-density={density}
              data-size={size}
              data-align={align}
              className={popoverVariants({ density, size, className })}
              style={{
                insetBlockStart: `${coords.blockStart}px`,
                insetInlineStart: `${Math.max(8, coords.inlineStart)}px`,
              }}
            >
              {children}
            </div>
          </Portal>
        )}
      </div>
    );
  }
);

Popover.displayName = "Popover";

/** Radix/shadcn compatibility sub-components */
export const PopoverTrigger = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="popover-trigger" className={cn(styles.triggerWrap, className)} {...props} />
);

export const PopoverContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="popover" className={cn(styles.popover, className)} {...props} />
);
