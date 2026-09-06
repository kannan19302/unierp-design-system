import React, { useState, useId, useMemo } from "react";
import styles from "./assessment-rubric-matrix.module.css";

export interface RubricLevel {
  id: string;
  points: number;
  label: string;
  description: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description?: string;
  weightMultiplier?: number;
  levels: RubricLevel[];
}

export interface AssessmentRubricMatrixProps {
  /** Assessment title (e.g. "Senior Engineering Architecture Evaluation") */
  title: string;
  /** Subject / candidate name */
  subjectName?: string;
  /** Rubric criteria list */
  criteria: RubricCriterion[];
  /** Initial scored level IDs keyed by criterion ID */
  initialSelections?: Record<string, string>;
  /** Callback fired when scores change */
  onScoreChange?: (scores: {
    totalPoints: number;
    maxPoints: number;
    percentage: number;
    selections: Record<string, string>;
  }) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_CRITERIA: RubricCriterion[] = [
  {
    id: "arch",
    title: "System Architecture & Domain Boundaries",
    description: "Evaluates clean separation of concerns, DDD layering, and coupling",
    levels: [
      { id: "arch-1", points: 1, label: "Novice", description: "Monolithic coupling, leaks infrastructure into domain" },
      { id: "arch-3", points: 3, label: "Competent", description: "Standard layered structure, some cross-domain bleed" },
      { id: "arch-4", points: 4, label: "Proficient", description: "Strict modular boundaries, clean repository interfaces" },
      { id: "arch-5", points: 5, label: "Exemplary", description: "Immaculate hex/onion architecture, zero unnecessary deps" },
    ],
  },
  {
    id: "sec",
    title: "Zero-Trust Security & Tenancy Isolation",
    description: "Evaluates tenant data partition, encryption, and RBAC contracts",
    levels: [
      { id: "sec-1", points: 1, label: "Novice", description: "Missing authorization guards or un-scoped queries" },
      { id: "sec-3", points: 3, label: "Competent", description: "Basic JWT inspection with manual tenant ID filters" },
      { id: "sec-4", points: 4, label: "Proficient", description: "Mandatory RBAC guards with field-level encryption" },
      { id: "sec-5", points: 5, label: "Exemplary", description: "Formal RLS enforcement, automated cross-tenant leak tests" },
    ],
  },
  {
    id: "a11y",
    title: "Accessibility & Design Token Discipline",
    description: "Evaluates WCAG 2.2 AA conformance and DL 2.0 token governance",
    levels: [
      { id: "a11y-1", points: 1, label: "Novice", description: "Hardcoded colors, missing labels and focus indicators" },
      { id: "a11y-3", points: 3, label: "Competent", description: "Uses design tokens mostly, minor keyboard trapping gaps" },
      { id: "a11y-4", points: 4, label: "Proficient", description: "100% token compliant, full ARIA roles & keyboard nav" },
      { id: "a11y-5", points: 5, label: "Exemplary", description: "Zero axe violations, 4-tier density awareness, screen reader verified" },
    ],
  },
];

export const AssessmentRubricMatrix: React.FC<AssessmentRubricMatrixProps> = ({
  title,
  subjectName = "Candidate Evaluation",
  criteria = DEFAULT_CRITERIA,
  initialSelections = {},
  onScoreChange,
  readOnly = false,
  density = "compact",
  className,
}) => {
  const rubricId = useId();
  const [selections, setSelections] = useState<Record<string, string>>(initialSelections);

  // Compute total points & max possible
  const { totalPoints, maxPoints, percentage } = useMemo(() => {
    let earned = 0;
    let max = 0;

    criteria.forEach((crit) => {
      const highestLevelPoints = Math.max(...crit.levels.map((l) => l.points), 0);
      const weight = crit.weightMultiplier ?? 1;
      max += highestLevelPoints * weight;

      const selectedLevelId = selections[crit.id];
      if (selectedLevelId) {
        const found = crit.levels.find((l) => l.id === selectedLevelId);
        if (found) {
          earned += found.points * weight;
        }
      }
    });

    const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
    return { totalPoints: earned, maxPoints: max, percentage: pct };
  }, [criteria, selections]);

  const handleLevelClick = (criterionId: string, levelId: string) => {
    if (readOnly) return;
    const nextSelections = { ...selections, [criterionId]: levelId };
    setSelections(nextSelections);

    let earned = 0;
    let max = 0;
    criteria.forEach((crit) => {
      const highest = Math.max(...crit.levels.map((l) => l.points), 0);
      const weight = crit.weightMultiplier ?? 1;
      max += highest * weight;

      const selId = nextSelections[crit.id];
      if (selId) {
        const found = crit.levels.find((l) => l.id === selId);
        if (found) earned += found.points * weight;
      }
    });
    const pct = max > 0 ? Math.round((earned / max) * 100) : 0;

    onScoreChange?.({
      totalPoints: earned,
      maxPoints: max,
      percentage: pct,
      selections: nextSelections,
    });
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${rubricId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.rubricBadge}>RUBRIC</span>
          <div className={styles.titleTextWrapper}>
            <h3 id={`${rubricId}-title`} className={styles.title}>
              {title}
            </h3>
            <span className={styles.subject}>{subjectName}</span>
          </div>
        </div>

        {/* Score Telemetry Pill */}
        <div className={styles.scorePill}>
          <span className={styles.scoreNumber}>
            {totalPoints} / {maxPoints}
          </span>
          <span className={styles.scorePercentage}>({percentage}%)</span>
        </div>
      </div>

      {/* Criteria Breakdown Rows */}
      <div className={styles.matrixList} role="region" aria-label="Evaluation criteria list">
        {criteria.map((crit) => {
          const selectedLevelId = selections[crit.id];
          const selectedLevel = crit.levels.find((l) => l.id === selectedLevelId);

          return (
            <div key={crit.id} className={styles.criterionCard}>
              {/* Criterion Meta */}
              <div className={styles.criterionHeader}>
                <div className={styles.critNameBlock}>
                  <h4 className={styles.critTitle}>{crit.title}</h4>
                  {crit.description && (
                    <p className={styles.critDescription}>{crit.description}</p>
                  )}
                </div>
                <div className={styles.critScoreBadge}>
                  {selectedLevel ? (
                    <span className={styles.earnedPoints}>
                      {selectedLevel.points * (crit.weightMultiplier ?? 1)} pts
                    </span>
                  ) : (
                    <span className={styles.unscoredText}>Not Scored</span>
                  )}
                </div>
              </div>

              {/* Performance Level Cards Grid */}
              <div
                className={styles.levelGrid}
                role="radiogroup"
                aria-label={`Scoring levels for ${crit.title}`}
              >
                {crit.levels.map((level) => {
                  const isSelected = level.id === selectedLevelId;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={readOnly}
                      className={`${styles.levelCard} ${
                        isSelected ? styles.levelCardSelected : ""
                      }`}
                      onClick={() => handleLevelClick(crit.id, level.id)}
                    >
                      <div className={styles.levelHeader}>
                        <span className={styles.levelLabel}>{level.label}</span>
                        <span className={styles.levelPoints}>{level.points} pts</span>
                      </div>
                      <p className={styles.levelDesc}>{level.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
