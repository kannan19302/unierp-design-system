"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import styles from "./scroll-area.module.css";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum block size / height of the scroll viewport */
  maxHeight?: string | number;
  /** Maximum inline size / width of the scroll viewport */
  maxWidth?: string | number;
  /** Scrollbar behavior orientation */
  orientation?: "vertical" | "horizontal" | "both";
  /** Visually hide scrollbars while preserving scroll functionality */
  hideScrollbar?: boolean;
  children: ReactNode;
}

/**
 * `<ScrollArea>` — Custom styled scroll container adhering to Strata DL 3.0.
 *
 * Implements smooth enterprise scrolling, custom thin scrollbar styling,
 * and keyboard-focusable viewport navigation.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      maxHeight,
      maxWidth,
      orientation = "vertical",
      hideScrollbar = false,
      children,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const rootStyle: CSSProperties = {
      ...style,
      ...(maxHeight ? { maxBlockSize: maxHeight } : {}),
      ...(maxWidth ? { maxInlineSize: maxWidth } : {}),
    };

    const rootClasses = [
      styles.scrollArea,
      styles[orientation],
      hideScrollbar ? styles.hideScrollbar : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Scrollable content"
        className={rootClasses}
        style={rootStyle}
        {...props}
      >
        <div className={styles.viewport}>{children}</div>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export interface ScrollBarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

/**
 * `<ScrollBar>` — Visual indicator bar helper.
 */
export const ScrollBar = forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ orientation = "vertical", className = "", ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${styles.scrollbar} ${styles[`bar_${orientation}`]} ${className}`.trim()}
      {...props}
    />
  )
);

ScrollBar.displayName = "ScrollBar";
