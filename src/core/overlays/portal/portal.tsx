"use client";

import { useState, useEffect, forwardRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./portal.module.css";

export interface PortalProps {
  children: ReactNode;
  /** Optional custom container node */
  container?: Element | DocumentFragment | null;
}

/**
 * Portal component to render children into an alternate DOM node.
 *
 * @maturity stable
 */
export const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  { children, container },
  ref
) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div ref={ref} className={styles.portalHost}>
      {children}
    </div>,
    container || document.body
  );
});

Portal.displayName = "Portal";
