import React, { useId, useState } from "react";
import styles from "./clinical-decision-support-alert.module.css";

export type CdsSeverity = "critical" | "warning" | "info";

export interface CdsPatientInfo {
  name: string;
  mrn: string;
  age: number;
  gender: string;
  egfr?: number;
  allergies?: string[];
}

export interface CdsAlternativeRecommendation {
  id: string;
  title: string;
  description: string;
  suggestedDose?: string;
}

export interface ClinicalDecisionSupportAlertProps {
  alertId: string;
  severity: CdsSeverity;
  title: string;
  patient: CdsPatientInfo;
  triggeringOrder: string;
  clinicalExplanation: string;
  evidenceGrade?: string; // "Grade 1A (Strong Evidence)"
  recommendations?: CdsAlternativeRecommendation[];
  standardOverrideReasons?: string[];
  onAcceptRecommendation?: (recommendationId: string) => void;
  onOverrideAlert?: (reason: string, rationaleNotes?: string) => void;
  onCancelOrder?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ClinicalDecisionSupportAlert: React.FC<ClinicalDecisionSupportAlertProps> = ({
  alertId,
  severity,
  title,
  patient,
  triggeringOrder,
  clinicalExplanation,
  evidenceGrade = "Grade 1A (Strong Evidence)",
  recommendations = [],
  standardOverrideReasons = [
    "Benefit outweighs risk; intensive clinical monitoring active",
    "Specialist consult (Cardiology/Pharmacology) obtained and approved",
    "Dose modified specifically to account for interaction",
    "Prior tolerance demonstrated in inpatient record",
  ],
  onAcceptRecommendation,
  onOverrideAlert,
  onCancelOrder,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [overrideMode, setOverrideMode] = useState(false);
  const [selectedReason, setSelectedReason] = useState(standardOverrideReasons[0] ?? "");
  const [overrideNotes, setOverrideNotes] = useState("");

  const getSeverityBadge = () => {
    switch (severity) {
      case "critical":
        return {
          label: "CRITICAL SAFETY CONTRAINDICATION",
          className: styles.badgeCritical,
          icon: "🛑",
        };
      case "warning":
        return {
          label: "HIGH RISK CLINICAL ADVISORY",
          className: styles.badgeWarning,
          icon: "⚠️",
        };
      default:
        return {
          label: "CLINICAL GUIDELINE RECOMMENDATION",
          className: styles.badgeInfo,
          icon: "ℹ️",
        };
    }
  };

  const badgeInfo = getSeverityBadge();

  const handleConfirmOverride = () => {
    onOverrideAlert?.(selectedReason, overrideNotes.trim() || undefined);
  };

  return (
    <section
      className={`${styles.container} ${styles[`severity_${severity}`]} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
      role="alert"
    >
      {/* Alert Header Banner */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.badgeRow}>
            <span className={`${styles.severityBadge} ${badgeInfo.className}`}>
              <span aria-hidden="true">{badgeInfo.icon}</span> {badgeInfo.label}
            </span>
            <span className={styles.alertIdTag}>CDS BPA #{alertId}</span>
            <span className={styles.evidenceTag}>{evidenceGrade}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
        </div>

        {/* Patient Clinical Context Card */}
        <div className={styles.patientContext}>
          <div className={styles.patientItem}>
            <span className={styles.patientLabel}>Patient:</span>
            <strong className={styles.patientVal}>
              {patient.name} ({patient.age}y {patient.gender})
            </strong>
          </div>
          <div className={styles.patientItem}>
            <span className={styles.patientLabel}>MRN:</span>
            <span className={styles.patientValMono}>{patient.mrn}</span>
          </div>
          {patient.egfr !== undefined && (
            <div className={styles.patientItem}>
              <span className={styles.patientLabel}>eGFR:</span>
              <span className={patient.egfr < 30 ? styles.alertVal : styles.patientVal}>
                {patient.egfr} mL/min/1.73m²
              </span>
            </div>
          )}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className={styles.patientItem}>
              <span className={styles.patientLabel}>Documented Allergies:</span>
              <span className={styles.allergyVal}>{patient.allergies.join(", ")}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Alert Body */}
      <div className={styles.body}>
        {/* Triggering Order */}
        <div className={styles.triggerCard}>
          <span className={styles.triggerLabel}>Triggering Prescription / Order:</span>
          <p className={styles.triggerOrderText}>{triggeringOrder}</p>
        </div>

        {/* Clinical Rationale & Hazard Statement */}
        <div className={styles.explanationCard}>
          <h3 className={styles.sectionHeader}>Clinical Hazard & Interaction Details</h3>
          <p className={styles.explanationText}>{clinicalExplanation}</p>
        </div>

        {/* Action Options: Recommendations vs Override */}
        {!overrideMode ? (
          <div className={styles.actionSection}>
            {recommendations.length > 0 && (
              <div className={styles.recommendationsList}>
                <h3 className={styles.sectionHeader}>Evidence-Based Alternatives</h3>
                <div className={styles.recommendationCards}>
                  {recommendations.map((rec) => (
                    <div key={rec.id} className={styles.recCard}>
                      <div className={styles.recInfo}>
                        <h4 className={styles.recTitle}>{rec.title}</h4>
                        <p className={styles.recDesc}>{rec.description}</p>
                        {rec.suggestedDose && (
                          <span className={styles.recDose}>Suggested: {rec.suggestedDose}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={styles.acceptRecBtn}
                        onClick={() => onAcceptRecommendation?.(rec.id)}
                      >
                        Accept & Replace Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.buttonRow}>
              {onCancelOrder && (
                <button
                  type="button"
                  className={styles.cancelOrderBtn}
                  onClick={onCancelOrder}
                >
                  Cancel Order
                </button>
              )}
              <button
                type="button"
                className={styles.openOverrideBtn}
                onClick={() => setOverrideMode(true)}
              >
                Document Clinical Override &hellip;
              </button>
            </div>
          </div>
        ) : (
          /* Override Documentation Form */
          <div className={styles.overrideSection}>
            <div className={styles.overrideHeader}>
              <h3 className={styles.sectionHeader}>Document Clinical Override Rationale</h3>
              <button
                type="button"
                className={styles.cancelOverrideBtn}
                onClick={() => setOverrideMode(false)}
              >
                Back to Alternatives
              </button>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cds-override-reason" className={styles.inputLabel}>
                Select Justification (Required for Audit Trail)
              </label>
              <select
                id="cds-override-reason"
                className={styles.select}
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                {standardOverrideReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cds-override-notes" className={styles.inputLabel}>
                Specific Clinical Rationale & Monitoring Plan (Optional)
              </label>
              <textarea
                id="cds-override-notes"
                className={styles.textarea}
                rows={3}
                placeholder="e.g. Discussed with attending physician; patient scheduled for daily lab draws..."
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
              />
            </div>

            <div className={styles.overrideActionRow}>
              <button
                type="button"
                className={styles.confirmOverrideBtn}
                onClick={handleConfirmOverride}
              >
                Acknowledge Risk & Proceed with Order
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
