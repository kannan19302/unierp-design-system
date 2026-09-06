import React from "react";
import styles from "./master-detail-split-navigator.module.css";

export type SplitRatio = "30/70" | "50/50" | "70/30" | "100/0" | "0/100";

export interface MasterDetailSplitNavigatorProps {
  currentIndex: number;
  totalCount: number;
  onNavigate: (index: number) => void;
  splitRatio?: SplitRatio;
  onSplitRatioChange?: (ratio: SplitRatio) => void;
  reviewedCount?: number;
  statusLabel?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

const RATIO_OPTIONS: { ratio: SplitRatio; label: string }[] = [
  { ratio: "30/70", label: "30 : 70" },
  { ratio: "50/50", label: "50 : 50" },
  { ratio: "70/30", label: "70 : 30" },
  { ratio: "0/100", label: "Detail" },
];

export const MasterDetailSplitNavigator: React.FC<MasterDetailSplitNavigatorProps> = ({
  currentIndex,
  totalCount,
  onNavigate,
  splitRatio = "50/50",
  onSplitRatioChange,
  reviewedCount,
  statusLabel,
  density = "standard",
  className = "",
  testId = "master-detail-split-navigator",
}) => {
  const hasPrev = currentIndex > 1;
  const hasNext = currentIndex < totalCount;

  const handlePrev = () => {
    if (hasPrev) onNavigate(currentIndex - 1);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(currentIndex + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= totalCount) {
      onNavigate(val);
    }
  };

  const progressPct = totalCount > 0
    ? Math.round(((reviewedCount ?? currentIndex) / totalCount) * 100)
    : 0;

  return (
    <nav
      className={`${styles.navigatorBar ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label="Master-Detail Split Navigator"
    >
      <div className={styles.leftGroup ?? ""}>
        <button
          type="button"
          className={styles.navBtn ?? ""}
          onClick={handlePrev}
          disabled={!hasPrev}
          aria-label="Previous record (J)"
        >
          <span>◀ Prev</span>
          <kbd className={styles.kbd ?? ""}>J</kbd>
        </button>

        <div className={styles.recordIndicator ?? ""}>
          <span>Record</span>
          <input
            type="number"
            className={styles.indexInput ?? ""}
            value={currentIndex}
            min={1}
            max={totalCount}
            onChange={handleInputChange}
            aria-label="Current record number"
          />
          <span>of {totalCount}</span>
        </div>

        <button
          type="button"
          className={styles.navBtn ?? ""}
          onClick={handleNext}
          disabled={!hasNext}
          aria-label="Next record (K)"
        >
          <span>Next ▶</span>
          <kbd className={styles.kbd ?? ""}>K</kbd>
        </button>

        <div
          className={styles.progressBar ?? ""}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${progressPct}%`}
        >
          <div
            className={styles.progressFill ?? ""}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {statusLabel && (
          <span style={{ fontSize: "var(--text-2xs, 0.6875rem)", color: "var(--color-text-secondary, #64748b)" }}>
            {statusLabel}
          </span>
        )}
      </div>

      {onSplitRatioChange && (
        <div className={styles.rightGroup ?? ""}>
          <div className={styles.ratioGroup ?? ""} role="group" aria-label="Split Screen Ratio">
            {RATIO_OPTIONS.map((opt) => {
              const isActive = splitRatio === opt.ratio;
              return (
                <button
                  key={opt.ratio}
                  type="button"
                  className={`${styles.ratioBtn ?? ""} ${isActive ? (styles.ratioActive ?? "") : ""}`}
                  onClick={() => onSplitRatioChange(opt.ratio)}
                  aria-pressed={isActive}
                  aria-label={`Split ratio ${opt.label}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
