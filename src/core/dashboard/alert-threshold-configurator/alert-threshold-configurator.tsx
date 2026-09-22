"use client";

import React, { forwardRef, useState } from "react";
import styles from "./alert-threshold-configurator.module.css";

export interface AlertThresholdConfiguratorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  metric: string;
  warningThreshold: number;
  criticalThreshold: number;
  unit?: string;
  max?: number;
  onSave?: (warning: number, critical: number) => void;
}

/**
 * AlertThresholdConfigurator
 *
 * Operational telemetry panel allowing DevOps and finance operations to configure
 * warning and critical escalation threshold levels with immediate visual boundaries.
 *
 * @maturity stable
 */
export const AlertThresholdConfigurator = forwardRef<
  HTMLDivElement,
  AlertThresholdConfiguratorProps
>(function AlertThresholdConfigurator(
  {
    metric,
    warningThreshold: wt,
    criticalThreshold: ct,
    unit = "",
    max = 100,
    onSave,
    className,
    ...restProps
  },
  ref
) {
  const [warning, setWarning] = useState(wt);
  const [critical, setCritical] = useState(ct);

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="form"
      aria-label={`${metric} threshold configurator`}
      {...restProps}
    >
      <h3 className={styles.title}>Alert Thresholds — {metric}</h3>
      <div className={styles.content}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor={`${metric}-warning`}>
            ⚠ Warning Threshold ({unit || "value"})
          </label>
          <input
            id={`${metric}-warning`}
            type="range"
            min={0}
            max={max}
            value={warning}
            onChange={(e) => setWarning(Number(e.target.value))}
            className={styles.input}
            aria-label={`${metric} warning threshold`}
          />
          <span className={styles.label}>
            {warning}
            {unit}
          </span>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor={`${metric}-critical`}>
            🔴 Critical Threshold ({unit || "value"})
          </label>
          <input
            id={`${metric}-critical`}
            type="range"
            min={0}
            max={max}
            value={critical}
            onChange={(e) => setCritical(Number(e.target.value))}
            className={styles.input}
            aria-label={`${metric} critical threshold`}
          />
          <span className={styles.label}>
            {critical}
            {unit}
          </span>
        </div>
        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(warning / max) * 100}%`,
              background: "var(--color-warning)",
            }}
          />
        </div>
        {onSave && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onSave(warning, critical)}
          >
            Save Thresholds
          </button>
        )}
      </div>
    </div>
  );
});

AlertThresholdConfigurator.displayName = "AlertThresholdConfigurator";
