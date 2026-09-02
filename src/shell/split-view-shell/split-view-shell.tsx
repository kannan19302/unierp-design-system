"use client";

import type { FC, ReactNode } from "react";
import styles from "./split-view-shell.module.css";

export interface SplitViewShellProps {
  masterHeader?: ReactNode;
  masterContent: ReactNode;
  detailContent: ReactNode;
  masterWidth?: number | string;
  className?: string;
}

export const SplitViewShell: FC<SplitViewShellProps> = ({
  masterHeader,
  masterContent,
  detailContent,
  masterWidth,
  className,
}) => {
  const style = masterWidth
    ? ({ "--split-master-width": typeof masterWidth === "number" ? `${masterWidth}px` : masterWidth } as Record<string, string>)
    : undefined;

  return (
    <div className={`${styles.root} ${className ?? ""}`} style={style}>
      <aside aria-label="Triage Queue" className={styles.master_pane}>
        {masterHeader && <div className={styles.master_header}>{masterHeader}</div>}
        <div className={styles.master_list}>{masterContent}</div>
      </aside>

      <main aria-label="Active Record Details" className={styles.detail_pane}>
        {detailContent}
      </main>
    </div>
  );
};
