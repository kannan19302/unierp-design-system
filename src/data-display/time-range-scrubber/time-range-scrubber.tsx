"use client";

import {
  useState,
  type FC,
  type ChangeEvent,
} from "react";
import {
  Clock,
  Calendar,
  Globe,
  RefreshCw,
  Sliders,
} from "lucide-react";
import styles from "./time-range-scrubber.module.css";

export type PresetDuration = "15m" | "1h" | "4h" | "24h" | "7d" | "30d" | "ytd" | "all";
export type TimezoneOption = "UTC" | "Local" | "America/New_York" | "Europe/London" | "Asia/Tokyo";
export type AutoRefreshInterval = "off" | "10s" | "30s" | "1m" | "5m";
export type ScrubberDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface TimeRangeValue {
  start: string;
  end: string;
  preset?: PresetDuration;
  timezone: TimezoneOption;
  autoRefresh?: AutoRefreshInterval;
}

export interface TimeRangeScrubberProps {
  /** Initial time range configuration */
  initialRange?: Partial<TimeRangeValue>;
  /** Callback when time range or preset changes */
  onChange?: (range: TimeRangeValue) => void;
  /** Available preset pills */
  presets?: PresetDuration[];
  /** Whether to show brush zoom slider */
  showBrushSlider?: boolean;
  /** Density scale */
  density?: ScrubberDensity;
  className?: string;
}

const DEFAULT_PRESETS: PresetDuration[] = ["15m", "1h", "4h", "24h", "7d", "30d", "ytd"];

/**
 * `<TimeRangeScrubber>` — High-density temporal window selector & timeline scrubber.
 * Benchmarked against Datadog Dashboards (#53), Grafana (#52), and Elastic Kibana (#54).
 */
export const TimeRangeScrubber: FC<TimeRangeScrubberProps> = ({
  initialRange,
  onChange,
  presets = DEFAULT_PRESETS,
  showBrushSlider = true,
  density = "compact",
  className = "",
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetDuration | undefined>(
    initialRange?.preset || "24h"
  );
  const [startDateTime, setStartDateTime] = useState<string>(
    initialRange?.start || new Date(Date.now() - 86400000).toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState<string>(
    initialRange?.end || new Date().toISOString().slice(0, 16)
  );
  const [timezone, setTimezone] = useState<TimezoneOption>(
    initialRange?.timezone || "UTC"
  );
  const [autoRefresh, setAutoRefresh] = useState<AutoRefreshInterval>(
    initialRange?.autoRefresh || "off"
  );
  const [sliderPosition, setSliderPosition] = useState<number>(100);

  const notifyChange = (
    presetVal: PresetDuration | undefined,
    startVal: string,
    endVal: string,
    tzVal: TimezoneOption,
    refreshVal: AutoRefreshInterval
  ) => {
    onChange?.({
      preset: presetVal,
      start: startVal,
      end: endVal,
      timezone: tzVal,
      autoRefresh: refreshVal,
    });
  };

  const handleSelectPreset = (preset: PresetDuration) => {
    setSelectedPreset(preset);
    const now = new Date();
    let past = new Date();

    switch (preset) {
      case "15m":
        past = new Date(now.getTime() - 15 * 60000);
        break;
      case "1h":
        past = new Date(now.getTime() - 3600000);
        break;
      case "4h":
        past = new Date(now.getTime() - 4 * 3600000);
        break;
      case "24h":
        past = new Date(now.getTime() - 86400000);
        break;
      case "7d":
        past = new Date(now.getTime() - 7 * 86400000);
        break;
      case "30d":
        past = new Date(now.getTime() - 30 * 86400000);
        break;
      case "ytd":
        past = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        past = new Date(now.getTime() - 86400000);
        break;
    }

    const startStr = past.toISOString().slice(0, 16);
    const endStr = now.toISOString().slice(0, 16);
    setStartDateTime(startStr);
    setEndDateTime(endStr);
    notifyChange(preset, startStr, endStr, timezone, autoRefresh);
  };

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStartDateTime(val);
    setSelectedPreset(undefined);
    notifyChange(undefined, val, endDateTime, timezone, autoRefresh);
  };

  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEndDateTime(val);
    setSelectedPreset(undefined);
    notifyChange(undefined, startDateTime, val, timezone, autoRefresh);
  };

  const handleTimezoneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tz = e.target.value as TimezoneOption;
    setTimezone(tz);
    notifyChange(selectedPreset, startDateTime, endDateTime, tz, autoRefresh);
  };

  const handleAutoRefreshChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const ref = e.target.value as AutoRefreshInterval;
    setAutoRefresh(ref);
    notifyChange(selectedPreset, startDateTime, endDateTime, timezone, ref);
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(parseFloat(e.target.value));
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Time Range Scrubber"
    >
      {/* ── Main Toolbar ── */}
      <div className={styles.toolbar}>
        {/* Preset Duration Pills */}
        <div className={styles.presetGroup}>
          <Clock size={13} className={styles.clockIcon} aria-hidden="true" />
          <div className={styles.presetList}>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`${styles.presetBtn} ${
                  selectedPreset === preset ? styles.presetBtnActive : ""
                }`}
                onClick={() => handleSelectPreset(preset)}
                aria-pressed={selectedPreset === preset}
              >
                {preset.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Date Time Inputs */}
        <div className={styles.dateInputsGroup}>
          <Calendar size={13} className={styles.calendarIcon} aria-hidden="true" />
          <input
            type="datetime-local"
            className={styles.dateTimeInput}
            value={startDateTime}
            onChange={handleStartChange}
            aria-label="Start Date Time"
          />
          <span className={styles.dateSep}>to</span>
          <input
            type="datetime-local"
            className={styles.dateTimeInput}
            value={endDateTime}
            onChange={handleEndChange}
            aria-label="End Date Time"
          />
        </div>

        {/* Timezone & Auto-Refresh Options */}
        <div className={styles.controlsGroup}>
          <div className={styles.selectWrap}>
            <Globe size={12} className={styles.fieldIcon} aria-hidden="true" />
            <select
              className={styles.select}
              value={timezone}
              onChange={handleTimezoneChange}
              aria-label="Select Timezone"
            >
              <option value="UTC">UTC</option>
              <option value="Local">Local</option>
              <option value="America/New_York">EST (New York)</option>
              <option value="Europe/London">BST (London)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
            </select>
          </div>

          <div className={styles.selectWrap}>
            <RefreshCw
              size={12}
              className={`${styles.fieldIcon} ${
                autoRefresh !== "off" ? styles.spinActive : ""
              }`}
              aria-hidden="true"
            />
            <select
              className={styles.select}
              value={autoRefresh}
              onChange={handleAutoRefreshChange}
              aria-label="Auto-Refresh Interval"
            >
              <option value="off">Refresh: Off</option>
              <option value="10s">10s</option>
              <option value="30s">30s</option>
              <option value="1m">1m</option>
              <option value="5m">5m</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Visual Timeline Brush Scrubber ── */}
      {showBrushSlider && (
        <div className={styles.brushRibbon}>
          <Sliders size={12} className={styles.sliderIcon} aria-hidden="true" />
          <span className={styles.brushLabel}>Timeline Window Scrub:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPosition}
            onChange={handleSliderChange}
            className={styles.brushSlider}
            aria-label="Timeline window zoom scrubber"
          />
          <span className={styles.brushPercent}>{Math.round(sliderPosition)}%</span>
        </div>
      )}
    </div>
  );
};
