import React, { useId, useState } from "react";
import styles from "./clinical-trial-cohort-randomizer.module.css";

export type BlindingMode = "DOUBLE_BLIND" | "SINGLE_BLIND" | "OPEN_LABEL";

export interface ClinicalStudyProtocol {
  protocolId: string; // "ONC-2026-PHASE-3"
  studyTitle: string; // "Phase III Evaluation of CDK4/6 Inhibitor in Advanced Solid Tumors"
  blinding: BlindingMode;
  targetEnrollment: number; // 400
  randomizationRatio: string; // "1:1"
  activeArms: {
    armId: string;
    armName: string; // "Arm A - Investigational Drug (75mg QD)" or "Masked Kit Group A"
    enrolledCount: number;
  }[];
}

export interface ClinicalTrialCohortRandomizerProps {
  protocol: ClinicalStudyProtocol;
  onRandomizeSubject?: (result: {
    subjectId: string;
    biomarkerStatus: string;
    assignedKitBarcode: string;
    assignedArmId: string;
    randomizationToken: string;
  }) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ClinicalTrialCohortRandomizer: React.FC<ClinicalTrialCohortRandomizerProps> = ({
  protocol,
  onRandomizeSubject,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const subjectInputId = useId();
  const ageTierSelectId = useId();
  const biomarkerSelectId = useId();
  const siteSelectId = useId();

  const [subjectId, setSubjectId] = useState<string>("");
  const [ageTier, setAgeTier] = useState<string>("AGE_18_55");
  const [biomarkerStatus, setBiomarkerStatus] = useState<string>("HER2_POSITIVE");
  const [siteLocation, setSiteLocation] = useState<string>("SITE_101_MAYO");
  const [lastRandomizedResult, setLastRandomizedResult] = useState<{
    subjectId: string;
    armName: string;
    kitBarcode: string;
    token: string;
  } | null>(null);

  const totalEnrolled = protocol.activeArms.reduce((sum, a) => sum + a.enrolledCount, 0);

  const handleRandomize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId.trim()) return;

    // Simulate balanced block assignment
    const fallbackArm = protocol.activeArms[0] ?? {
      armId: "ARM-A",
      armName: "Masked Arm",
      enrolledCount: 0,
    };
    const chosenIndex = Math.floor(Math.random() * (protocol.activeArms.length || 1));
    const assignedArm = protocol.activeArms[chosenIndex] ?? fallbackArm;
    const kitBarcode = `IMP-KIT-${Math.floor(100000 + Math.random() * 900000)}`;
    const token = `RND-2026-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;


    onRandomizeSubject?.({
      subjectId: subjectId.trim(),
      biomarkerStatus,
      assignedKitBarcode: kitBarcode,
      assignedArmId: assignedArm.armId,
      randomizationToken: token,
    });

    setLastRandomizedResult({
      subjectId: subjectId.trim(),
      armName: protocol.blinding === "DOUBLE_BLIND" ? "Masked Treatment Group" : assignedArm.armName,
      kitBarcode,
      token,
    });

    setSubjectId("");
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.edcBadge}>LIFE SCIENCES &amp; CLINICAL EDC</span>
          <span className={styles.blindingPill}>
            {protocol.blinding.replace(/_/g, " ")} ({protocol.randomizationRatio})
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Clinical Trial Double-Blind Cohort Randomization Engine
          </h2>
          <span className={styles.protocolCode}>
            Protocol: <strong>{protocol.protocolId}</strong>
          </span>
        </div>
      </header>

      {/* Protocol Metrics */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Target Enrollment</span>
          <span className={styles.kpiValue}>{protocol.targetEnrollment}</span>
          <span className={styles.kpiSub}>Approved study protocol</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Randomized</span>
          <span className={styles.kpiValue}>{totalEnrolled}</span>
          <span className={styles.kpiSub}>
            {Math.round((totalEnrolled / protocol.targetEnrollment) * 100)}% of quota
          </span>
        </div>
        {protocol.activeArms.map((arm) => (
          <div key={arm.armId} className={styles.kpiCard}>
            <span className={styles.kpiLabel}>
              {protocol.blinding === "DOUBLE_BLIND" ? `Cohort Group #${arm.armId}` : arm.armName}
            </span>
            <span className={styles.kpiValue}>{arm.enrolledCount}</span>
            <span className={styles.kpiSub}>Subjects enrolled</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleRandomize} className={styles.randomizationForm}>
        <h3 className={styles.sectionHeading}>Subject Stratification &amp; Enrollment Intake</h3>
        <div className={styles.inputsGrid}>
          <div className={styles.formGroup}>
            <label htmlFor={subjectInputId} className={styles.inputLabel}>
              Screened Subject ID:
            </label>
            <input
              id={subjectInputId}
              type="text"
              className={styles.input}
              placeholder="e.g., SUBJ-90412"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={ageTierSelectId} className={styles.inputLabel}>
              Age Stratification Bracket:
            </label>
            <select
              id={ageTierSelectId}
              className={styles.select}
              value={ageTier}
              onChange={(e) => setAgeTier(e.target.value)}
            >
              <option value="AGE_18_55">18 - 55 Years</option>
              <option value="AGE_56_70">56 - 70 Years</option>
              <option value="AGE_71_PLUS">71+ Years</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={biomarkerSelectId} className={styles.inputLabel}>
              Baseline Biomarker Factor:
            </label>
            <select
              id={biomarkerSelectId}
              className={styles.select}
              value={biomarkerSelectId}
              onChange={(e) => setBiomarkerStatus(e.target.value)}
            >
              <option value="HER2_POSITIVE">HER2 Positive (3+ IHC)</option>
              <option value="HER2_NEGATIVE">HER2 Negative (0-1+ IHC)</option>
              <option value="UNKNOWN_WILDTYPE">Wildtype Biomarker</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={siteSelectId} className={styles.inputLabel}>
              Investigational Site:
            </label>
            <select
              id={siteSelectId}
              className={styles.select}
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
            >
              <option value="SITE_101_MAYO">Site 101 - Mayo Clinic Rochester</option>
              <option value="SITE_102_MSK">Site 102 - Memorial Sloan Kettering</option>
              <option value="SITE_103_MDAND">Site 103 - MD Anderson Cancer Center</option>
            </select>
          </div>
        </div>

        <div className={styles.submitRow}>
          <button
            type="submit"
            className={styles.randomizeBtn}
            disabled={!subjectId.trim()}
            aria-label="Randomize subject and allocate masked investigational kit"
          >
            Randomize Subject &amp; Allocate Kit
          </button>
        </div>
      </form>

      {/* Dispensation Certificate */}
      {lastRandomizedResult && (
        <div className={styles.dispensationBanner} role="region" aria-label="Randomization dispensation confirmation">
          <div className={styles.dispensationHeader}>
            <span className={styles.dispensationBadge}>DISPENSATION CONFIRMATION</span>
            <span className={styles.tokenCode}>Token: {lastRandomizedResult.token}</span>
          </div>
          <div className={styles.dispensationGrid}>
            <div className={styles.dispItem}>
              <span className={styles.dispLabel}>Randomized Subject:</span>
              <span className={styles.dispValue}>{lastRandomizedResult.subjectId}</span>
            </div>
            <div className={styles.dispItem}>
              <span className={styles.dispLabel}>Assigned Cohort:</span>
              <span className={styles.dispValue}>{lastRandomizedResult.armName}</span>
            </div>
            <div className={styles.dispItem}>
              <span className={styles.dispLabel}>Allocated Kit Barcode:</span>
              <code className={styles.barcodeValue}>{lastRandomizedResult.kitBarcode}</code>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
