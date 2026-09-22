"use client";

import React, { useState } from "react";
import { Button, type ButtonProps } from "../../../core/primitives/button";
import { Modal } from "../../../core/overlays/modal";
import { FormField, Input } from "../../../core/inputs/form-control";
import styles from "./break-glass-action.module.css";

export interface BreakGlassActionProps {
  buttonLabel: React.ReactNode;
  modalTitle?: string;
  modalDescription?: React.ReactNode;
  actionLabel?: string;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  minimumJustificationLength?: number;
  onConfirm: (justification: string) => Promise<void> | void;
  className?: string;
}

export function BreakGlassAction({
  buttonLabel,
  modalTitle = "Action requires justification",
  modalDescription = "This is a privileged or destructive action. Please provide a justification or ticket number for the immutable audit log.",
  actionLabel = "Confirm Action",
  variant = "danger",
  disabled = false,
  minimumJustificationLength = 10,
  onConfirm,
  className = "",
}: BreakGlassActionProps) {
  const [open, setOpen] = useState(false);
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (justification.trim().length < minimumJustificationLength) {
      setError(`Justification must be at least ${minimumJustificationLength} characters.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onConfirm(justification);
      setOpen(false);
      setJustification("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setJustification("");
    setError(null);
  };

  return (
    <div className={`${styles.actionContainer} ${className}`}>
      <Button variant={variant} disabled={disabled} onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title={modalTitle}
        description={modalDescription}
        footer={
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant={variant}
              onClick={handleConfirm}
              disabled={loading || justification.trim().length < minimumJustificationLength}
            >
              {loading ? "Processing..." : actionLabel}
            </Button>
          </div>
        }
      >
        <div className={styles.formWrapper}>
          <FormField label="Audit Justification" required error={error}>
            <Input
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. TICK-1234 Emergency override authorized by SRE lead"
              minLength={minimumJustificationLength}
              autoFocus
              disabled={loading}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
