"use client";

import { useRef, useEffect, type ReactNode, type RefObject } from "react";
import { cn } from "../../utils/cn";
import styles from "./focus-trap.module.css";

export interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
  restoreFocus?: boolean;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FocusTrap({
  children,
  active = true,
  initialFocusRef,
  onEscape,
  restoreFocus = true,
  className,
}: FocusTrapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (rootRef.current) {
      const focusable = rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length > 0 && focusable[0]) {
        focusable[0].focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active || !rootRef.current) return;

      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (firstElement && lastElement && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (firstElement && lastElement && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus && previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [active, initialFocusRef, onEscape, restoreFocus]);

  return (
    <div ref={rootRef} className={cn(styles.trap, className)}>
      {children}
    </div>
  );
}
