"use client";

import {
  useState,
  useEffect,
  useRef,
  type FC,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ShieldAlert, ShieldCheck, KeyRound, Copy, Check } from "lucide-react";
import styles from "./dual-control-modal.module.css";

export type ControlRiskLevel = "critical" | "high" | "moderate";
export type DualControlDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface DualControlSignoffData {
  reviewerIdentifier: string;
  securityCredential: string;
  justificationReason: string;
  sha256Fingerprint: string;
  timestamp: string;
}

export interface DualControlModalProps {
  /** Whether the modal is actively visible */
  open: boolean;
  /** Callback to dismiss or abort */
  onClose: () => void;
  /** Callback with verified signoff payload upon submission */
  onAuthorize: (signoff: DualControlSignoffData) => void;
  /** Title of the high-stakes transaction */
  operationTitle: string;
  /** Operation classification badge */
  operationType?: string;
  /** Security risk tier */
  riskLevel?: ControlRiskLevel;
  /** Target asset, account, or entity affected */
  targetEntity: string;
  /** Name of original clerk/initiator */
  initiatorName: string;
  /** Role/designation of initiator */
  initiatorRole?: string;
  /** Cryptographic transaction digest */
  sha256Fingerprint?: string;
  /** Regulatory policy compliance citation */
  complianceStandard?: string;
  /** Density scale */
  density?: DualControlDensity;
  className?: string;
}

/**
 * `<DualControlModal>` — Four-eyes principle approval dialog.
 * Benchmarked against Mercury Banking OS (#45), Coupa (#34), Goldman Sachs (#21), and UniERP API Security Standards.
 */
export const DualControlModal: FC<DualControlModalProps> = ({
  open,
  onClose,
  onAuthorize,
  operationTitle,
  operationType = "CRITICAL_AUTHORIZATION",
  riskLevel = "critical",
  targetEntity,
  initiatorName,
  initiatorRole = "Finance Operator",
  sha256Fingerprint = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  complianceStandard = "SOX-404 / SOC2 Dual Authorization Standard",
  density = "compact",
  className = "",
}) => {
  const [reviewerId, setReviewerId] = useState("");
  const [credential, setCredential] = useState("");
  const [justification, setJustification] = useState("");
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      setReviewerId("");
      setCredential("");
      setJustification("");
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  const handleCopyFingerprint = () => {
    navigator.clipboard?.writeText(sha256Fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewerId.trim() || !credential.trim() || !justification.trim()) {
      return;
    }

    onAuthorize({
      reviewerIdentifier: reviewerId.trim(),
      securityCredential: credential.trim(),
      justificationReason: justification.trim(),
      sha256Fingerprint,
      timestamp: new Date().toISOString(),
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${className}`.trim()}
        data-density={density}
        data-risk={riskLevel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dual-control-title"
        aria-describedby="dual-control-desc"
      >
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerIconWrap}>
            <ShieldAlert size={20} className={styles.shieldIcon} aria-hidden="true" />
          </div>
          <div className={styles.headerText}>
            <div className={styles.badgeRow}>
              <span className={styles.riskBadge}>{operationType}</span>
              <span className={styles.compliancePill}>{complianceStandard}</span>
            </div>
            <h2 id="dual-control-title" className={styles.title}>
              {operationTitle}
            </h2>
          </div>
        </div>

        {/* ── Transaction Brief Card ── */}
        <div id="dual-control-desc" className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Target Scope:</span>
            <span className={styles.summaryValue}>{targetEntity}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Initiated By:</span>
            <span className={styles.summaryValue}>
              {initiatorName} <span className={styles.subtext}>({initiatorRole})</span>
            </span>
          </div>
          <div className={styles.fingerprintRow}>
            <span className={styles.fingerprintLabel}>SHA-256 Digest:</span>
            <code className={styles.fingerprintCode}>{sha256Fingerprint.slice(0, 32)}…</code>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopyFingerprint}
              title="Copy full cryptographic SHA-256 hash"
              aria-label="Copy full cryptographic SHA-256 hash"
            >
              {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* ── Signoff Form ── */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="reviewer-id" className={styles.label}>
              Secondary Reviewer Identifier (Email / Corporate ID)
            </label>
            <input
              ref={firstInputRef}
              id="reviewer-id"
              type="text"
              required
              className={styles.input}
              placeholder="e.g. vp.finance@unierp.enterprise"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="security-credential" className={styles.label}>
              Security Credential / MFA Hardware Token
            </label>
            <div className={styles.inputWithIcon}>
              <KeyRound size={15} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="security-credential"
                type="password"
                required
                className={`${styles.input} ${styles.inputPadded}`}
                placeholder="Enter password or 6-digit OTP code"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="justification-reason" className={styles.label}>
              Policy Justification & Audit Note
            </label>
            <textarea
              id="justification-reason"
              required
              rows={2}
              className={styles.textarea}
              placeholder="State business reason for approving this high-impact operation..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
          </div>

          {/* ── Action Bar ── */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Abort Operation
            </button>
            <button
              type="submit"
              className={styles.authorizeBtn}
              disabled={!reviewerId.trim() || !credential.trim() || !justification.trim()}
            >
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Authorize & Sign Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
