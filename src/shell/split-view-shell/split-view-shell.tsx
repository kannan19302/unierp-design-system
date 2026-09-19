import { forwardRef, type ReactNode } from "react";
import styles from "./split-view-shell.module.css";

export interface SplitViewShellProps {
  masterHeader?: ReactNode;
  masterContent: ReactNode;
  detailContent: ReactNode;
  masterWidth?: number | string;
  /** Density scale */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

/**
 * `<SplitViewShell>` — Master-detail split floorplan for high-volume triage queues, ledger reviews, and record inspection.
 * @maturity stable
 */
export const SplitViewShell = forwardRef<HTMLDivElement, SplitViewShellProps>(({
  masterHeader,
  masterContent,
  detailContent,
  masterWidth,
  density,
  className,
}, ref) => {
  const style = masterWidth
    ? ({ "--split-master-width": typeof masterWidth === "number" ? `${masterWidth}px` : masterWidth } as Record<string, string>)
    : undefined;

  return (
    <div
      ref={ref}
      className={`${styles.root} ${className ?? ""}`}
      style={style}
      data-floorplan="split-view-shell"
      data-density={density}
    >
      <aside aria-label="Triage Queue" className={styles.master_pane}>
        {masterHeader && <div className={styles.master_header}>{masterHeader}</div>}
        <div className={styles.master_list}>{masterContent}</div>
      </aside>

      <main aria-label="Active Record Details" className={styles.detail_pane}>
        {detailContent}
      </main>
    </div>
  );
});

SplitViewShell.displayName = "SplitViewShell";
