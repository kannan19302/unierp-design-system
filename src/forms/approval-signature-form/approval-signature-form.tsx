"use client";

import {
  useState,
  useId,
  forwardRef,
  type HTMLAttributes,
} from "react";
import styles from "./approval-signature-form.module.css";

export interface ApprovalSignatureFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSign"> {
  signerName: string;
  documentTitle: string;
  documentRef?: string;
  onSign?: (signature: string) => void;
  onReject?: (reason: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * `<ApprovalSignatureForm>` coordinates legally-binding electronic signoffs and dual-custody
 * approval workflows for high-stakes ERP transactions (Journal Vouchers, POs, Treasury Disbursements).
 *
 * @maturity stable
 */
export const ApprovalSignatureForm = forwardRef<
  HTMLDivElement,
  ApprovalSignatureFormProps
>(
  (
    {
      signerName,
      documentTitle,
      documentRef,
      onSign,
      onReject,
      title = "Document Approval",
      subtitle,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const agreeId = useId();
    const [agreed, setAgreed] = useState(false);
    const [rejectMode, setRejectMode] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const handleSign = () => {
      if (agreed && onSign) {
        onSign(signerName);
      }
    };

    const handleReject = () => {
      if (onReject) {
        onReject(rejectReason);
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="region"
        aria-label={title}
        {...restProps}
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.label}>Document</div>
            <div className={styles.value}>{documentTitle}</div>
            {documentRef && (
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBlockStart: "var(--space-1)" }}>
                Reference ID: <code>{documentRef}</code>
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.label}>Signer</div>
            <div className={styles.value}>{signerName}</div>
          </div>

          <div className={styles.agreementRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className={styles.checkbox}
              id={agreeId}
            />
            <label htmlFor={agreeId} className={styles.checkboxLabel}>
              I agree to electronically sign and execute this enterprise document.
            </label>
          </div>

          {rejectMode && (
            <div style={{ marginBlock: "var(--space-2)" }}>
              <label
                htmlFor={`${agreeId}-reject-reason`}
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-secondary)",
                  marginBlockEnd: "var(--space-1)",
                }}
              >
                Rejection Reason (Required)
              </label>
              <textarea
                id={`${agreeId}-reject-reason`}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Specify regulatory or commercial grounds for rejection..."
                rows={3}
                style={{
                  inlineSize: "100%",
                  paddingBlock: "var(--space-2)",
                  paddingInline: "var(--space-3)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  fontFamily: "inherit",
                  fontSize: "var(--text-sm)",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div className={styles.actions}>
            {!rejectMode ? (
              <>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={!agreed}
                  onClick={handleSign}
                >
                  Sign & Approve
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnReject}`}
                  onClick={() => setRejectMode(true)}
                >
                  Reject...
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnReject}`}
                  disabled={!rejectReason.trim()}
                  onClick={handleReject}
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => setRejectMode(false)}
                >
                  Cancel Rejection
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ApprovalSignatureForm.displayName = "ApprovalSignatureForm";
