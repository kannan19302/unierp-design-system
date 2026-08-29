"use client";

import { useState, useId, useRef, useEffect, type FC, type ReactNode } from "react";
import { Portal } from "../portal";
import styles from "./tooltip.module.css";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  id?: string;
  className?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  id: customId,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const generatedId = useId();
  const tooltipId = customId ?? generatedId;

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = rect.top - 28;
      let left = rect.left + rect.width / 2;

      if (side === "bottom") {
        top = rect.bottom + 4;
      } else if (side === "left") {
        top = rect.top;
        left = rect.left - 60;
      } else if (side === "right") {
        top = rect.top;
        left = rect.right + 8;
      }
      setCoords({ top, left });
    }
  }, [visible, side]);

  return (
    <span
      ref={triggerRef}
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
            className={`${styles.tooltip} ${className}`.trim()}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </span>
  );
};
