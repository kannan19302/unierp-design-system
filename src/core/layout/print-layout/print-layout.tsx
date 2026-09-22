"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./print-layout.module.css";

export interface PrintLayoutProps extends HTMLAttributes<HTMLDivElement> {
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
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.printContainer} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PrintLayout.displayName = "PrintLayout";

