"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./separator.module.css";

export const separatorVariants = cva(styles.separator, {
  variants: {
    orientation: {
      horizontal: styles.horizontal,
      vertical: styles.vertical,
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface SeparatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Whether the element is purely visual or semantic to assistive technology */
  decorative?: boolean;
}

/**
 * `<Separator>` — Visual or semantic divider primitive adhering to Strata DL 3.0.
 * Standardized with cva, data-slot, and W3C APG separator pattern.
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
    const rootClass = `${separatorVariants({ orientation })} ${className}`.trim();

    const ariaProps = decorative
      ? { "aria-hidden": true }
      : { role: "separator", "aria-orientation": orientation };

    return (
      <div
        ref={ref}
        data-slot="separator"
        data-orientation={orientation}
        className={rootClass}
        {...ariaProps}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";
