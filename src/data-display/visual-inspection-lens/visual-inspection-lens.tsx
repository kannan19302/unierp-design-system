import React, { useState, useId, useRef, useCallback } from "react";
import styles from "./visual-inspection-lens.module.css";

export interface InspectionPin {
  id: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  label: string;
  description?: string;
  status?: "open" | "resolved" | "flagged";
}

export interface VisualInspectionLensProps {
  /** Base original image URL */
  baseImageUrl: string;
  /** Label for base image (default: "Base Revision") */
  baseLabel?: string;
  /** Revised/comparison image URL */
  revisedImageUrl: string;
  /** Label for revised image (default: "Revised Version") */
  revisedLabel?: string;
  /** Initial split position (0 to 100%, default: 50%) */
  initialSplitPercent?: number;
  /** Coordinate pins placed on the inspection canvas */
  pins?: InspectionPin[];
  /** Callback fired when an inspection pin is clicked */
  onPinClick?: (pin: InspectionPin) => void;
  /** Comparison mode: 'split' curtain or 'overlay' opacity */
  mode?: "split" | "overlay";
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const VisualInspectionLens: React.FC<VisualInspectionLensProps> = ({
  baseImageUrl,
  baseLabel = "Base Revision",
  revisedImageUrl,
  revisedLabel = "Revised Version",
  initialSplitPercent = 50,
  pins = [],
  onPinClick,
  mode: initialMode = "split",
  density = "compact",
  className,
}) => {
  const lensId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState<number>(initialSplitPercent);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<"split" | "overlay">(initialMode);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.5);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current || activeMode !== "split") return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const relativeX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      setSplitPercent(Math.round(percentage));
    },
    [isDragging, activeMode]
  );

  const handlePointerDown = () => {
    if (activeMode === "split") {
      setIsDragging(true);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (activeMode !== "split") return;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        setSplitPercent((prev) => Math.max(0, prev - (e.shiftKey ? 10 : 2)));
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        setSplitPercent((prev) => Math.min(100, prev + (e.shiftKey ? 10 : 2)));
        break;
      case "Home":
        e.preventDefault();
        setSplitPercent(0);
        break;
      case "End":
        e.preventDefault();
        setSplitPercent(100);
        break;
    }
  };

  const handlePinSelect = (pin: InspectionPin) => {
    setSelectedPinId(pin.id);
    onPinClick?.(pin);
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${lensId}-title`}
    >
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.lensBadge}>LENS</span>
          <h3 id={`${lensId}-title`} className={styles.title}>
            Visual Inspection &amp; Revision Diff
          </h3>
          <span className={styles.badgeSplit}>
            {activeMode === "split" ? `${splitPercent}% Curtain` : `${Math.round(overlayOpacity * 100)}% Opacity`}
          </span>
        </div>

        {/* Mode & Quick Controls */}
        <div className={styles.controlsGroup}>
          <div className={styles.modeTabs} role="group" aria-label="Comparison mode">
            <button
              type="button"
              className={`${styles.modeBtn} ${activeMode === "split" ? styles.modeBtnActive : ""}`}
              onClick={() => setActiveMode("split")}
              aria-pressed={activeMode === "split"}
            >
              Curtain Split
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${activeMode === "overlay" ? styles.modeBtnActive : ""}`}
              onClick={() => setActiveMode("overlay")}
              aria-pressed={activeMode === "overlay"}
            >
              Opacity Fade
            </button>
          </div>

          {activeMode === "split" && (
            <div className={styles.splitPresets} role="group" aria-label="Quick split presets">
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setSplitPercent(0)}
                title="Show 100% Revised Image"
              >
                0%
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setSplitPercent(50)}
                title="Split 50/50"
              >
                50%
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setSplitPercent(100)}
                title="Show 100% Base Image"
              >
                100%
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Visual Comparison Canvas */}
      <div
        ref={containerRef}
        className={styles.viewport}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Base Image (Underneath) */}
        <div className={styles.layerBase}>
          <img src={baseImageUrl} alt={baseLabel} className={styles.image} />
          <span className={styles.labelBasePill}>{baseLabel}</span>
        </div>

        {/* Revised Image (Revealed based on Mode) */}
        {activeMode === "split" ? (
          <div
            className={styles.layerRevisedClip}
            style={{ clipPath: `inset(0 0 0 ${splitPercent}%)` }}
          >
            <img src={revisedImageUrl} alt={revisedLabel} className={styles.image} />
            <span className={styles.labelRevisedPill}>{revisedLabel}</span>
          </div>
        ) : (
          <div
            className={styles.layerRevisedOpacity}
            style={{ opacity: overlayOpacity }}
          >
            <img src={revisedImageUrl} alt={revisedLabel} className={styles.image} />
            <span className={styles.labelRevisedPill}>{revisedLabel}</span>
          </div>
        )}

        {/* Coordinate Inspection Pins */}
        {pins.map((pin) => {
          const isSelected = pin.id === selectedPinId;
          return (
            <button
              key={pin.id}
              type="button"
              className={`${styles.pin} ${isSelected ? styles.pinSelected : ""} ${
                pin.status === "resolved"
                  ? styles.pinResolved
                  : pin.status === "flagged"
                  ? styles.pinFlagged
                  : styles.pinOpen
              }`}
              style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
              onClick={() => handlePinSelect(pin)}
              aria-label={`Inspection Pin: ${pin.label} (${pin.status ?? "open"})`}
              title={`${pin.label}: ${pin.description ?? ""}`}
            >
              <span className={styles.pinIcon}>📍</span>
              <span className={styles.pinLabel}>{pin.label}</span>
            </button>
          );
        })}

        {/* Interactive Split Divider Handle */}
        {activeMode === "split" && (
          <div
            role="slider"
            aria-label="Image comparison split position"
            aria-valuenow={splitPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${splitPercent}% visible`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            className={`${styles.sliderDivider} ${isDragging ? styles.sliderDragging : ""}`}
            style={{ left: `${splitPercent}%` }}
          >
            <div className={styles.handleBar} />
            <div className={styles.handleKnob}>
              <span className={styles.handleArrows} aria-hidden="true">
                ◀ ▶
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Opacity slider bar when in overlay mode */}
      {activeMode === "overlay" && (
        <div className={styles.opacityControls}>
          <label htmlFor={`${lensId}-opacity-slider`} className={styles.opacityLabel}>
            Layer Transparency: {Math.round(overlayOpacity * 100)}%
          </label>
          <input
            id={`${lensId}-opacity-slider`}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className={styles.rangeInput}
          />
        </div>
      )}

      {/* Active Pin Info Callout */}
      {selectedPinId && (
        <div className={styles.selectedPinCard} role="region" aria-label="Selected pin details">
          {(() => {
            const pin = pins.find((p) => p.id === selectedPinId);
            if (!pin) return null;
            return (
              <div className={styles.pinCardContent}>
                <div className={styles.pinCardHeader}>
                  <span className={styles.pinCardBadge}>PIN DETAILS</span>
                  <span className={styles.pinCardStatus}>{pin.status?.toUpperCase() ?? "OPEN"}</span>
                </div>
                <strong className={styles.pinCardTitle}>{pin.label}</strong>
                {pin.description && <p className={styles.pinCardDesc}>{pin.description}</p>}
                <div className={styles.pinCardCoordinates}>
                  Coordinates: {pin.xPercent.toFixed(1)}% X, {pin.yPercent.toFixed(1)}% Y
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
