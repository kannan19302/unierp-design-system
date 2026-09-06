import React from "react";
import styles from "./temporal-timeline-scrubber.module.css";

export interface TimelineEventMarker {
  id: string;
  timestamp: number;
  label: string;
  type?: "audit" | "warning" | "release";
}

export type TemporalRangePreset = "1h" | "24h" | "7d" | "30d" | "Quarter" | "FY";

export interface TemporalTimelineScrubberProps {
  minTimestamp: number;
  maxTimestamp: number;
  currentTimestamp: number;
  onTimestampChange: (ts: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  eventMarkers?: TimelineEventMarker[];
  activePreset?: TemporalRangePreset;
  onPresetChange?: (preset: TemporalRangePreset) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

const PRESET_OPTIONS: TemporalRangePreset[] = ["1h", "24h", "7d", "30d", "Quarter", "FY"];

export const TemporalTimelineScrubber: React.FC<TemporalTimelineScrubberProps> = ({
  minTimestamp,
  maxTimestamp,
  currentTimestamp,
  onTimestampChange,
  isPlaying = false,
  onTogglePlay,
  eventMarkers = [],
  activePreset = "24h",
  onPresetChange,
  density = "standard",
  className = "",
  testId = "temporal-timeline-scrubber",
}) => {
  const stepInterval = Math.max(1, Math.round((maxTimestamp - minTimestamp) / 100));

  const handleStepBack = () => {
    onTimestampChange(Math.max(minTimestamp, currentTimestamp - stepInterval));
  };

  const handleStepForward = () => {
    onTimestampChange(Math.min(maxTimestamp, currentTimestamp + stepInterval));
  };

  const formattedDate = new Date(currentTimestamp).toISOString().replace("T", " ").replace("Z", " UTC");

  return (
    <div
      className={`${styles.scrubberBar ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      role="region"
      aria-label="Temporal Audit Timeline Scrubber"
    >
      <div className={styles.controlsRow ?? ""}>
        <div className={styles.playbackGroup ?? ""}>
          {onTogglePlay && (
            <button
              type="button"
              className={styles.iconBtn ?? ""}
              onClick={onTogglePlay}
              aria-label={isPlaying ? "Pause timeline playback" : "Play timeline simulation"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
          )}

          <button
            type="button"
            className={styles.iconBtn ?? ""}
            onClick={handleStepBack}
            disabled={currentTimestamp <= minTimestamp}
            aria-label="Step backward"
          >
            ◀
          </button>

          <button
            type="button"
            className={styles.iconBtn ?? ""}
            onClick={handleStepForward}
            disabled={currentTimestamp >= maxTimestamp}
            aria-label="Step forward"
          >
            ▶
          </button>

          <span className={styles.timestampDisplay ?? ""}>{formattedDate}</span>
        </div>

        {onPresetChange && (
          <div className={styles.presetsGroup ?? ""} role="group" aria-label="Timeline Range Presets">
            {PRESET_OPTIONS.map((preset) => {
              const isActive = activePreset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.presetBtn ?? ""} ${isActive ? (styles.presetActive ?? "") : ""}`}
                  onClick={() => onPresetChange(preset)}
                  aria-pressed={isActive}
                  aria-label={`Time range preset ${preset}`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.trackContainer ?? ""}>
        <input
          type="range"
          className={styles.sliderInput ?? ""}
          min={minTimestamp}
          max={maxTimestamp}
          value={currentTimestamp}
          onChange={(e) => onTimestampChange(Number(e.target.value))}
          aria-label="Timeline scrubber position"
        />

        <div className={styles.markersTrack ?? ""} aria-hidden="true">
          {eventMarkers.map((m) => {
            const range = maxTimestamp - minTimestamp;
            const pct = range > 0 ? ((m.timestamp - minTimestamp) / range) * 100 : 0;
            return (
              <span
                key={m.id}
                className={styles.markerTick ?? ""}
                style={{ left: `${Math.min(100, Math.max(0, pct))}%` }}
                title={`${m.label} (${new Date(m.timestamp).toLocaleTimeString()})`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
