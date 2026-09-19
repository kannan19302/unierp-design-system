"use client";

import {
  forwardRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "./promotion-approval-inspector.module.css";

export type ReleaseRiskLevel = "low" | "medium" | "high";

export interface PromotionChangesSummary {
  filesCount: number;
  migrationsCount: number;
  riskLevel: ReleaseRiskLevel;
  breakingChangesCount?: number;
}

export interface PromotionApprovalInspectorProps {
  /** Target release version e.g. "v2.5.0" */
  releaseVersion: string;
  /** Destination environment e.g. "Production Multi-Tenant" */
  targetEnvironment: string;
  /** Original commit / PR author */
  author: string;
  /** Current logged-in user evaluating approval */
  currentReviewer: string;
  /** Role of current reviewer */
  reviewerRole?: string;
  /** Whether current reviewer satisfies separation of duties (author !== reviewer) */
  canApprove?: boolean;
  /** Callback when promotion is approved */
  onApprove: (notes: string) => void;
  /** Callback when promotion is rejected */
  onReject: (reason: string) => void;
  /** Summary of payload changes */
  changesSummary?: PromotionChangesSummary;
  className?: string;
  style?: CSSProperties;
}

/**
 * `<PromotionApprovalInspector>` — Dual-control release promotion approval panel with separation of duties enforcement.
 *
 * @maturity stable
 */
export const PromotionApprovalInspector = forwardRef<
  HTMLDivElement,
  PromotionApprovalInspectorProps
>(
  (
    {
      releaseVersion,
      targetEnvironment,
      author,
      currentReviewer,
      reviewerRole = "Release Manager",
      canApprove = true,
      onApprove,
      onReject,
      changesSummary = { filesCount: 14, migrationsCount: 1, riskLevel: "low", breakingChangesCount: 0 },
      className,
      style,
    },
    ref,
  ) => {
    const [notes, setNotes] = useState("");
    const isSelfApprovalViolation = author.toLowerCase() === currentReviewer.toLowerCase();
    const isAuthorized = canApprove && !isSelfApprovalViolation;

    const containerClasses = [styles.inspector, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={`Promotion Approval: ${releaseVersion} to ${targetEnvironment}`}
      >
        <div className={styles.header}>
          <div className={styles.tagLine}>Release Gate Review</div>
          <h3 className={styles.title}>
            Promoting {releaseVersion} to {targetEnvironment}
          </h3>
        </div>

        <div className={styles.body}>
          {isSelfApprovalViolation && (
            <div className={styles.violationAlert} role="alert">
              <span className={styles.alertIcon} aria-hidden="true">⚠️</span>
              <div>
                <strong>Separation of Duties Enforced</strong>
                <p className={styles.alertDesc}>
                  You authored this release ({author}). Enterprise policy requires an independent peer reviewer to approve production deployment.
                </p>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h4 className={styles.sectionHeading}>Reviewer Identity</h4>
            <div className={styles.kvGrid}>
              <span className={styles.key}>Reviewer:</span>
              <span className={styles.val}>{currentReviewer} ({reviewerRole})</span>
              <span className={styles.key}>Author:</span>
              <span className={styles.val}>{author}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionHeading}>Change Impact Summary</h4>
            <div className={styles.metricsRow}>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>{changesSummary.filesCount}</span>
                <span className={styles.metricLabel}>Files Changed</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>{changesSummary.migrationsCount}</span>
                <span className={styles.metricLabel}>DB Migrations</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>{changesSummary.breakingChangesCount ?? 0}</span>
                <span className={styles.metricLabel}>Breaking Changes</span>
              </div>
              <div className={styles.metricCard}>
                <span className={`${styles.riskBadge} ${styles[changesSummary.riskLevel]}`}>
                  {changesSummary.riskLevel.toUpperCase()}
                </span>
                <span className={styles.metricLabel}>Risk Assessment</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="approver-notes" className={styles.sectionHeading}>
              Approval Audit Notes
            </label>
            <textarea
              id="approver-notes"
              className={styles.notesTextarea}
              placeholder="Provide justification or sign-off remarks for audit logs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.rejectBtn}
            onClick={() => onReject(notes || "Rejected during peer review")}
            aria-label="Reject release promotion"
          >
            Reject Promotion
          </button>
          <button
            type="button"
            className={styles.approveBtn}
            disabled={!isAuthorized}
            onClick={() => onApprove(notes)}
            aria-label="Approve and deploy release"
          >
            Approve & Deploy
          </button>
        </div>
      </div>
    );
  },
);

PromotionApprovalInspector.displayName = "PromotionApprovalInspector";
