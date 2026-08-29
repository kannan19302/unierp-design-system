"use client";

import { useState, useEffect, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./portal.module.css";

export interface PortalProps {
  children: ReactNode;
  /** Optional custom container node */
  container?: Element | DocumentFragment | null;
}

export const Portal: FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(
    <div className={styles.portalHost}>{children}</div>,
    container || document.body
  );
};
