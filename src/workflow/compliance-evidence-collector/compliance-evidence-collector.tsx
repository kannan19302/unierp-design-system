import React, { useState, useId, useMemo } from "react";
import styles from "./compliance-evidence-collector.module.css";

export type ControlTestStatus = "passing" | "failing" | "stale" | "exempt";
export type EvidenceReviewState = "approved" | "pending_review" | "rejected";

export interface ComplianceEvidenceItem {
  id: string;
  filename: string;
  fileSizeBytes: number;
  sha256Hash: string;
  uploadedAt: string;
  uploadedBy: string;
  expiresInDays: number;
  reviewState: EvidenceReviewState;
  auditorNotes?: string;
}

export interface ComplianceControlItem {
  id: string;
  controlCode: string; // e.g. "CC6.1"
  framework: string; // e.g. "SOC 2 Type II"
  name: string;
  description: string;
  testStatus: ControlTestStatus;
  lastTestedAt: string;
  evidenceItems: ComplianceEvidenceItem[];
}

export interface ComplianceEvidenceCollectorProps {
  /** Framework Title */
  frameworkTitle?: string;
  /** Audit target year/period */
  auditPeriod?: string;
  /** Controls list */
  controls: ComplianceControlItem[];
  /** Callback fired when evidence is approved or rejected */
  onReviewEvidence?: (
    controlId: string,
    evidenceId: string,
    state: EvidenceReviewState,
    notes?: string
  ) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const ComplianceEvidenceCollector: React.FC<ComplianceEvidenceCollectorProps> = ({
  frameworkTitle = "SOC 2 Type II & ISO 27001 Continuous Audit Program",
  auditPeriod = "FY2026 Q3 Certification Cycle",
  controls: initialControls,
  onReviewEvidence,
  density = "compact",
  className = "",
}) => {
  const [controls, setControls] = useState<ComplianceControlItem[]>(initialControls);
  const [selectedControlId, setSelectedControlId] = useState<string>(controls[0]?.id || "");
  const headingId = useId();

  const selectedControl = controls.find((c) => c.id === selectedControlId) || controls[0];

  const readiness = useMemo(() => {
    let passing = 0;
    let failing = 0;
    let stale = 0;

    controls.forEach((c) => {
      if (c.testStatus === "passing") passing += 1;
      if (c.testStatus === "failing") failing += 1;
      if (c.testStatus === "stale") stale += 1;
    });

    const percent = controls.length > 0 ? Math.round((passing / controls.length) * 100) : 0;
    return { passing, failing, stale, percent };
  }, [controls]);

  const getStatusClass = (status: ControlTestStatus) => {
    switch (status) {
      case "passing":
        return styles.statusPassing;
      case "failing":
        return styles.statusFailing;
      case "stale":
        return styles.statusStale;
      case "exempt":
        return styles.statusExempt;
    }
  };

  const getReviewClass = (state: EvidenceReviewState) => {
    switch (state) {
      case "approved":
        return styles.reviewApproved;
      case "pending_review":
        return styles.reviewPending;
      case "rejected":
        return styles.reviewRejected;
    }
  };

  const handleReviewAction = (evidenceId: string, newState: EvidenceReviewState) => {
    setControls((prev) =>
      prev.map((ctrl) => {
        if (ctrl.id === selectedControlId) {
          return {
            ...ctrl,
            evidenceItems: ctrl.evidenceItems.map((ev) => {
              if (ev.id === evidenceId) {
                return { ...ev, reviewState: newState };
              }
              return ev;
            }),
          };
        }
        return ctrl;
      })
    );
    onReviewEvidence?.(selectedControlId, evidenceId, newState);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            🛡️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.periodBadge}>{auditPeriod}</span>
              <span className={styles.auditStatus}>CONTINUOUS TELEMETRY SYNC</span>
            </div>
            <h2 id={headingId} className={styles.title}>{frameworkTitle}</h2>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className={styles.readinessBox}>
          <span className={styles.readinessLabel}>Audit Readiness Score</span>
          <span className={styles.readinessVal}>{readiness.percent}% COMPLIANT</span>
        </div>
      </header>

      {/* Main Dual-Pane Layout */}
      <div className={styles.flowLayout}>
        {/* Controls List Pane */}
        <div className={styles.controlsPane}>
          <h3 className={styles.paneHeading}>Framework Security Controls</h3>
          <ul className={styles.controlList} role="listbox" aria-label="Security Controls">
            {controls.map((ctrl) => {
              const isSelected = ctrl.id === selectedControlId;

              return (
                <li
                  key={ctrl.id}
                  className={`${styles.controlCard} ${
                    isSelected ? styles.controlCardSelected : ""
                  }`}
                  onClick={() => setSelectedControlId(ctrl.id)}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedControlId(ctrl.id);
                    }
                  }}
                >
                  <div className={styles.controlCardTop}>
                    <span className={styles.controlCode}>{ctrl.controlCode}</span>
                    <span className={`${styles.statusBadge} ${getStatusClass(ctrl.testStatus)}`}>
                      {ctrl.testStatus.toUpperCase()}
                    </span>
                  </div>
                  <span className={styles.controlName}>{ctrl.name}</span>
                  <div className={styles.controlSubRow}>
                    <span className={styles.evidenceCount}>
                      📁 {ctrl.evidenceItems.length} evidence{" "}
                      {ctrl.evidenceItems.length === 1 ? "artifact" : "artifacts"}
                    </span>
                    <span className={styles.testDate}>Tested: {ctrl.lastTestedAt}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Evidence Inspection & Harvesting Pane */}
        {selectedControl && (
          <div className={styles.evidencePane} aria-label="Evidence Artifacts">
            <div className={styles.selectedHeader}>
              <div className={styles.selectedTitleGroup}>
                <span className={styles.selectedCode}>{selectedControl.controlCode}</span>
                <h3 className={styles.selectedName}>{selectedControl.name}</h3>
              </div>
              <span className={`${styles.statusBadge} ${getStatusClass(selectedControl.testStatus)}`}>
                {selectedControl.testStatus.toUpperCase()}
              </span>
            </div>
            <p className={styles.controlDesc}>{selectedControl.description}</p>

            <h4 className={styles.artifactsHeading}>Verified Evidence Artifacts</h4>
            {selectedControl.evidenceItems.length > 0 ? (
              <div className={styles.evidenceTableWrapper}>
                <table className={styles.evidenceTable}>
                  <thead>
                    <tr>
                      <th>Artifact Name</th>
                      <th>SHA-256 Checksum</th>
                      <th>Uploaded By</th>
                      <th>Expires In</th>
                      <th>Review State</th>
                      <th className={styles.actionCol}>Auditor Sign-Off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedControl.evidenceItems.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <div className={styles.fileCell}>
                            <span className={styles.fileName}>{ev.filename}</span>
                            <span className={styles.fileSize}>
                              {formatFileSize(ev.fileSizeBytes)}
                            </span>
                          </div>
                        </td>
                        <td className={styles.hashCell} title={ev.sha256Hash}>
                          {ev.sha256Hash.slice(0, 12)}…
                        </td>
                        <td className={styles.uploaderCell}>{ev.uploadedBy}</td>
                        <td>
                          <span
                            className={
                              ev.expiresInDays <= 15 ? styles.expiryDanger : styles.expirySafe
                            }
                          >
                            {ev.expiresInDays} days
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.reviewBadge} ${getReviewClass(ev.reviewState)}`}>
                            {ev.reviewState.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className={styles.actionCol}>
                          {ev.reviewState !== "approved" ? (
                            <button
                              type="button"
                              className={styles.approveBtn}
                              onClick={() => handleReviewAction(ev.id, "approved")}
                            >
                              Approve Artifact
                            </button>
                          ) : (
                            <span className={styles.approvedTag}>✓ Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyEvidence}>
                <span>⚠️ No evidence artifacts attached. Automatic test failed or pending.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
