import React, { useId, useState } from "react";
import styles from "./inpatient-acuity-scorecard.module.css";

export interface NewsVitalObservation {
  id: string; // "obs_resp_01"
  parameterName: string; // "Respiration Rate"
  valueString: string; // "24 breaths/min"
  score: number; // 0, 1, 2, or 3
  normalRange: string; // "12 - 20 bpm"
}

export type AcuityRiskLevel = "LOW" | "LOW_MEDIUM" | "MEDIUM" | "HIGH_CRITICAL";

export const defaultVitalObservations: NewsVitalObservation[] = [
  { id: "resp", parameterName: "Respiration Rate", valueString: "24 breaths/min", score: 2, normalRange: "12 - 20 bpm" },
  { id: "spo2", parameterName: "Oxygen Saturation (SpO2)", valueString: "91 %", score: 3, normalRange: ">= 96 %" },
  { id: "supp_o2", parameterName: "Supplemental Oxygen", valueString: "Mask (4 L/min)", score: 2, normalRange: "Room Air (No)" },
  { id: "sys_bp", parameterName: "Systolic Blood Pressure", valueString: "94 mmHg", score: 2, normalRange: "111 - 219 mmHg" },
  { id: "pulse", parameterName: "Heart / Pulse Rate", valueString: "118 bpm", score: 2, normalRange: "51 - 90 bpm" },
  { id: "consciousness", parameterName: "Consciousness Level (ACVPU)", valueString: "Alert", score: 0, normalRange: "Alert" },
  { id: "temp", parameterName: "Body Temperature", valueString: "38.8 °C", score: 1, normalRange: "36.1 - 38.0 °C" },
];

export interface InpatientAcuityScorecardProps {
  patientName?: string;
  mrn?: string;
  wardLocation?: string;
  vitalObservations?: NewsVitalObservation[];
  onAcknowledgeEscalation?: (totalScore: number, riskLevel: AcuityRiskLevel) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const InpatientAcuityScorecard: React.FC<InpatientAcuityScorecardProps> = ({
  patientName = "Arthur Pendelton",
  mrn = "MRN-104-9921",
  wardLocation = "ICU Stepdown Bed 04B",
  vitalObservations = defaultVitalObservations,
  onAcknowledgeEscalation,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [isEscalationAcknowledged, setIsEscalationAcknowledged] = useState<boolean>(false);

  const totalScore = vitalObservations.reduce((acc, obs) => acc + obs.score, 0);

  const getAcuityRiskLevel = (score: number): AcuityRiskLevel => {
    if (score >= 7) return "HIGH_CRITICAL";
    if (score >= 5) return "MEDIUM";
    if (score >= 1) return "LOW_MEDIUM";
    return "LOW";
  };

  const riskLevel = getAcuityRiskLevel(totalScore);

  const getRiskColorClass = (risk: AcuityRiskLevel) => {
    switch (risk) {
      case "HIGH_CRITICAL":
        return styles.riskCritical;
      case "MEDIUM":
        return styles.riskMedium;
      case "LOW_MEDIUM":
        return styles.riskLowMedium;
      default:
        return styles.riskLow;
    }
  };

  const getProtocolText = (risk: AcuityRiskLevel) => {
    switch (risk) {
      case "HIGH_CRITICAL":
        return "EMERGENCY: Immediate assessment by Critical Care / Medical Emergency Team (MET). Continuous monitoring.";
      case "MEDIUM":
        return "URGENT: Urgent review by ward physician within 30 minutes. Increase vital check frequency to 1 hour.";
      case "LOW_MEDIUM":
        return "ROUTINE: Inform registered nurse. Recheck observations in 4-6 hours.";
      default:
        return "NORMAL: Standard ward protocol monitoring (every 12 hours).";
    }
  };

  const handleAcknowledge = () => {
    setIsEscalationAcknowledged(true);
    onAcknowledgeEscalation?.(totalScore, riskLevel);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.patientBanner}>
          <div className={styles.nameGroup}>
            <span className={styles.ehrBadge}>INPATIENT CLINICAL ACUITY (NEWS2)</span>
            <span className={styles.patientName}>{patientName}</span>
            <span className={styles.mrnText}>{mrn}</span>
            <span className={styles.wardText}>{wardLocation}</span>
          </div>

          <div className={styles.scorePillGroup}>
            <div className={`${styles.totalScoreCard} ${getRiskColorClass(riskLevel)}`}>
              <span className={styles.scoreLabel}>NEWS2 Score</span>
              <span className={styles.scoreValue}>{totalScore}</span>
            </div>
          </div>
        </div>

        <div className={styles.titleRow}>
          <div>
            <h2 id={headingId} className={styles.title}>
              National Early Warning Scorecard &amp; Clinical Deterioration Protocol
            </h2>
            <div className={styles.protocolText}>
              <strong>Protocol:</strong> {getProtocolText(riskLevel)}
            </div>
          </div>

          {totalScore >= 5 && (
            <button
              type="button"
              className={styles.escalateBtn}
              onClick={handleAcknowledge}
              disabled={isEscalationAcknowledged}
              aria-label="Acknowledge clinical escalation protocol"
            >
              {isEscalationAcknowledged ? "MET Team Dispatched" : "Acknowledge Escalation"}
            </button>
          )}
        </div>
      </header>

      {/* Vitals Grid Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="NEWS2 vital sign observations">
          <thead>
            <tr>
              <th scope="col">Physiological Parameter</th>
              <th scope="col">Current Observation</th>
              <th scope="col">Standard Normal Range</th>
              <th scope="col">Sub-Score</th>
              <th scope="col">Acuity Weight</th>
            </tr>
          </thead>
          <tbody>
            {vitalObservations.map((obs) => {
              return (
                <tr key={obs.id} className={obs.score >= 3 ? styles.highScoreRow : ""}>
                  <td className={styles.paramName}>{obs.parameterName}</td>
                  <td className={`${styles.monoCell} ${styles.obsValue}`}>{obs.valueString}</td>
                  <td className={styles.monoCell}>{obs.normalRange}</td>
                  <td>
                    <span
                      className={`${styles.subScorePill} ${
                        obs.score === 3
                          ? styles.score3
                          : obs.score === 2
                          ? styles.score2
                          : obs.score === 1
                          ? styles.score1
                          : styles.score0
                      }`}
                    >
                      +{obs.score}
                    </span>
                  </td>
                  <td>
                    <span className={styles.weightDesc}>
                      {obs.score === 3
                        ? "Severe Deviation"
                        : obs.score === 2
                        ? "Moderate Deviation"
                        : obs.score === 1
                        ? "Mild Deviation"
                        : "Normal Baseline"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Royal College of Physicians NEWS2 standardized clinical scoring algorithm. Integrated with Inpatient EHR telemetry stream.
        </span>
      </footer>
    </section>
  );
};
