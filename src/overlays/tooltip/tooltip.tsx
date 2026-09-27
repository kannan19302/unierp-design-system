"use client";

import {
  useState,
  useId,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { Portal } from "../../primitives/portal";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import styles from "./tooltip.module.css";

export const tooltipVariants = cva(styles.tooltip, {
  variants: {
    side: {
      top: styles.top,
      bottom: styles.bottom,
      left: styles.left,
      right: styles.right,
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    side: "top",
    density: "standard",
  },
});

export interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  id?: string;
  className?: string;
}

/**
 * `<Tooltip>` — Accessible hover and focus contextual label overlay with portal placement.
 * Benchmarked against Radix Tooltip and shadcn/ui Tooltip.
 *
 * @maturity stable
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      content,
      children,
      side = "top",
      density = "standard",
      id: customId,
      className = "",
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState<{ blockStart: number; inlineStart: number } | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    useImperativeHandle(ref, () => triggerRef.current!);
    const generatedId = useId();
    const tooltipId = customId ?? generatedId;

    useEffect(() => {
      if (visible && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let blockStart = rect.top - 28;
        let inlineStart = rect.left + rect.width / 2;

        if (side === "bottom") {
          blockStart = rect.bottom + 4;
        } else if (side === "left") {
          blockStart = rect.top;
          inlineStart = rect.left - 8;
        } else if (side === "right") {
          blockStart = rect.top;
          inlineStart = rect.right + 8;
        }
        setCoords({ blockStart, inlineStart });
      }
    }, [visible, side]);

    return (
      <span
        ref={triggerRef}
        data-slot="tooltip-trigger"
        className={styles.container}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <span aria-describedby={tooltipId} className={styles.triggerChild}>
          {children}
        </span>
        {visible && coords && (
          <Portal>
            <div
              id={tooltipId}
              role="tooltip"
              data-slot="tooltip"
              data-side={side}
              data-density={density}
              className={tooltipVariants({ side, density, className })}
              style={{
                insetBlockStart: `${coords.blockStart}px`,
                insetInlineStart: `${coords.inlineStart}px`,
              }}
            >
              {content}
            </div>
          </Portal>
        )}
      </span>
    );
  }
);

Tooltip.displayName = "Tooltip";

/** Radix/shadcn compound components compatibility */
export const TooltipProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export const TooltipTrigger = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span data-slot="tooltip-trigger" className={cn(styles.triggerChild, className)} {...props} />
);

export const TooltipContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="tooltip" className={cn(styles.tooltip, className)} {...props} />
);
