"use client";

import { type FC, type ReactNode } from "react";
import styles from "./print-layout.module.css";

export interface PrintLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PrintLayout: FC<PrintLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.printContainer} ${className}`.trim()}>
      {children}
    </div>
  );
};
