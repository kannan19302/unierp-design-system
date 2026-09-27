"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./minimap.module.css";

export interface ViewfinderBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const minimapVariants = cva(styles.minimapContainer, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface CanvasMinimapNavigatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof minimapVariants> {
  zoomPercent?: number;
  viewfinder: ViewfinderBounds;
  onPan?: (x: number, y: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onZoomToFit?: () => void;
  className?: string;
  testId?: string;
}

/**
 * CanvasMinimapNavigator provides a floating radar overview and pan/zoom controls
 * for spatial, diagramming, CAD, and whiteboard canvases.
 * Benchmarked against Figma / Miro minimap and React Flow minimap.
 *
 * @maturity stable
 */
export const CanvasMinimapNavigator = forwardRef<HTMLDivElement, CanvasMinimapNavigatorProps>(
  (
    {
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
      ...rest
    },
    ref
  ) => {
    const handleRadarClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onPan) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;
      onPan(clickX, clickY);
    };

    return (
      <div
        ref={ref}
        data-slot="minimap"
        data-density={density}
        data-testid={testId}
        role="region"
        aria-label="Canvas Minimap Radar Navigator"
        className={minimapVariants({ density, className })}
        {...rest}
      >
        <div
          data-slot="minimap-radar"
          className={styles.radarWindow}
          onClick={handleRadarClick}
          role="region"
          aria-label="Minimap viewport canvas"
        >
          <div
            data-slot="minimap-viewfinder"
            className={styles.viewfinder}
            style={{
              insetInlineStart: `${viewfinder.x}%`,
              insetBlockStart: `${viewfinder.y}%`,
              inlineSize: `${viewfinder.width}%`,
              blockSize: `${viewfinder.height}%`,
            }}
            title="Active viewport bounds"
          />
        </div>

        <div data-slot="minimap-toolbar" className={styles.toolbar}>
          <span data-slot="minimap-zoom-label" className={styles.zoomLabel}>
            {zoomPercent}%
          </span>

          <div
            data-slot="minimap-controls"
            className={styles.actionsGroup}
            role="group"
            aria-label="Zoom Controls"
          >
            {onZoomOut && (
              <button
                type="button"
                data-slot="minimap-tool-button"
                className={styles.toolBtn}
                onClick={onZoomOut}
                aria-label="Zoom out"
              >
                −
              </button>
            )}

            {onZoomReset && (
              <button
                type="button"
                data-slot="minimap-tool-button"
                className={styles.toolBtn}
                onClick={onZoomReset}
                aria-label="Reset zoom to 100%"
              >
                1:1
              </button>
            )}

            {onZoomIn && (
              <button
                type="button"
                data-slot="minimap-tool-button"
                className={styles.toolBtn}
                onClick={onZoomIn}
                aria-label="Zoom in"
              >
                +
              </button>
            )}

            {onZoomToFit && (
              <button
                type="button"
                data-slot="minimap-tool-button"
                className={styles.toolBtn}
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
  }
);

CanvasMinimapNavigator.displayName = "CanvasMinimapNavigator";
