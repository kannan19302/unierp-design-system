"use client";

import { useState, useEffect, forwardRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cva } from "../../foundation/utils/cva";
import styles from "./portal.module.css";

/**
 * Class variance authority definitions for Portal.
 * Standardized across Radix UI / shadcn portal benchmark.
 */
export const portalVariants = cva(styles.portalHost);

export interface PortalProps {
  children: ReactNode;
  /** Optional custom container node */
  container?: Element | DocumentFragment | null;
  className?: string;
}

/**
 * `<Portal>` — Component to render children into an alternate DOM node (defaults to document.body).
 * Standardized with cva, data-slot, and SSR hydration safety.
 *
 * @maturity stable
 */
export const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  { children, container, className = "" },
  ref
) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      data-slot="portal"
      className={portalVariants({ className })}
    >
      {children}
    </div>,
    container || document.body
  );
});

Portal.displayName = "Portal";
