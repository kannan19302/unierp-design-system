"use client";

import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./quality-gates-table.module.css";

export type QualityGateStatus = "passed" | "running" | "failed" | "skipped";
export type QualityGateType = "security" | "typecheck" | "a11y" | "test" | "telemetry";

export interface QualityGateRow {
  id: string;
  name: string;
  category: QualityGateType;
  required: boolean;
  status: QualityGateStatus;
  evidence: string;
  duration?: string;
  errorLog?: string;
}

export interface QualityGatesTableProps {
  /** List of automated quality gates */
  gates: QualityGateRow[];
  /** Callback when "View Details" action is clicked */
  onViewDetails?: (gate: QualityGateRow) => void;
  /** Callback when "Re-run" action is triggered */
  onRerun?: (gate: QualityGateRow) => void;
  /** Title header */
  title?: string;
  /** Custom action slot */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const CATEGORY_LABELS: Record<QualityGateType, string> = {
  security: "Security & RLS",
  typecheck: "Static Analysis",
  a11y: "WCAG 2.2 AA",
  test: "Automated Tests",
  telemetry: "Telemetry & Logs",
};

const STATUS_LABELS: Record<QualityGateStatus, string> = {
  passed: "Passed",
  running: "Running",
  failed: "Failed",
  skipped: "Skipped",
};

/**
 * `<QualityGatesTable>` — Enterprise quality and security gates compliance inspection grid.
 *
 * @maturity stable
 */
export const QualityGatesTable = forwardRef<HTMLDivElement, QualityGatesTableProps>(
  (
    {
      gates,
      onViewDetails,
      onRerun,
      title = "Release Quality Gates",
      actions,
      className,
      style,
    },
    ref,
  ) => {
    const passedCount = gates.filter((g) => g.status === "passed").length;
    const isAllPassed = passedCount === gates.length;

    const containerClasses = [styles.container, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={title}
      >
        <div className={styles.header}>
          <div className={styles.headerLead}>
            <h3 className={styles.title}>{title}</h3>
            <span
              className={`${styles.summaryBadge} ${isAllPassed ? styles.summaryPass : styles.summaryPending}`}
            >
              {passedCount} / {gates.length} Gates Passing
            </span>
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Gate Name</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Policy</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Evidence</th>
                <th className={styles.th}>Duration</th>
                {(onViewDetails || onRerun) && <th className={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {gates.map((gate) => (
                <tr key={gate.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdName}`}>
                    <span className={styles.gateNameText}>{gate.name}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.categoryBadge}>
                      {CATEGORY_LABELS[gate.category]}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.policyBadge} ${gate.required ? styles.policyReq : styles.policyOpt}`}
                    >
                      {gate.required ? "Mandatory" : "Advisory"}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.statusPill} ${styles[gate.status]}`}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      {STATUS_LABELS[gate.status]}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.tdEvidence}`}>
                    <span className={styles.evidenceText} title={gate.evidence}>
                      {gate.evidence}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.tdDuration}`}>
                    {gate.duration ?? "—"}
                  </td>
                  {(onViewDetails || onRerun) && (
                    <td className={`${styles.td} ${styles.tdActions}`}>
                      {onViewDetails && (
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => onViewDetails(gate)}
                          aria-label={`View details for ${gate.name}`}
                        >
                          Details
                        </button>
                      )}
                      {onRerun && (
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => onRerun(gate)}
                          aria-label={`Re-run ${gate.name}`}
                        >
                          Re-run
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

QualityGatesTable.displayName = "QualityGatesTable";
