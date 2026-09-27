"use client";

import { useState, forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./split-view.module.css";

export const splitViewVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type SplitViewVariantProps = VariantProps<typeof splitViewVariants>;

export interface SplitViewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    SplitViewVariantProps {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number; // percentage
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

/**
 * SplitView provides a resizable two-pane divider layout for master-detail inspection.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and strict logical CSS.
 *
 * @maturity stable
 */
export const SplitView = forwardRef<HTMLDivElement, SplitViewProps>(
  function SplitView(
    {
      left,
      right,
      initialSplit = 30,
      density = "standard",
      className = "",
      ...rest
    },
    ref
  ) {
    const [split, setSplit] = useState(initialSplit);

    return (
      <div
        ref={ref}
        data-slot="split-view"
        data-density={density}
        className={`${splitViewVariants({ density })}${className ? ` ${className}` : ""}`.trim()}
        {...rest}
      >
        <div className={styles.pane} data-slot="split-view-pane" data-pane="left" style={{ inlineSize: `${split}%` }}>
          {left}
        </div>
        <div
          className={styles.splitter}
          data-slot="split-view-splitter"
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={split}
          tabIndex={0}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startSplit = split;
            const onMove = (moveEvent: MouseEvent) => {
              const delta = moveEvent.clientX - startX;
              const containerWidth = (e.currentTarget.parentNode as HTMLElement)?.clientWidth || 1000;
              const newSplit = Math.max(10, Math.min(90, startSplit + (delta / containerWidth) * 100));
              setSplit(newSplit);
            };
            const onUp = () => {
              document.removeEventListener("mousemove", onMove);
              document.removeEventListener("mouseup", onUp);
            };
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
          }}
        />
        <div className={styles.pane} data-slot="split-view-pane" data-pane="right" style={{ inlineSize: `${100 - split}%` }}>
          {right}
        </div>
      </div>
    );
  }
);

SplitView.displayName = "SplitView";

/**
 * ResizablePanel container component.
 *
 * @maturity stable
 */
export const ResizablePanel = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(function ResizablePanel({ children, className = "" }, ref) {
  return (
    <div
      ref={ref}
      data-slot="resizable-panel"
      className={`${styles.resizable} ${className}`.trim()}
    >
      {children}
    </div>
  );
});

ResizablePanel.displayName = "ResizablePanel";
