import React from "react";
import styles from "./workspace-pane-layout-selector.module.css";

export interface PaneVisibilityState {
  showLeftPane: boolean;
  showRightPane: boolean;
  showBottomPane: boolean;
}

export type LayoutPreset = "default" | "focused" | "inspection" | "terminal";

export interface WorkspacePaneLayoutSelectorProps {
  visibility: PaneVisibilityState;
  onTogglePane: (pane: "left" | "right" | "bottom") => void;
  activePreset?: LayoutPreset;
  onSelectPreset?: (preset: LayoutPreset) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

const PRESET_OPTIONS: { id: LayoutPreset; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "focused", label: "Focused" },
  { id: "inspection", label: "Inspector" },
  { id: "terminal", label: "Terminal" },
];

export const WorkspacePaneLayoutSelector: React.FC<WorkspacePaneLayoutSelectorProps> = ({
  visibility,
  onTogglePane,
  activePreset,
  onSelectPreset,
  density = "standard",
  className = "",
  testId = "workspace-pane-layout-selector",
}) => {
  return (
    <div
      className={`${styles.paneBar ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      role="toolbar"
      aria-label="Workspace Panes & Layout"
    >
      <div className={styles.togglesGroup ?? ""} role="group" aria-label="Toggle Panes">
        <button
          type="button"
          className={`${styles.paneToggleBtn ?? ""} ${visibility.showLeftPane ? (styles.paneToggleActive ?? "") : ""}`}
          onClick={() => onTogglePane("left")}
          aria-pressed={visibility.showLeftPane}
          aria-label="Toggle Primary Navigation Sidebar (^B)"
        >
          <span>◧ Nav</span>
          <span className={styles.kbd ?? ""}>^B</span>
        </button>

        <button
          type="button"
          className={`${styles.paneToggleBtn ?? ""} ${visibility.showBottomPane ? (styles.paneToggleActive ?? "") : ""}`}
          onClick={() => onTogglePane("bottom")}
          aria-pressed={visibility.showBottomPane}
          aria-label="Toggle Bottom Terminal Drawer (^J)"
        >
          <span>⬒ Terminal</span>
          <span className={styles.kbd ?? ""}>^J</span>
        </button>

        <button
          type="button"
          className={`${styles.paneToggleBtn ?? ""} ${visibility.showRightPane ? (styles.paneToggleActive ?? "") : ""}`}
          onClick={() => onTogglePane("right")}
          aria-pressed={visibility.showRightPane}
          aria-label="Toggle Right Inspector Panel (^\\)"
        >
          <span>◨ Inspector</span>
          <span className={styles.kbd ?? ""}>^\</span>
        </button>
      </div>

      {onSelectPreset && (
        <div className={styles.presetsGroup ?? ""} role="group" aria-label="Layout Presets">
          {PRESET_OPTIONS.map((opt) => {
            const isActive = activePreset === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`${styles.presetBtn ?? ""} ${isActive ? (styles.presetActive ?? "") : ""}`}
                onClick={() => onSelectPreset(opt.id)}
                aria-pressed={isActive}
                aria-label={`Layout preset ${opt.label}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
