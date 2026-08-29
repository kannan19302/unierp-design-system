"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import { Portal } from "../portal";
import { useEscapeKey } from "../overlay-hooks";
import styles from "./popover.module.css";

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "left" | "right" | "center";
  className?: string;
}

export const Popover: FC<PopoverProps> = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = "left",
  className = "",
}) => {
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

  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const top = rect.bottom + 4;
      let left = rect.left;
      if (align === "right") left = rect.right - 200;
      else if (align === "center") left = rect.left + rect.width / 2 - 100;
      setCoords({ top, left });
    }
  }, [open, align]);

  return (
    <div ref={triggerRef} className={styles.container}>
      <div
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
            className={`${styles.popover} ${className}`.trim()}
            style={{
              top: `${coords.top}px`,
              left: `${Math.max(8, coords.left)}px`,
            }}
          >
            {children}
          </div>
        </Portal>
      )}
    </div>
  );
};
