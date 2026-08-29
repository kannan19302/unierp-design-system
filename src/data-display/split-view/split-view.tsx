"use client";

import { useState, type FC, type ReactNode } from "react";
import styles from "./split-view.module.css";

export interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number; // percentage
  className?: string;
}

export const SplitView: FC<SplitViewProps> = ({
  left,
  right,
  initialSplit = 30,
  className = "",
}) => {
  const [split, setSplit] = useState(initialSplit);

  return (
    <div className={`${styles.container} ${className}`.trim()}>
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
};

export const ResizablePanel: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return <div className={`${styles.resizable} ${className}`.trim()}>{children}</div>;
};
