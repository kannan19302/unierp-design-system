"use client";

import {
  useState,
  useId,
  forwardRef,
  type FC,
  type ReactNode,
  type CSSProperties,
} from "react";
import { X } from "lucide-react";
import { Portal } from "../../primitives/portal";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { useEscapeKey, useFocusTrap, useScrollLock } from "../overlay-hooks";
import styles from "./drawer.module.css";

export const drawerVariants = cva(styles.panel, {
  variants: {
    side: {
      right: styles.right,
      left: styles.left,
      top: styles.top,
      bottom: styles.bottom,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: {
    side: "right",
    size: "md",
  },
});

export interface DrawerProps extends VariantProps<typeof drawerVariants> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  /** Optional custom inline-size (width) in px */
  width?: number;
  footer?: ReactNode;
  children?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

const DRAWER_WIDTH: Record<NonNullable<DrawerProps["size"]>, number> = {
  sm: 360,
  md: 480,
  lg: 640,
};

/**
 * `<Drawer>` / `<Sheet>` — Sliding sheet overlay for side-panel forms, filters, query builders, and inspectors.
 * Benchmarked against shadcn Sheet, Radix Dialog, and Salesforce SLDS Panel.
 *
 * @maturity stable
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      title,
      side = "right",
      size = "md",
      width,
      footer,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": customAriaLabelledBy,
      className = "",
    },
    ref
  ) => {
    const [panel, setPanel] = useState<HTMLDivElement | null>(null);
    const autoId = useId();
    const titleId = title ? `drawer-title-${autoId}` : undefined;

    useEscapeKey(onClose, open);
    useFocusTrap(panel, open);
    useScrollLock(open);

    if (!open) return null;

    const customInlineSize = width ?? (width !== undefined ? DRAWER_WIDTH[size] : undefined);
    const sideStyles: Record<string, CSSProperties> = {
      right: customInlineSize ? { inlineSize: `${customInlineSize}px` } : {},
      left: customInlineSize ? { inlineSize: `${customInlineSize}px` } : {},
      top: { blockSize: "var(--drawer-height-vertical, 320px)" },
      bottom: { blockSize: "var(--drawer-height-vertical, 320px)" },
    };

    const resolvedLabelledBy = customAriaLabelledBy ?? titleId;

    return (
      <Portal>
        <div
          data-slot="drawer-backdrop"
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={(node) => {
            setPanel(node);
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as any).current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          data-slot="drawer"
          data-side={side}
          data-size={size}
          aria-labelledby={resolvedLabelledBy}
          aria-label={
            !resolvedLabelledBy
              ? ariaLabel ?? (typeof title === "string" ? title : undefined)
              : undefined
          }
          tabIndex={-1}
          className={drawerVariants({ side, size, className })}
          style={sideStyles[side]}
        >
          <div data-slot="drawer-header" className={styles.header}>
            {title && (
              <h2 id={titleId} data-slot="drawer-title" className={styles.title}>
                {title}
              </h2>
            )}
            <button
              type="button"
              data-slot="drawer-close"
              onClick={onClose}
              aria-label="Close drawer"
              className={styles.closeBtn}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div data-slot="drawer-body" className={styles.body}>
            {children}
          </div>
          {footer && (
            <div data-slot="drawer-footer" className={styles.footer}>
              {footer}
            </div>
          )}
        </div>
      </Portal>
    );
  }
);

Drawer.displayName = "Drawer";

export interface SheetProps extends DrawerProps {}

export const Sheet: FC<SheetProps> = (props) => <Drawer {...props} />;
