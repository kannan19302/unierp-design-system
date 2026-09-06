import React, { useId, useState } from "react";
import styles from "./drug-allergy-interaction-matrix.module.css";

export type InteractionSeverity = "CONTRAINDICATED" | "MAJOR" | "MODERATE" | "MINOR";

export interface DrugAllergyInteractionItem {
  id: string; // "int_warf_asp_01"
  drugName: string; // "Warfarin Sodium 5mg"
  allergenOrInteractingDrug: string; // "Aspirin 81mg"
  severity: InteractionSeverity;
  clinicalEffect: string; // "Severe risk of gastrointestinal hemorrhage and prolonged prothrombin time"
  recommendation: string; // "Avoid concurrent therapy. Consider alternative antiplatelet or adjust INR monitoring."
  overrideReason?: string;
  isOverridden?: boolean;
}

export interface DrugAllergyInteractionMatrixProps {
  patientName: string;
  mrn: string;
  activeMedications: string[];
  documentedAllergies: string[];
  interactions: DrugAllergyInteractionItem[];
  onOverrideInteraction?: (interactionId: string, reason: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DrugAllergyInteractionMatrix: React.FC<DrugAllergyInteractionMatrixProps> = ({
  patientName,
  mrn,
  activeMedications,
  documentedAllergies,
  interactions: initialInteractions,
  onOverrideInteraction,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [interactions, setInteractions] = useState<DrugAllergyInteractionItem[]>(initialInteractions);
  const [overrideModalId, setOverrideModalId] = useState<string | null>(null);
  const [overrideReasonInput, setOverrideReasonInput] = useState<string>("");

  const contraindicatedCount = interactions.filter(
    (i) => i.severity === "CONTRAINDICATED" && !i.isOverridden
  ).length;
  const majorCount = interactions.filter((i) => i.severity === "MAJOR" && !i.isOverridden).length;

  const handleOpenOverride = (id: string) => {
    setOverrideModalId(id);
    setOverrideReasonInput("");
  };

  const handleConfirmOverride = (id: string) => {
    if (!overrideReasonInput.trim()) return;
    setInteractions((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, isOverridden: true, overrideReason: overrideReasonInput.trim() } : i
      )
    );
    onOverrideInteraction?.(id, overrideReasonInput.trim());
    setOverrideModalId(null);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.patientInfo}>
            <span className={styles.clinicalBadge}>CLINICAL DECISION SUPPORT &amp; PHARMACY SAFETY</span>
            <span className={styles.patientName}>{patientName}</span>
            <span className={styles.mrnText}>MRN: {mrn}</span>
          </div>

          <div className={styles.kpiPills}>
            {contraindicatedCount > 0 && (
              <span className={styles.kpiContraindicated}>
                {contraindicatedCount} Contraindicated
              </span>
            )}
            {majorCount > 0 && (
              <span className={styles.kpiMajor}>{majorCount} Major Warnings</span>
            )}
            {contraindicatedCount === 0 && majorCount === 0 && (
              <span className={styles.kpiSafe}>Safety Checks Passed</span>
            )}
          </div>
        </div>

        <h2 id={headingId} className={styles.title}>
          Drug-Drug &amp; Drug-Allergy Interaction Screening Matrix
        </h2>

        <div className={styles.contextStrip}>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Active Medications ({activeMedications.length}):</span>
            <span className={styles.contextValue}>{activeMedications.join(", ")}</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Documented Allergies ({documentedAllergies.length}):</span>
            <span className={`${styles.contextValue} ${styles.allergyText}`}>
              {documentedAllergies.length > 0 ? documentedAllergies.join(", ") : "NKDA (No Known Drug Allergies)"}
            </span>
          </div>
        </div>
      </header>

      {/* Interactions Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Drug interaction screening findings">
          <thead>
            <tr>
              <th scope="col">Severity</th>
              <th scope="col">Prescribed Agent</th>
              <th scope="col">Interacting Entity</th>
              <th scope="col">Clinical Significance</th>
              <th scope="col">Evidence Recommendation</th>
              <th scope="col">Safety Disposition</th>
            </tr>
          </thead>
          <tbody>
            {interactions.map((item) => {
              const isContra = item.severity === "CONTRAINDICATED";
              const isOverridden = item.isOverridden;

              return (
                <tr
                  key={item.id}
                  className={`${
                    isOverridden
                      ? styles.overriddenRow
                      : isContra
                      ? styles.contraRow
                      : item.severity === "MAJOR"
                      ? styles.majorRow
                      : ""
                  }`}
                >
                  <td>
                    <span
                      className={`${styles.severityBadge} ${
                        isContra
                          ? styles.sevContra
                          : item.severity === "MAJOR"
                          ? styles.sevMajor
                          : item.severity === "MODERATE"
                          ? styles.sevModerate
                          : styles.sevMinor
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className={styles.drugNameCell}>{item.drugName}</td>
                  <td className={styles.interactingCell}>{item.allergenOrInteractingDrug}</td>
                  <td className={styles.effectCell}>{item.clinicalEffect}</td>
                  <td className={styles.recCell}>{item.recommendation}</td>
                  <td>
                    {isOverridden ? (
                      <div className={styles.overriddenInfo}>
                        <span className={styles.overriddenTag}>Overridden</span>
                        <span className={styles.overriddenReason}>
                          Reason: {item.overrideReason}
                        </span>
                      </div>
                    ) : overrideModalId === item.id ? (
                      <div className={styles.overrideInputBox}>
                        <label htmlFor={`override-reason-${item.id}`} className={styles.srOnly}>
                          Mandatory clinical justification for overriding {item.severity} alert
                        </label>
                        <input
                          id={`override-reason-${item.id}`}
                          type="text"
                          className={styles.overrideInput}
                          placeholder="Clinical justification..."
                          value={overrideReasonInput}
                          onChange={(e) => setOverrideReasonInput(e.target.value)}
                        />
                        <div className={styles.overrideActions}>
                          <button
                            type="button"
                            className={styles.confirmBtn}
                            onClick={() => handleConfirmOverride(item.id)}
                            disabled={!overrideReasonInput.trim()}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => setOverrideModalId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.overrideBtn}
                        onClick={() => handleOpenOverride(item.id)}
                        aria-label={`Override ${item.severity} interaction alert for ${item.drugName}`}
                      >
                        Override Alert
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Screened against Medi-Span Clinical Database v2026.3. All overrides require mandatory physician rationale and are reported to Pharmacy &amp; Therapeutics Committee.
        </span>
      </footer>
    </section>
  );
};
