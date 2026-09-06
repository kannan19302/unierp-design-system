import React, { useState, useId, useCallback } from "react";
import styles from "./feature-rollout-slider.module.css";

export interface RolloutCanaryStop {
  percentage: number;
  label: string;
  description?: string;
}

export interface FeatureRolloutSliderProps {
  /** Flag key or name being configured */
  flagKey: string;
  /** Human readable description of feature */
  description?: string;
  /** Current rollout percentage (0-100) */
  value?: number;
  /** Callback fired on percentage modification */
  onChange?: (percentage: number) => void;
  /** Total population size for estimated audience impact calculation */
  totalAudience?: number;
  /** Unit label for audience (default: "tenants") */
  audienceUnit?: string;
  /** Custom canary milestone presets */
  presets?: RolloutCanaryStop[];
  /** Whether the feature has an active killswitch */
  isKillswitchActive?: boolean;
  /** Callback fired when killswitch state toggles */
  onKillswitchToggle?: (active: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_PRESETS: RolloutCanaryStop[] = [
  { percentage: 0, label: "Disabled", description: "0% traffic" },
  { percentage: 5, label: "Canary", description: "Internal / pilot" },
  { percentage: 25, label: "Early Access", description: "Tier 1 beta" },
  { percentage: 50, label: "Expanded", description: "Half of fleet" },
  { percentage: 100, label: "General", description: "100% GA" },
];

export const FeatureRolloutSlider: React.FC<FeatureRolloutSliderProps> = ({
  flagKey,
  description,
  value = 0,
  onChange,
  totalAudience = 10000,
  audienceUnit = "tenants",
  presets = DEFAULT_PRESETS,
  isKillswitchActive = false,
  onKillswitchToggle,
  disabled = false,
  className,
}) => {
  const sliderId = useId();
  const [internalValue, setInternalValue] = useState<number>(value);
  const currentValue = isKillswitchActive ? 0 : internalValue;

  const handlePercentageChange = useCallback(
    (newVal: number) => {
      if (disabled || isKillswitchActive) return;
      const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
      setInternalValue(clamped);
      onChange?.(clamped);
    },
    [disabled, isKillswitchActive, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || isKillswitchActive) return;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        handlePercentageChange(currentValue - (e.shiftKey ? 10 : 1));
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        handlePercentageChange(currentValue + (e.shiftKey ? 10 : 1));
        break;
      case "Home":
        e.preventDefault();
        handlePercentageChange(0);
        break;
      case "End":
        e.preventDefault();
        handlePercentageChange(100);
        break;
      case "PageDown":
        e.preventDefault();
        handlePercentageChange(currentValue - 10);
        break;
      case "PageUp":
        e.preventDefault();
        handlePercentageChange(currentValue + 10);
        break;
    }
  };

  const estimatedReach = Math.round((currentValue / 100) * totalAudience);

  return (
    <div
      className={`${styles.container} ${disabled ? styles.disabled : ""} ${
        isKillswitchActive ? styles.killswitchEngaged : ""
      } ${className ?? ""}`}
      data-density="compact"
    >
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.flagMeta}>
          <div className={styles.flagIdentity}>
            <span className={styles.flagBadge}>FLAG</span>
            <h3 className={styles.flagKey}>{flagKey}</h3>
          </div>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {/* Emergency Killswitch Toggle */}
        <div className={styles.killswitchZone}>
          <button
            type="button"
            className={`${styles.killswitchBtn} ${
              isKillswitchActive ? styles.killswitchActive : ""
            }`}
            onClick={() => onKillswitchToggle?.(!isKillswitchActive)}
            disabled={disabled}
            aria-pressed={isKillswitchActive}
            title={
              isKillswitchActive
                ? "Disengage kill-switch to restore traffic"
                : "Emergency kill-switch: cut all traffic immediately"
            }
          >
            <span className={styles.killswitchIcon} aria-hidden="true">
              ⚠
            </span>
            <span>
              {isKillswitchActive ? "KILLSWITCH ACTIVE" : "EMERGENCY HALT"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Metric Banner */}
      <div className={styles.metricsBar}>
        <div className={styles.primaryMetric}>
          <span className={styles.percentageDisplay}>{currentValue}%</span>
          <span className={styles.metricSubtext}>Rollout Allocation</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.secondaryMetric}>
          <span className={styles.reachDisplay}>
            {estimatedReach.toLocaleString()} / {totalAudience.toLocaleString()}
          </span>
          <span className={styles.metricSubtext}>
            Estimated {audienceUnit} exposed
          </span>
        </div>
        <div className={styles.statusIndicator}>
          {isKillswitchActive ? (
            <span className={styles.statusDanger}>Traffic Cut (0%)</span>
          ) : currentValue === 0 ? (
            <span className={styles.statusMuted}>Inactive (0%)</span>
          ) : currentValue === 100 ? (
            <span className={styles.statusSuccess}>100% GA Active</span>
          ) : (
            <span className={styles.statusWarning}>
              Canary Ramp ({currentValue}%)
            </span>
          )}
        </div>
      </div>

      {/* Interactive Slider Track */}
      <div className={styles.sliderControlWrapper}>
        <label htmlFor={sliderId} className={styles.srOnly}>
          Target feature rollout percentage
        </label>
        <div
          id={sliderId}
          role="slider"
          aria-label={`${flagKey} rollout percentage`}
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${currentValue}% rollout (${estimatedReach} ${audienceUnit})`}
          tabIndex={disabled || isKillswitchActive ? -1 : 0}
          onKeyDown={handleKeyDown}
          className={styles.sliderTrackContainer}
        >
          <div className={styles.trackBackground}>
            <div
              className={styles.trackFill}
              style={{ width: `${currentValue}%` }}
            />
          </div>
          <div
            className={styles.thumb}
            style={{ left: `${currentValue}%` }}
            aria-hidden="true"
          >
            <span className={styles.thumbPill}>{currentValue}%</span>
          </div>
        </div>
      </div>

      {/* Quick Milestone Stepped Presets */}
      <div className={styles.presetSection}>
        <span className={styles.presetsLabel}>Canary Tiers:</span>
        <div className={styles.presetGrid} role="group" aria-label="Canary percentage milestones">
          {presets.map((preset) => {
            const isCurrent = currentValue === preset.percentage;
            return (
              <button
                key={preset.percentage}
                type="button"
                className={`${styles.presetBtn} ${
                  isCurrent ? styles.presetBtnActive : ""
                }`}
                disabled={disabled || isKillswitchActive}
                onClick={() => handlePercentageChange(preset.percentage)}
                title={preset.description}
                aria-pressed={isCurrent}
              >
                <span className={styles.presetNumber}>{preset.percentage}%</span>
                <span className={styles.presetName}>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
