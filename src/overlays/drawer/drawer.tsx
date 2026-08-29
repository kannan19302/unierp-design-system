"use client";

import { useState, type FC, type ReactNode, type CSSProperties } from "react";
import { X } from "lucide-react";
import { Portal } from "../portal";
import { useEscapeKey, useFocusTrap, useScrollLock } from "../overlay-hooks";
import styles from "./drawer.module.css";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  width?: number;
  footer?: ReactNode;
  children?: ReactNode;
  "aria-label"?: string;
  className?: string;
}

const DRAWER_WIDTH: Record<NonNullable<DrawerProps["size"]>, number> = {
  sm: 360,
  md: 480,
  lg: 640,
};

export const Drawer: FC<DrawerProps> = ({
  open,
  onClose,
  title,
  side = "right",
  size = "md",
  width,
  footer,
  children,
  "aria-label": ariaLabel,
  className = "",
}) => {
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  useEscapeKey(onClose, open);
  useFocusTrap(panel, open);
  useScrollLock(open);

  if (!open) return null;

  const contentWidth = width ?? DRAWER_WIDTH[size];
  const sideStyles: Record<string, CSSProperties> = {
    right: { width: `${contentWidth}px` },
    left: { width: `${contentWidth}px` },
    top: { height: "320px" },
    bottom: { height: "320px" },
  };

  const panelClass = [styles.panel, styles[side], className]
    .filter(Boolean)
    .join(" ");

  return (
    <Portal>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={setPanel}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
        tabIndex={-1}
        className={panelClass}
        style={sideStyles[side]}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className={styles.closeBtn}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </Portal>
  );
};

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  children?: ReactNode;
}

export const Sheet: FC<SheetProps> = ({ open, onClose, title, side = "right", children }) => (
  <Drawer open={open} onClose={onClose} title={title} side={side}>
    {children}
  </Drawer>
);
