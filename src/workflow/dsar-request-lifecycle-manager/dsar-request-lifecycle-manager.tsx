import React, { useId, useState } from "react";
import styles from "./dsar-request-lifecycle-manager.module.css";

export type DsarStage =
  | "IDENTITY_VERIFICATION"
  | "SYSTEM_DATA_DISCOVERY"
  | "LEGAL_REDACTION"
  | "PACKAGE_COMPILATION"
  | "DELIVERED_AND_CLOSED";

export type DsarRequestType =
  | "RIGHT_TO_ACCESS"
  | "RIGHT_TO_ERASURE"
  | "RIGHT_TO_RECTIFICATION"
  | "RESTRICT_PROCESSING";

export interface DsarSystemDataNode {
  systemName: string; // "Salesforce CRM", "Stripe Billing", "PostgreSQL Core"
  recordsFound: number;
  piiCategories: string[]; // ["Email", "IP Address", "Billing Address"]
  status: "SCANNED" | "ERASURE_PENDING" | "HOLD";
}

export interface DsarCaseDetails {
  ticketId: string; // "DSAR-2026-EU-4401"
  subjectEmail: string; // "clara.dupont@enterprise.fr"
  jurisdiction: "GDPR (EU 2016/679)" | "CCPA/CPRA (California)" | "LGPD (Brazil)";
  requestType: DsarRequestType;
  submittedDate: string; // "2026-08-20"
  daysRemainingSla: number; // 14
  currentStage: DsarStage;
  discoveredSystems: DsarSystemDataNode[];
}

export interface DsarRequestLifecycleManagerProps {
  caseDetails: DsarCaseDetails;
  onAdvanceStage?: (nextStage: DsarStage) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const STAGES: { stage: DsarStage; label: string }[] = [
  { stage: "IDENTITY_VERIFICATION", label: "1. Identity Proofing" },
  { stage: "SYSTEM_DATA_DISCOVERY", label: "2. Data Discovery" },
  { stage: "LEGAL_REDACTION", label: "3. PII Redaction" },
  { stage: "PACKAGE_COMPILATION", label: "4. Archive Pack" },
  { stage: "DELIVERED_AND_CLOSED", label: "5. Closed & Audited" },
];

export const DsarRequestLifecycleManager: React.FC<DsarRequestLifecycleManagerProps> = ({
  caseDetails,
  onAdvanceStage,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [activeStage, setActiveStage] = useState<DsarStage>(caseDetails.currentStage);

  const stageIndex = STAGES.findIndex((s) => s.stage === activeStage);

  const handleAdvance = () => {
    if (stageIndex >= 0 && stageIndex < STAGES.length - 1) {
      const next = STAGES[stageIndex + 1]?.stage;
      if (next) {
        setActiveStage(next);
        onAdvanceStage?.(next);
      }
    }
  };


  const totalRecords = caseDetails.discoveredSystems.reduce(
    (sum, s) => sum + s.recordsFound,
    0
  );

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.privacyBadge}>PRIVACY RIGHTS &amp; COMPLIANCE</span>
          <span
            className={`${styles.slaPill} ${
              caseDetails.daysRemainingSla <= 5
                ? styles.slaUrgent
                : caseDetails.daysRemainingSla <= 15
                ? styles.slaWarning
                : styles.slaOk
            }`}
          >
            {caseDetails.daysRemainingSla} DAYS REMAINING (30-DAY STATUTORY SLA)
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            GDPR &amp; CCPA Data Subject Access Request (DSAR) Lifecycle
          </h2>
          <span className={styles.ticketMeta}>
            Case: <strong>{caseDetails.ticketId}</strong> | {caseDetails.jurisdiction}
          </span>
        </div>
      </header>

      {/* 5-Stage Stepper */}
      <nav className={styles.stepperNav} aria-label="DSAR compliance lifecycle stages">
        <ol className={styles.stepperList}>
          {STAGES.map((step, idx) => {
            const isCompleted = idx < stageIndex;
            const isCurrent = idx === stageIndex;
            return (
              <li
                key={step.stage}
                className={`${styles.stepItem} ${
                  isCompleted ? styles.stepCompleted : isCurrent ? styles.stepCurrent : styles.stepPending
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className={styles.stepDot}>
                  {isCompleted ? "✓" : idx + 1}
                </span>
                <span className={styles.stepLabel}>{step.label}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Case Overview KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Data Subject</span>
          <span className={styles.kpiValueEmail}>{caseDetails.subjectEmail}</span>
          <span className={styles.kpiSub}>Submitted {caseDetails.submittedDate}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Request Category</span>
          <span className={styles.kpiValue}>{caseDetails.requestType.replace(/_/g, " ")}</span>
          <span className={styles.kpiSub}>Statutory legal mandate</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Discovered PII Entities</span>
          <span className={styles.kpiValue}>{totalRecords} records</span>
          <span className={styles.kpiSub}>Across {caseDetails.discoveredSystems.length} cloud systems</span>
        </div>
      </div>

      {/* Discovered Data Systems */}
      <div className={styles.systemsSection}>
        <h3 className={styles.sectionHeading}>Automated PII Discovery &amp; Crawl Inventory</h3>
        <div className={styles.systemsList} role="list" aria-label="Discovered systems with PII records">
          {caseDetails.discoveredSystems.map((sys) => (
            <div key={sys.systemName} className={styles.systemCard} role="listitem">
              <div className={styles.systemHeader}>
                <span className={styles.systemName}>{sys.systemName}</span>
                <span className={styles.statusBadge}>{sys.status}</span>
              </div>
              <div className={styles.systemMeta}>
                <span className={styles.recordCount}>{sys.recordsFound} items located</span>
                <div className={styles.piiTags}>
                  {sys.piiCategories.map((pii) => (
                    <span key={pii} className={styles.piiPill}>
                      {pii}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerNotice}>
          <span>
            {activeStage === "DELIVERED_AND_CLOSED"
              ? "All personal data subject obligations fulfilled. Cryptographic receipt logged."
              : `Current active phase: ${STAGES[stageIndex]?.label ?? "In Progress"}. Advance to next audit milestone.`}

          </span>
        </div>
        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.advanceBtn}
            onClick={handleAdvance}
            disabled={activeStage === "DELIVERED_AND_CLOSED"}
            aria-label="Advance DSAR to next lifecycle milestone"
          >
            {activeStage === "DELIVERED_AND_CLOSED" ? "Lifecycle Complete" : "Advance Next Stage →"}
          </button>
        </div>
      </footer>
    </section>
  );
};
