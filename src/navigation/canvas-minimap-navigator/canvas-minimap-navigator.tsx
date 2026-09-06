import React from "react";
import styles from "./canvas-minimap-navigator.module.css";

export interface ViewfinderBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasMinimapNavigatorProps {
  zoomPercent?: number;
  viewfinder: ViewfinderBounds;
  onPan?: (x: number, y: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onZoomToFit?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const CanvasMinimapNavigator: React.FC<CanvasMinimapNavigatorProps> = ({
  zoomPercent = 100,
  viewfinder,
  onPan,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomToFit,
  density = "standard",
  className = "",
  testId = "canvas-minimap-navigator",
}) => {
  const handleRadarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onPan) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    onPan(clickX, clickY);
  };

  return (
    <div
      className={`${styles.minimapContainer ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      role="region"
      aria-label="Canvas Minimap Radar Navigator"
    >
      <div
        className={styles.radarWindow ?? ""}
        onClick={handleRadarClick}
        role="region"
        aria-label="Minimap viewport canvas"
      >
        <div
          className={styles.viewfinder ?? ""}
          style={{
            left: `${viewfinder.x}%`,
            top: `${viewfinder.y}%`,
            width: `${viewfinder.width}%`,
            height: `${viewfinder.height}%`,
          }}
          title="Active viewport bounds"
        />
      </div>

      <div className={styles.toolbar ?? ""}>
        <span className={styles.zoomLabel ?? ""}>{zoomPercent}%</span>

        <div className={styles.actionsGroup ?? ""} role="group" aria-label="Zoom Controls">
          {onZoomOut && (
            <button
              type="button"
              className={styles.toolBtn ?? ""}
              onClick={onZoomOut}
              aria-label="Zoom out"
            >
              −
            </button>
          )}

          {onZoomReset && (
            <button
              type="button"
              className={styles.toolBtn ?? ""}
              onClick={onZoomReset}
              aria-label="Reset zoom to 100%"
            >
              1:1
            </button>
          )}

          {onZoomIn && (
            <button
              type="button"
              className={styles.toolBtn ?? ""}
              onClick={onZoomIn}
              aria-label="Zoom in"
            >
              +
            </button>
          )}

          {onZoomToFit && (
            <button
              type="button"
              className={styles.toolBtn ?? ""}
              onClick={onZoomToFit}
              aria-label="Zoom to fit canvas"
            >
              ⊡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
