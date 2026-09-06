import React, { useId, useState } from "react";
import styles from "./canary-rollout-progress-visualizer.module.css";

export type CanaryStatus = "analyzing" | "paused" | "promoted" | "aborted";

export interface CanaryMetricComparison {
  name: string;
  unit: string;
  baselineValue: number;
  canaryValue: number;
  maxThreshold: number;
  status: "pass" | "warn" | "fail";
}

export interface CanaryRolloutProgressVisualizerProps {
  serviceName?: string;
  clusterNamespace?: string;
  stableVersion?: string;
  canaryVersion?: string;
  currentTrafficPercent?: number; // e.g. 25
  currentStep?: number; // 2
  totalSteps?: number; // 4
  stepDurationSeconds?: number;
  stepElapsedSeconds?: number;
  status?: CanaryStatus;
  metrics: CanaryMetricComparison[];
  onPromote?: () => void;
  onPause?: () => void;
  onAbort?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CanaryRolloutProgressVisualizer: React.FC<CanaryRolloutProgressVisualizerProps> = ({
  serviceName = "payments-orchestration-engine",
  clusterNamespace = "prod-us-east-1 / core-services",
  stableVersion = "v2.13.8",
  canaryVersion = "v2.14.0-canary.4",
  currentTrafficPercent = 25,
  currentStep = 2,
  totalSteps = 4,
  stepDurationSeconds = 900, // 15 mins
  stepElapsedSeconds = 480, // 8 mins
  status = "analyzing",
  metrics,
  onPromote,
  onPause,
  onAbort,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [currentStatus, setCurrentStatus] = useState<CanaryStatus>(status);

  const remainingSeconds = Math.max(stepDurationSeconds - stepElapsedSeconds, 0);
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeRemainingLabel = `${mins}m ${secs.toString().padStart(2, "0")}s`;

  const stablePercent = 100 - currentTrafficPercent;

  const handleAbort = () => {
    setCurrentStatus("aborted");
    onAbort?.();
  };

  const handlePromote = () => {
    setCurrentStatus("promoted");
    onPromote?.();
  };

  const getStatusBadge = (st: CanaryStatus) => {
    switch (st) {
      case "analyzing":
        return <span className={`${styles.statusBadge} ${styles.statusAnalyzing}`}>● ACTIVE CANARY ANALYSIS</span>;
      case "paused":
        return <span className={`${styles.statusBadge} ${styles.statusPaused}`}>⏸️ ROLLOUT PAUSED</span>;
      case "promoted":
        return <span className={`${styles.statusBadge} ${styles.statusPromoted}`}>✓ 100% PROMOTED</span>;
      case "aborted":
        return <span className={`${styles.statusBadge} ${styles.statusAborted}`}>🛑 ROLLED BACK (ABORTED)</span>;
    }
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
            🐤
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.clusterBadge}>{clusterNamespace}</span>
              <span className={styles.versionTag}>Canary: {canaryVersion}</span>
              <span className={styles.stableTag}>Stable: {stableVersion}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {serviceName}
            </h2>
          </div>
        </div>

        {/* Status and Actions */}
        <div className={styles.headerRight}>
          {getStatusBadge(currentStatus)}
          <div className={styles.actionGroup}>
            {currentStatus === "analyzing" && (
              <>
                <button
                  type="button"
                  className={styles.pauseBtn}
                  onClick={() => {
                    setCurrentStatus("paused");
                    onPause?.();
                  }}
                >
                  Pause
                </button>
                <button
                  type="button"
                  className={styles.promoteBtn}
                  onClick={handlePromote}
                >
                  Promote to 100%
                </button>
                <button
                  type="button"
                  className={styles.abortBtn}
                  onClick={handleAbort}
                >
                  Emergency Abort
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Traffic Distribution Bar */}
      <div className={styles.trafficSection}>
        <div className={styles.trafficHeader}>
          <span className={styles.trafficLabel}>
            Live Traffic Weighting: <strong>{stablePercent}% Stable</strong> vs{" "}
            <strong>{currentTrafficPercent}% Canary</strong>
          </span>
          <span className={styles.stepTimer}>
            Step {currentStep} of {totalSteps}: {timeRemainingLabel} until auto-step promotion
          </span>
        </div>

        <div
          className={styles.trafficTrack}
          role="progressbar"
          aria-valuenow={currentTrafficPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Canary traffic split percentage"
        >
          <div className={styles.stableFill} style={{ width: `${stablePercent}%` }}>
            <span className={styles.barInnerText}>Stable ({stablePercent}%)</span>
          </div>
          <div className={styles.canaryFill} style={{ width: `${currentTrafficPercent}%` }}>
            <span className={styles.barInnerText}>Canary ({currentTrafficPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Real-Time Comparative Telemetry Cards */}
      <div className={styles.metricsSection}>
        <h3 className={styles.metricsHeading}>Canary Telemetry Health Analysis</h3>
        <div className={styles.metricsGrid}>
          {metrics.map((m) => {
            const isPass = m.status === "pass";
            return (
              <div
                key={m.name}
                className={`${styles.metricCard} ${
                  isPass ? styles.metricPass : styles.metricWarn
                }`}
              >
                <div className={styles.metricHeader}>
                  <h4 className={styles.metricName}>{m.name}</h4>
                  <span
                    className={`${styles.metricStatusPill} ${
                      isPass ? styles.pillPass : styles.pillFail
                    }`}
                  >
                    {m.status.toUpperCase()}
                  </span>
                </div>

                <div className={styles.metricValuesRow}>
                  <div className={styles.valCol}>
                    <span className={styles.valLabel}>Stable Baseline:</span>
                    <span className={styles.valNum}>
                      {m.baselineValue} {m.unit}
                    </span>
                  </div>

                  <div className={styles.valDivider} aria-hidden="true">
                    vs
                  </div>

                  <div className={styles.valCol}>
                    <span className={styles.valLabel}>Canary Deployment:</span>
                    <span
                      className={`${styles.valNum} ${
                        isPass ? styles.textSuccess : styles.textDanger
                      }`}
                    >
                      {m.canaryValue} {m.unit}
                    </span>
                  </div>
                </div>

                <div className={styles.thresholdInfo}>
                  <span>Abort Threshold: &gt; {m.maxThreshold} {m.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
