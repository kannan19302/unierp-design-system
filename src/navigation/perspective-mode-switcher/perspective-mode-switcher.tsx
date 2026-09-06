import React from "react";
import styles from "./perspective-mode-switcher.module.css";

export type PerspectiveModeId = "list" | "kanban" | "gantt" | "calendar" | "pivot" | "hierarchy" | string;

export interface PerspectiveMode {
  id: PerspectiveModeId;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface PerspectiveModeSwitcherProps {
  modes: PerspectiveMode[];
  activeModeId: PerspectiveModeId;
  onModeChange: (modeId: PerspectiveModeId) => void;
  onCustomizeView?: () => void;
  onSaveView?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const PerspectiveModeSwitcher: React.FC<PerspectiveModeSwitcherProps> = ({
  modes,
  activeModeId,
  onModeChange,
  onCustomizeView,
  onSaveView,
  density = "standard",
  className = "",
  testId = "perspective-mode-switcher",
}) => {
  return (
    <div
      className={`${styles.switcherContainer ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      role="toolbar"
      aria-label="Perspective Mode Switcher"
    >
      <div className={styles.modeList ?? ""} role="tablist" aria-label="View Perspectives">
        {modes.map((mode) => {
          const isActive = activeModeId === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.modeBtn ?? ""} ${isActive ? (styles.modeBtnActive ?? "") : ""}`}
              onClick={() => onModeChange(mode.id)}
              disabled={mode.disabled}
              aria-label={`${mode.label}${typeof mode.count === "number" ? ` (${mode.count})` : ""}`}
            >
              {mode.icon && <span aria-hidden="true">{mode.icon}</span>}
              <span>{mode.label}</span>
              {typeof mode.count === "number" && (
                <span className={styles.badge ?? ""}>{mode.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {(onCustomizeView || onSaveView) && (
        <div className={styles.actionsSection ?? ""}>
          {onCustomizeView && (
            <button
              type="button"
              className={styles.actionBtn ?? ""}
              onClick={onCustomizeView}
              aria-label="Customize View Fields and Sorting"
            >
              <span>⚙</span>
              <span>Customize</span>
            </button>
          )}
          {onSaveView && (
            <button
              type="button"
              className={styles.actionBtn ?? ""}
              onClick={onSaveView}
              aria-label="Save Current View Preset"
            >
              <span>★</span>
              <span>Save View</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
