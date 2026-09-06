import React, { useId, useState } from "react";
import styles from "./bim-model-viewer-toolbar.module.css";

export type BimCameraMode = "orbit" | "pan" | "walk" | "fly" | "first_person";
export type BimSectionMode = "none" | "x_plane" | "y_plane" | "z_plane" | "box_cut";
export type BimMeasureTool = "none" | "distance" | "angle" | "area";

export interface BimDisciplineState {
  architectural: boolean;
  structural: boolean;
  mep: boolean;
  hvac: boolean;
}

export interface BimModelViewerToolbarProps {
  modelName?: string; // "Tower B - Level 14 MEP Coordination.ifc"
  activeCameraMode?: BimCameraMode;
  activeSectionMode?: BimSectionMode;
  activeMeasureTool?: BimMeasureTool;
  initialDisciplines?: BimDisciplineState;
  onCameraModeChange?: (mode: BimCameraMode) => void;
  onSectionModeChange?: (mode: BimSectionMode) => void;
  onMeasureToolChange?: (tool: BimMeasureTool) => void;
  onDisciplineToggle?: (discipline: keyof BimDisciplineState, enabled: boolean) => void;
  onResetCamera?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const BimModelViewerToolbar: React.FC<BimModelViewerToolbarProps> = ({
  modelName = "Commercial Office Tower - Level 12 Structural & MEP.ifc",
  activeCameraMode = "orbit",
  activeSectionMode = "none",
  activeMeasureTool = "none",
  initialDisciplines = { architectural: true, structural: true, mep: true, hvac: false },
  onCameraModeChange,
  onSectionModeChange,
  onMeasureToolChange,
  onDisciplineToggle,
  onResetCamera,
  density = "compact",
  className = "",
}) => {
  const toolbarId = useId();
  const [cameraMode, setCameraMode] = useState<BimCameraMode>(activeCameraMode);
  const [sectionMode, setSectionMode] = useState<BimSectionMode>(activeSectionMode);
  const [measureTool, setMeasureTool] = useState<BimMeasureTool>(activeMeasureTool);
  const [disciplines, setDisciplines] = useState<BimDisciplineState>(initialDisciplines);

  const handleSetCamera = (mode: BimCameraMode) => {
    setCameraMode(mode);
    onCameraModeChange?.(mode);
  };

  const handleSetSection = (mode: BimSectionMode) => {
    const next = sectionMode === mode ? "none" : mode;
    setSectionMode(next);
    onSectionModeChange?.(next);
  };

  const handleSetMeasure = (tool: BimMeasureTool) => {
    const next = measureTool === tool ? "none" : tool;
    setMeasureTool(next);
    onMeasureToolChange?.(next);
  };

  const toggleDiscipline = (disc: keyof BimDisciplineState) => {
    const updated = !disciplines[disc];
    setDisciplines((prev) => ({ ...prev, [disc]: updated }));
    onDisciplineToggle?.(disc, updated);
  };

  return (
    <nav
      id={toolbarId}
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-label="3D BIM Model Viewport Controls"
    >
      <div className={styles.modelTagGroup}>
        <span className={styles.modelBadge}>BIM 360 COORDINATION</span>
        <span className={styles.modelNameText} title={modelName}>
          {modelName}
        </span>
      </div>

      <div role="toolbar" aria-label="Camera and Viewport Tools" className={styles.toolbarDock}>
        {/* Camera Navigation Modes */}
        <div className={styles.toolGroup} role="group" aria-label="Camera Navigation Modes">
          <button
            type="button"
            className={`${styles.toolBtn} ${cameraMode === "orbit" ? styles.btnActive : ""}`}
            onClick={() => handleSetCamera("orbit")}
            aria-pressed={cameraMode === "orbit"}
            aria-label="Orbit Camera (O)"
            title="Orbit Camera (O)"
          >
            <span className={styles.toolIcon} aria-hidden="true">⟲</span>
            <span className={styles.toolText}>Orbit</span>
          </button>
          <button
            type="button"
            className={`${styles.toolBtn} ${cameraMode === "pan" ? styles.btnActive : ""}`}
            onClick={() => handleSetCamera("pan")}
            aria-pressed={cameraMode === "pan"}
            aria-label="Pan Camera (P)"
            title="Pan Camera (P)"
          >
            <span className={styles.toolIcon} aria-hidden="true">✥</span>
            <span className={styles.toolText}>Pan</span>
          </button>
          <button
            type="button"
            className={`${styles.toolBtn} ${cameraMode === "walk" ? styles.btnActive : ""}`}
            onClick={() => handleSetCamera("walk")}
            aria-pressed={cameraMode === "walk"}
            aria-label="First-Person Walkthrough (W)"
            title="First-Person Walkthrough (W)"
          >
            <span className={styles.toolIcon} aria-hidden="true">🚶</span>
            <span className={styles.toolText}>Walk</span>
          </button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Section / Clipping Plane Tools */}
        <div className={styles.toolGroup} role="group" aria-label="Section and Clipping Planes">
          <button
            type="button"
            className={`${styles.toolBtn} ${sectionMode === "x_plane" ? styles.btnActive : ""}`}
            onClick={() => handleSetSection("x_plane")}
            aria-pressed={sectionMode === "x_plane"}
            aria-label="Cut X-Plane Section"
            title="Cut X-Plane Section"
          >
            <span className={styles.toolIcon} aria-hidden="true">◫</span>
            <span className={styles.toolText}>Sec X</span>
          </button>
          <button
            type="button"
            className={`${styles.toolBtn} ${sectionMode === "z_plane" ? styles.btnActive : ""}`}
            onClick={() => handleSetSection("z_plane")}
            aria-pressed={sectionMode === "z_plane"}
            aria-label="Cut Z-Plane Section"
            title="Cut Z-Plane Section"
          >
            <span className={styles.toolIcon} aria-hidden="true">◰</span>
            <span className={styles.toolText}>Sec Z</span>
          </button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Measurement Tools */}
        <div className={styles.toolGroup} role="group" aria-label="Measurement Tools">
          <button
            type="button"
            className={`${styles.toolBtn} ${measureTool === "distance" ? styles.btnActive : ""}`}
            onClick={() => handleSetMeasure("distance")}
            aria-pressed={measureTool === "distance"}
            aria-label="Measure Linear Point-to-Point Distance"
            title="Measure Distance"
          >
            <span className={styles.toolIcon} aria-hidden="true">📏</span>
            <span className={styles.toolText}>Measure</span>
          </button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Discipline Filter Toggles */}
        <div className={styles.toolGroup} role="group" aria-label="Model Discipline Layers">
          <button
            type="button"
            className={`${styles.pillBtn} ${disciplines.architectural ? styles.pillActive : ""}`}
            onClick={() => toggleDiscipline("architectural")}
            aria-pressed={disciplines.architectural}
            aria-label="Toggle Architectural Layer"
          >
            Arch
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${disciplines.structural ? styles.pillActive : ""}`}
            onClick={() => toggleDiscipline("structural")}
            aria-pressed={disciplines.structural}
            aria-label="Toggle Structural Layer"
          >
            Struct
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${disciplines.mep ? styles.pillActive : ""}`}
            onClick={() => toggleDiscipline("mep")}
            aria-pressed={disciplines.mep}
            aria-label="Toggle MEP Layer"
          >
            MEP
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${disciplines.hvac ? styles.pillActive : ""}`}
            onClick={() => toggleDiscipline("hvac")}
            aria-pressed={disciplines.hvac}
            aria-label="Toggle HVAC Ducting Layer"
          >
            HVAC
          </button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Camera Reset */}
        <div className={styles.toolGroup}>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={onResetCamera}
            aria-label="Reset Camera View to Home Default"
            title="Reset Camera (Home)"
          >
            <span className={styles.toolIcon} aria-hidden="true">⌂</span>
            <span className={styles.toolText}>Home</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
