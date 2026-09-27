"use client";

import { useState, forwardRef, type ReactNode } from "react";
import styles from "./split-view.module.css";

export interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number; // percentage
  className?: string;
}

/**
 * SplitView provides a resizable two-pane divider layout for master-detail inspection.
 *
 * @maturity stable
 */
export const SplitView = forwardRef<HTMLDivElement, SplitViewProps>(
  function SplitView(
    {
      left,
      right,
      initialSplit = 30,
      className = "",
    },
    ref
  ) {
    const [split, setSplit] = useState(initialSplit);

    return (
      <div ref={ref} className={`${styles.container} ${className}`.trim()}>
        <div className={styles.pane} style={{ width: `${split}%` }}>
          {left}
        </div>
        <div
          className={styles.splitter}
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
        <div className={styles.pane} style={{ width: `${100 - split}%` }}>
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
    <div ref={ref} className={`${styles.resizable} ${className}`.trim()}>
      {children}
    </div>
  );
});

ResizablePanel.displayName = "ResizablePanel";

