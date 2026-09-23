"use client";

import { forwardRef, type HTMLAttributes } from "react";
import styles from "./separator.module.css";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Whether the element is purely visual or semantic to assistive technology */
  decorative?: boolean;
}

/**
 * `<Separator>` — Visual or semantic divider primitive adhering to Strata DL 3.0.
 *
 * Provides horizontal or vertical line separators with accessible ARIA semantics.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      decorative = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const rootClass = [
      styles.separator,
      styles[orientation],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const ariaProps = decorative
      ? { "aria-hidden": true }
      : { role: "separator", "aria-orientation": orientation };

    return (
      <div
        ref={ref}
        className={rootClass}
        {...ariaProps}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";
