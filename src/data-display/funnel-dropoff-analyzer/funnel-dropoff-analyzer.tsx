import React, { useId, useState } from "react";
import styles from "./funnel-dropoff-analyzer.module.css";

export interface FunnelStep {
  id: string;
  stepNumber: number;
  name: string; // e.g. "Landing Page Visit"
  eventKey: string; // "page_view_home"
  count: number; // 125,400
  overallConversionPct: number; // 100% -> 42.1% -> 24.5%...
  stepConversionPct: number; // conversion from previous step
  dropoffCount: number;
  dropoffPct: number;
  medianTimeToConvert?: string; // "3m 42s"
}

export interface FunnelDropoffAnalyzerProps {
  funnelName?: string;
  timeRangeLabel?: string;
  steps: FunnelStep[];
  selectedStepId?: string;
  onStepSelect?: (stepId: string) => void;
  segments?: string[];
  activeSegment?: string;
  onSegmentChange?: (segment: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const FunnelDropoffAnalyzer: React.FC<FunnelDropoffAnalyzerProps> = ({
  funnelName = "Enterprise Customer Acquisition Funnel",
  timeRangeLabel = "Last 30 Days",
  steps,
  selectedStepId,
  onStepSelect,
  segments = ["All Traffic", "Organic Search", "Paid Social", "Direct Referral", "Partner Ads"],
  activeSegment = "All Traffic",
  onSegmentChange,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    selectedStepId || (steps.length > 0 ? steps[0]?.id : undefined)
  );

  const activeId = selectedStepId !== undefined ? selectedStepId : internalSelectedId;
  const activeStep = steps.find((s) => s.id === activeId);

  const handleStepClick = (id: string) => {
    setInternalSelectedId(id);
    onStepSelect?.(id);
  };

  const initialCount = steps.length > 0 && steps[0] ? steps[0].count : 1;
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : undefined;
  const finalCount = lastStep ? lastStep.count : 0;
  const overallEndToEndPct =
    initialCount > 0 ? ((finalCount / initialCount) * 100).toFixed(1) : "0.0";


  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header & Controls */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            📉
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.badge}>{timeRangeLabel}</span>
              <span className={styles.overallRate}>
                End-to-End Conversion: <strong>{overallEndToEndPct}%</strong>
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {funnelName}
            </h2>
          </div>
        </div>

        {/* Segment Filter */}
        {segments.length > 0 && (
          <div className={styles.segmentPicker}>
            <label htmlFor={`seg-${headingId}`} className={styles.segmentLabel}>
              Cohort Segment:
            </label>
            <select
              id={`seg-${headingId}`}
              value={activeSegment}
              onChange={(e) => onSegmentChange?.(e.target.value)}
              className={styles.segmentSelect}
            >
              {segments.map((seg) => (
                <option key={seg} value={seg}>
                  {seg}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Visual Funnel Step Bars */}
      <div className={styles.funnelFlow}>
        {steps.map((step, idx) => {
          const isSelected = step.id === activeId;
          const barWidthPct = Math.max(8, (step.count / initialCount) * 100);

          return (
            <div key={step.id} className={styles.stepWrapper}>
              <div
                className={`${styles.stepBarCard} ${isSelected ? styles.selectedCard : ""}`}
              >
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>#{step.stepNumber}</span>
                  <button
                    type="button"
                    className={styles.stepNameBtn}
                    onClick={() => handleStepClick(step.id)}
                  >
                    {step.name}
                  </button>
                  <span className={styles.stepCount}>
                    {new Intl.NumberFormat("en-US").format(step.count)} users
                  </span>
                </div>

                {/* Progress bar representing volume */}
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${barWidthPct}%` }}
                    aria-hidden="true"
                  />
                </div>

                <div className={styles.metricsRow}>
                  <span className={styles.overallPct}>
                    Overall: <strong>{step.overallConversionPct.toFixed(1)}%</strong>
                  </span>
                  {idx > 0 && (
                    <span className={styles.stepPct}>
                      Step-over-step: <strong>{step.stepConversionPct.toFixed(1)}%</strong>
                    </span>
                  )}
                  {step.medianTimeToConvert && (
                    <span className={styles.timeTag}>
                      ⏱️ {step.medianTimeToConvert}
                    </span>
                  )}
                </div>
              </div>

              {/* Dropoff connector between steps */}
              {idx < steps.length - 1 && (
                <div className={styles.connector}>
                  <span className={styles.dropoffBadge}>
                    ↓ -{new Intl.NumberFormat("en-US").format(step.dropoffCount)} (
                    {step.dropoffPct.toFixed(1)}% drop)
                  </span>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Active Step Diagnostic Inspector */}
      {activeStep && (
        <div className={styles.diagnosticPane}>
          <h3 className={styles.paneTitle}>Step Bottleneck Inspection</h3>
          <div className={styles.diagnosticGrid}>
            <div className={styles.diagCard}>
              <span className={styles.diagLabel}>Selected Step</span>
              <span className={styles.diagVal}>{activeStep.name}</span>
              <span className={styles.diagEvent}>Event: <code>{activeStep.eventKey}</code></span>
            </div>
            <div className={styles.diagCard}>
              <span className={styles.diagLabel}>Retained Users</span>
              <span className={styles.diagVal}>
                {new Intl.NumberFormat("en-US").format(activeStep.count)}
              </span>
            </div>
            <div className={styles.diagCard}>
              <span className={styles.diagLabel}>Dropped Users at this Stage</span>
              <span className={`${styles.diagVal} ${styles.dropHighlight}`}>
                {new Intl.NumberFormat("en-US").format(activeStep.dropoffCount)} ({activeStep.dropoffPct.toFixed(1)}%)
              </span>
            </div>
            <div className={styles.diagCard}>
              <span className={styles.diagLabel}>Median Step Duration</span>
              <span className={styles.diagVal}>
                {activeStep.medianTimeToConvert || "Immediate"}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
