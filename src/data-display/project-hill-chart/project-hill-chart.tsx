import React, { useId, useState } from "react";
import styles from "./project-hill-chart.module.css";

export interface HillChartScope {
  id: string;
  name: string;
  position: number; // 0 (start/conception) to 100 (shipped)
  assignee?: string;
  category?: string;
  updatedAt?: string;
}

export interface ProjectHillChartProps {
  title?: string;
  scopes: HillChartScope[];
  selectedScopeId?: string;
  onScopeSelect?: (scopeId: string) => void;
  onScopeMove?: (scopeId: string, newPosition: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ProjectHillChart: React.FC<ProjectHillChartProps> = ({
  title = "Project Certainty Hill Chart",
  scopes,
  selectedScopeId,
  onScopeSelect,
  onScopeMove,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    selectedScopeId || (scopes.length > 0 ? scopes[0]?.id : undefined)
  );


  const activeId = selectedScopeId !== undefined ? selectedScopeId : internalSelectedId;
  const activeScope = scopes.find((s) => s.id === activeId);

  // SVG coordinates: 800 width, 260 height
  const width = 800;
  const height = 260;
  const paddingX = 40;
  const baselineY = 220;
  const peakY = 40;

  // Calculate curve point for position (0 to 100)
  // Bell-like curve using cosine or gaussian:
  // x goes from paddingX to width - paddingX
  // y rises to peakY at pos=50
  const getCoordinates = (pos: number) => {
    const clampedPos = Math.max(0, Math.min(100, pos));
    const effectiveWidth = width - paddingX * 2;
    const x = paddingX + (clampedPos / 100) * effectiveWidth;
    // Normalized [-1, 1] around 50
    const normalized = (clampedPos - 50) / 50;
    // Cosine hill: from -pi/2 to pi/2 -> 0 to 1
    // or (1 + cos(normalized * Math.PI)) / 2
    const elevation = (1 + Math.cos(normalized * Math.PI)) / 2;
    const y = baselineY - elevation * (baselineY - peakY);
    return { x, y };
  };

  // Generate SVG path for the hill
  const generateHillPath = () => {
    let d = `M ${paddingX} ${baselineY}`;
    for (let i = 1; i <= 100; i++) {
      const { x, y } = getCoordinates(i);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };

  const handleMarkerClick = (id: string) => {
    setInternalSelectedId(id);
    onScopeSelect?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, scope: HillChartScope) => {
    if (!onScopeMove) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onScopeMove(scope.id, Math.min(100, scope.position + 5));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onScopeMove(scope.id, Math.max(0, scope.position - 5));
    }
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            ⛰️
          </div>
          <div>
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
            <p className={styles.subtitle}>
              Visual uncertainty vs. execution trajectory (Basecamp Shape Up model)
            </p>
          </div>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendStage}>
            <span className={styles.uphillIndicator} />
            <span className={styles.stageLabel}>Figuring it out (Unknowns)</span>
          </div>
          <div className={styles.legendStage}>
            <span className={styles.downhillIndicator} />
            <span className={styles.stageLabel}>Making it happen (Execution)</span>
          </div>
        </div>
      </header>

      {/* Hill SVG Canvas */}
      <div className={styles.canvasWrapper}>
        <svg
          className={styles.svgCanvas}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label="Hill chart showing scopes positioned along uncertainty and execution phases"
        >

          {/* Baseline */}
          <line
            x1={paddingX}
            y1={baselineY}
            x2={width - paddingX}
            y2={baselineY}
            className={styles.baseline}
          />

          {/* Center Dividing Line */}
          <line
            x1={width / 2}
            y1={peakY}
            x2={width / 2}
            y2={baselineY}
            className={styles.centerDivider}
          />

          {/* Hill Path */}
          <path d={generateHillPath()} className={styles.hillLine} />

          {/* Markers */}
          {scopes.map((scope) => {
            const { x, y } = getCoordinates(scope.position);
            const isSelected = scope.id === activeId;
            return (
              <g
                key={scope.id}
                className={`${styles.markerGroup} ${isSelected ? styles.selectedMarker : ""}`}
                onClick={() => handleMarkerClick(scope.id)}
                onKeyDown={(e) => handleKeyDown(e, scope)}
                tabIndex={0}
                role="button"
                aria-label={`${scope.name}: ${scope.position}% complete, ${
                  scope.position <= 50 ? "Uphill" : "Downhill"
                }`}
              >
                {/* Glow ring when selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r={12} className={styles.markerGlow} />
                )}
                {/* Outer marker dot */}
                <circle cx={x} cy={y} r={6} className={styles.markerDot} />
                {/* Text label */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  className={styles.markerText}
                >
                  {scope.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Phase Zone Labels */}
        <div className={styles.phaseLabels}>
          <span className={styles.phaseLeft}>← UP THE HILL (Exploration &amp; Unknowns)</span>
          <span className={styles.phaseMid}>Top: Solved</span>
          <span className={styles.phaseRight}>DOWN THE HILL (Execution &amp; Rollout) →</span>
        </div>
      </div>

      {/* Scope Details Ribbon */}
      {activeScope && (
        <div className={styles.detailPane}>
          <div className={styles.scopeMeta}>
            <span className={styles.scopeBadge}>
              {activeScope.position <= 50 ? "Phase 1: Discovery" : "Phase 2: Execution"}
            </span>
            <h3 className={styles.scopeName}>{activeScope.name}</h3>
            {activeScope.assignee && (
              <span className={styles.assignee}>Owner: {activeScope.assignee}</span>
            )}
          </div>

          <div className={styles.positionMeter}>
            <label htmlFor={`pos-${activeScope.id}`} className={styles.meterLabel}>
              Scope Progress: <strong>{activeScope.position}%</strong>
            </label>
            <input
              id={`pos-${activeScope.id}`}
              type="range"
              min="0"
              max="100"
              value={activeScope.position}
              onChange={(e) =>
                onScopeMove?.(activeScope.id, parseInt(e.target.value, 10))
              }
              className={styles.slider}
              disabled={!onScopeMove}
            />
          </div>
        </div>
      )}
    </section>
  );
};
