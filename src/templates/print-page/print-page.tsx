"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./print-page.module.css";

export const printLayoutVariants = cva(styles.printContainer, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface PrintLayoutProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof printLayoutVariants> {
  children: ReactNode;
  className?: string;
}

/**
 * `<PrintLayout>` wraps high-fidelity document views (invoices, receipts, ledger statements),
 * establishing print media stylesheet boundaries and margins.
 *
 * @maturity stable
 */
export const PrintLayout = forwardRef<HTMLDivElement, PrintLayoutProps>(
  ({ children, density = "standard", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${printLayoutVariants({ density })} ${className}`.trim()}
        data-slot="print-page"
        data-density={density}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PrintLayout.displayName = "PrintLayout";

export const PrintPageTemplate = PrintLayout;
