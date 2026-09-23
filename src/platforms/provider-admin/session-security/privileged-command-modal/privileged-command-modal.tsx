"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { Button } from "../../../../core/primitives/button";
import { FormField, Input } from "../../../../core/inputs/form-control";
import styles from "./privileged-command-modal.module.css";

export interface PrivilegedCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionName: string;
  appId: string;
  targetDescription: string;
  previewData?: Record<string, string | number>;
  onExecute?: (justification: string, approvalRef: string) => Promise<void> | void;
}

export function PrivilegedCommandModal({
  isOpen,
  onClose,
  title,
  actionName,
  appId,
  targetDescription,
  previewData = {
    "Target Scope": "Active Region / Primary Cell",
    "Assurance Tier": "Tier-1 Dual-Control Required",
    "Estimated Recovery": "Sub-100ms Atomic Rollback",
    "Audit Ledger": "Durable Outbox Immutable Commit",
  },
  onExecute,
}: PrivilegedCommandModalProps) {
  const [step, setStep] = useState<"preview" | "justification" | "executing" | "completed">("preview");
  const [justification, setJustification] = useState("");
  const [approvalRef, setApprovalRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!justification.trim() || justification.trim().length < 8) {
      setError("Justification must be at least 8 characters.");
      return;
    }
    setError(null);
    setStep("executing");
    try {
      if (onExecute) {
        await onExecute(justification, approvalRef);
      }
      setStep("completed");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStep("justification");
    }
  };

  const handleClose = () => {
    setStep("preview");
    setJustification("");
    setApprovalRef("");
    setError(null);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="priv-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h3 id="priv-modal-title" className={styles.headerTitle}>
            <ShieldAlert size={18} className={styles.headerIcon} />
            <span>{title}</span>
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </header>

        <div className={styles.body}>
          {step === "preview" && (
            <>
              <div className={styles.warningBox}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>
                  This is a privileged control-plane operation ({actionName}) targeting:{" "}
                  <strong>{targetDescription}</strong> [{appId}].
                </span>
              </div>

              <div className={styles.previewGrid}>
                {Object.entries(previewData).map(([key, val]) => (
                  <div key={key} className={styles.previewRow}>
                    <span className={styles.previewKey}>{key}</span>
                    <span className={styles.previewValue}>{val}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === "justification" && (
            <>
              <FormField
                label="Audit Justification"
                required
                error={error}
                hint="Provide a ticket ID (e.g. INC-4091) or engineering rationale."
              >
                <Input
                  value={justification}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setJustification(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. INC-4091 Urgent failover to standby replica"
                  autoFocus
                />
              </FormField>

              <FormField label="Approval Reference (Optional)">
                <Input
                  value={approvalRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApprovalRef(e.target.value)}
                  placeholder="e.g. Dual-approval signature token or Slack link"
                />
              </FormField>
            </>
          )}

          {step === "executing" && (
            <div style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                Executing privileged command with immutable ledger commit...
              </p>
            </div>
          )}

          {step === "completed" && (
            <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
              <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: "0 auto var(--space-3)" }} />
              <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)" }}>
                Operation Dispatched Successfully
              </p>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          {step === "preview" && (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setStep("justification")}>
                Authorize & Proceed
              </Button>
            </>
          )}

          {step === "justification" && (
            <>
              <Button variant="secondary" onClick={() => setStep("preview")}>
                Back
              </Button>
              <Button variant="danger" onClick={handleExecute}>
                Confirm & Commit
              </Button>
            </>
          )}

          {step === "completed" && (
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
