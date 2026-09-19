"use client";

import {
  forwardRef,
  type CSSProperties,
} from "react";
import styles from "./bpmn-simulation-bar.module.css";

export type SimulationStatus = "idle" | "running" | "paused" | "completed";
export type SlaStatus = "compliant" | "breached" | "warning";
export type SimulationSpeed = 1 | 2 | 5 | 10;

export interface SimulationStep {
  id: string;
  name: string;
  duration: string;
  type: "auto" | "human";
}

export interface BpmnSimulationBarProps {
  /** Simulation playback state */
  status: SimulationStatus;
  /** Play trigger */
  onPlay: () => void;
  /** Pause trigger */
  onPause: () => void;
  /** Step forward trigger */
  onStep?: () => void;
  /** Reset simulation trigger */
  onReset: () => void;
  /** Playback acceleration factor */
  speed?: SimulationSpeed;
  /** Callback to change speed multiplier */
  onChangeSpeed?: (speed: SimulationSpeed) => void;
  /** Overall simulated turnaround duration e.g. "4d 6h 12m" */
  totalDuration: string;
  /** Target SLA compliance tag */
  slaStatus?: SlaStatus;
  /** SLA label e.g. "Target < 5d" */
  slaLabel?: string;
  /** Active step index in execution trace */
  activeStepIndex?: number;
  /** Simulation trace breakdown steps */
  steps?: SimulationStep[];
  className?: string;
  style?: CSSProperties;
}

const SPEED_OPTIONS: SimulationSpeed[] = [1, 2, 5, 10];

/**
 * `<BpmnSimulationBar>` — Process execution simulation playback bar with SLA compliance indicators.
 *
 * @maturity stable
 */
export const BpmnSimulationBar = forwardRef<HTMLDivElement, BpmnSimulationBarProps>(
  (
    {
      status,
      onPlay,
      onPause,
      onStep,
      onReset,
      speed = 1,
      onChangeSpeed,
      totalDuration,
      slaStatus = "compliant",
      slaLabel = "SLA Target: < 5d",
      activeStepIndex = 0,
      steps,
      className,
      style,
    },
    ref,
  ) => {
    const containerClasses = [styles.bar, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label="BPMN Process Simulation Control Bar"
      >
        <div className={styles.controlsLead}>
          <div className={styles.btnGroup}>
            {status === "running" ? (
              <button
                type="button"
                className={`${styles.ctrlBtn} ${styles.primaryBtn}`}
                onClick={onPause}
                aria-label="Pause simulation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.ctrlBtn} ${styles.primaryBtn}`}
                onClick={onPlay}
                aria-label="Start simulation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{status === "paused" ? "Resume" : "Simulate"}</span>
              </button>
            )}

            {onStep && (
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={onStep}
                disabled={status === "running"}
                aria-label="Step forward one node"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
                <span>Step</span>
              </button>
            )}

            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={onReset}
              aria-label="Reset simulation"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Reset</span>
            </button>
          </div>

          <div className={styles.speedToggle}>
            <span className={styles.speedLabel}>Speed:</span>
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ""}`}
                onClick={() => onChangeSpeed?.(s)}
                aria-label={`${s}x speed`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className={styles.metricsGroup}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Total Duration:</span>
            <span className={styles.metricValue}>{totalDuration}</span>
          </div>

          <div className={`${styles.slaBadge} ${styles[slaStatus]}`}>
            <span className={styles.slaDot} aria-hidden="true" />
            <span>{slaLabel}</span>
          </div>
        </div>

        {steps && steps.length > 0 && (
          <div className={styles.stepTrack}>
            {steps.map((step, idx) => {
              const isPassed = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div
                  key={step.id}
                  className={`${styles.stepPill} ${isCurrent ? styles.stepCurrent : ""} ${isPassed ? styles.stepPassed : ""}`}
                >
                  <span className={styles.stepIndex}>{idx + 1}</span>
                  <span className={styles.stepName}>{step.name}</span>
                  <span className={styles.stepDuration}>({step.duration})</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

BpmnSimulationBar.displayName = "BpmnSimulationBar";
