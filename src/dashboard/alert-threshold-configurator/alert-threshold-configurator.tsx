"use client";

import React from "react";
import styles from "./alert-threshold-configurator.module.css";

export interface AlertThresholdConfiguratorProps { metric: string; warningThreshold: number; criticalThreshold: number; unit?: string; max?: number; onSave?: (warning: number, critical: number) => void; }

export const AlertThresholdConfigurator: React.FC<AlertThresholdConfiguratorProps> = (props) => {
  const { metric, warningThreshold: wt, criticalThreshold: ct, unit = '', max = 100, onSave } = props;
  const [warning, setWarning] = React.useState(wt);
  const [critical, setCritical] = React.useState(ct);
  return (
    <div className={styles.container} role="form" aria-label={metric + ' threshold configurator'}>
      <h3 className={styles.title}>Alert Thresholds — {metric}</h3>
      <div className={styles.content}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>⚠ Warning Threshold ({unit || 'value'})</label>
          <input type="range" min={0} max={max} value={warning} onChange={e => setWarning(Number(e.target.value))} className={styles.input} style={{ padding: 0 }} aria-label="Warning threshold" />
          <span className={styles.label}>{warning}{unit}</span>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>🔴 Critical Threshold ({unit || 'value'})</label>
          <input type="range" min={0} max={max} value={critical} onChange={e => setCritical(Number(e.target.value))} className={styles.input} style={{ padding: 0 }} aria-label="Critical threshold" />
          <span className={styles.label}>{critical}{unit}</span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${(warning / max) * 100}%`, background: 'var(--color-warning)' }} />
        </div>
        {onSave && <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onSave(warning, critical)}>Save Thresholds</button>}
      </div>
    </div>
  );
};
