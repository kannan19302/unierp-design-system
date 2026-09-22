"use client";

import { useState, type FC } from "react";
import { AlertTriangle, Check, RefreshCw, X } from "lucide-react";
import styles from "./conflict-resolver.module.css";

export interface ConflictFieldDiff {
  fieldKey: string;
  fieldLabel: string;
  clientValue: string | number | boolean | null;
  serverValue: string | number | boolean | null;
}

export interface ConflictResolverProps {
  open: boolean;
  onClose: () => void;
  entityName?: string;
  recordId?: string;
  conflicts: ConflictFieldDiff[];
  onResolve: (resolvedValues: Record<string, string | number | boolean | null>) => void;
  className?: string;
}

export const ConflictResolver: FC<ConflictResolverProps> = ({
  open,
  onClose,
  entityName = "Record",
  recordId,
  conflicts,
  onResolve,
  className = "",
}) => {
  const [resolutions, setResolutions] = useState<
    Record<string, "client" | "server">
  >(() => {
    const initial: Record<string, "client" | "server"> = {};
    for (const c of conflicts) {
      initial[c.fieldKey] = "client";
    }
    return initial;
  });

  if (!open) return null;

  const handleResolveAll = (choice: "client" | "server") => {
    const updated: Record<string, "client" | "server"> = {};
    for (const c of conflicts) {
      updated[c.fieldKey] = choice;
    }
    setResolutions(updated);
  };

  const handleApply = () => {
    const finalValues: Record<string, string | number | boolean | null> = {};
    for (const c of conflicts) {
      const mode = resolutions[c.fieldKey] || "client";
      if (mode === "client") {
        finalValues[c.fieldKey] = c.clientValue;
      } else {
        finalValues[c.fieldKey] = c.serverValue;
      }
    }
    onResolve(finalValues);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Concurrency Conflict Detected">
      <div className={`${styles.dialog} ${className}`.trim()}>
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <AlertTriangle size={20} className={styles.warningIcon} aria-hidden="true" />
            <div>
              <h2 className={styles.title}>Simultaneous Modification Detected</h2>
              <p className={styles.subtitle}>
                Another user modified {entityName} {recordId ? `(#${recordId})` : ""} while you were editing.
                Resolve the differences below before saving.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close conflict resolver"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.quickActions}>
          <span className={styles.quickLabel}>Quick Action:</span>
          <button
            type="button"
            className={styles.quickBtn}
            onClick={() => handleResolveAll("client")}
          >
            Keep All My Changes
          </button>
          <button
            type="button"
            className={styles.quickBtn}
            onClick={() => handleResolveAll("server")}
          >
            Accept All Server Changes
          </button>
        </div>

        <div className={styles.diffList}>
          {conflicts.map((diff) => {
            const selectedMode = resolutions[diff.fieldKey] || "client";

            return (
              <div key={diff.fieldKey} className={styles.diffCard}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldName}>{diff.fieldLabel}</span>
                  <span className={styles.fieldCode}>{diff.fieldKey}</span>
                </div>

                <div className={styles.comparisonGrid}>
                  {/* Client Side */}
                  <div
                    className={`${styles.valueBox} ${
                      selectedMode === "client" ? styles.selectedBox : ""
                    }`}
                    onClick={() =>
                      setResolutions((prev) => ({ ...prev, [diff.fieldKey]: "client" }))
                    }
                  >
                    <div className={styles.boxHeader}>
                      <span className={styles.boxTag}>Your Version (Local)</span>
                      {selectedMode === "client" && (
                        <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                      )}
                    </div>
                    <div className={styles.boxValue}>
                      {String(diff.clientValue ?? "—")}
                    </div>
                  </div>

                  {/* Server Side */}
                  <div
                    className={`${styles.valueBox} ${
                      selectedMode === "server" ? styles.selectedBox : ""
                    }`}
                    onClick={() =>
                      setResolutions((prev) => ({ ...prev, [diff.fieldKey]: "server" }))
                    }
                  >
                    <div className={styles.boxHeader}>
                      <span className={styles.boxTag}>Latest Server Version</span>
                      {selectedMode === "server" && (
                        <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                      )}
                    </div>
                    <div className={styles.boxValue}>
                      {String(diff.serverValue ?? "—")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.applyBtn} onClick={handleApply}>
            <RefreshCw size={14} aria-hidden="true" />
            <span>Apply Resolutions & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
