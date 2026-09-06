import React, { useId, useState, useMemo } from "react";
import styles from "./supply-chain-disruption-risk-heatmap.module.css";

export type DisruptionCategory = "weather" | "port_congestion" | "geopolitical" | "tariffs" | "composite";
export type RiskSeverity = "low" | "moderate" | "elevated" | "severe" | "critical";

export interface LaneRiskCell {
  laneId: string;
  originHub: string; // e.g. "Shanghai (CNSHA)"
  destinationHub: string; // e.g. "Long Beach (USLGB)"
  riskScore: number; // 0 - 100
  severity: RiskSeverity;
  category: DisruptionCategory;
  dwellDays: number; // e.g. 6.4
  transitVarianceDays: number; // e.g. +3.2
  recommendedAlternate?: string; // e.g. "Rail via Prince Rupert (CAPRR)"
  primaryCarrier: string; // "Maersk / MSC"
}

export interface SupplyChainDisruptionRiskHeatmapProps {
  title?: string;
  subtitle?: string;
  corridorName?: string;
  origins: string[];
  destinations: string[];
  cells: LaneRiskCell[];
  selectedLaneId?: string;
  onSelectLane?: (lane: LaneRiskCell) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SupplyChainDisruptionRiskHeatmap: React.FC<SupplyChainDisruptionRiskHeatmapProps> = ({
  title = "Global Supply Chain Disruption Heatmap",
  subtitle = "Real-time lane latency, port bottleneck indexing & proactive contingency routing",
  corridorName = "Trans-Pacific & Maritime Corridors",
  origins,
  destinations,
  cells,
  selectedLaneId,
  onSelectLane,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [filterCategory, setFilterCategory] = useState<DisruptionCategory>("composite");
  const [activeLaneId, setActiveLaneId] = useState<string | null>(
    selectedLaneId ?? (cells[0]?.laneId ?? null)
  );

  // Map cells for quick coordinate lookup: origin -> destination -> LaneRiskCell
  const cellLookup = useMemo(() => {
    const map = new Map<string, LaneRiskCell>();
    cells.forEach((c) => {
      map.set(`${c.originHub}:::${c.destinationHub}`, c);
    });
    return map;
  }, [cells]);

  const activeCell = useMemo(() => {
    return cells.find((c) => c.laneId === activeLaneId) ?? null;
  }, [cells, activeLaneId]);

  const handleCellClick = (cell: LaneRiskCell) => {
    setActiveLaneId(cell.laneId);
    onSelectLane?.(cell);
  };

  const getSeverityBadgeClass = (severity: RiskSeverity) => {
    switch (severity) {
      case "critical":
        return styles.sevCritical;
      case "severe":
        return styles.sevSevere;
      case "elevated":
        return styles.sevElevated;
      case "moderate":
        return styles.sevModerate;
      default:
        return styles.sevLow;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.taglineRow}>
            <span className={styles.corridorBadge}>{corridorName}</span>
            <span className={styles.liveIndicator}>
              <span className={styles.livePulse} aria-hidden="true" />
              LIVE TELEMETRY
            </span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.filterControls}>
          <label htmlFor="risk-category-select" className={styles.filterLabel}>
            Risk Assessment Model:
          </label>
          <select
            id="risk-category-select"
            className={styles.filterSelect}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as DisruptionCategory)}
          >
            <option value="composite">Composite Risk Index</option>
            <option value="port_congestion">Port Dwell & Berthing Latency</option>
            <option value="weather">Severe Weather & Typhoons</option>
            <option value="geopolitical">Geopolitical & Strait Chokepoints</option>
            <option value="tariffs">Customs & Tariff Border Holds</option>
          </select>
        </div>
      </header>

      <div className={styles.workspaceLayout}>
        <div className={styles.matrixWrapper}>
          <table className={styles.heatmapTable} aria-label="Supply Chain Disruption Risk Matrix">
            <caption className={styles.srOnly}>
              Origin and destination port disruption heatmap matrix
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.originCornerHeader}>
                  Origin Hub \ Dest Port
                </th>
                {destinations.map((dest) => (
                  <th key={dest} scope="col" className={styles.destinationHeader}>
                    {dest}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {origins.map((orig) => (
                <tr key={orig}>
                  <th scope="row" className={styles.originHeader}>
                    {orig}
                  </th>
                  {destinations.map((dest) => {
                    const cell = cellLookup.get(`${orig}:::${dest}`);
                    if (!cell) {
                      return (
                        <td key={dest} className={styles.emptyCell}>
                          <span className={styles.emptyDash}>—</span>
                        </td>
                      );
                    }

                    const isSelected = activeLaneId === cell.laneId;
                    const sevClass = getSeverityBadgeClass(cell.severity);

                    return (
                      <td key={dest} className={styles.gridCellWrapper}>
                        <button
                          type="button"
                          className={`${styles.riskCellBtn} ${sevClass} ${isSelected ? styles.cellSelected : ""}`}
                          onClick={() => handleCellClick(cell)}
                          aria-label={`Lane ${orig} to ${dest}, risk score ${cell.riskScore} out of 100, severity ${cell.severity}`}
                          aria-pressed={isSelected}
                        >
                          <span className={styles.cellScore}>{cell.riskScore}</span>
                          <span className={styles.cellDwell}>{cell.dwellDays}d</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.legendRow}>
            <span className={styles.legendTitle}>Risk Tiers:</span>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.sevLow}`} />
              <span>Low (0-25)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.sevModerate}`} />
              <span>Moderate (26-50)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.sevElevated}`} />
              <span>Elevated (51-70)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.sevSevere}`} />
              <span>Severe (71-85)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.sevCritical}`} />
              <span>Critical (86-100)</span>
            </div>
          </div>
        </div>

        {activeCell && (
          <aside
            className={styles.inspectorDrawer}
            aria-label="Active Freight Lane Intelligence"
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTagRow}>
                <span className={`${styles.drawerBadge} ${getSeverityBadgeClass(activeCell.severity)}`}>
                  {activeCell.severity.toUpperCase()} RISK
                </span>
                <span className={styles.drawerLaneId}>{activeCell.laneId}</span>
              </div>
              <h3 className={styles.drawerTitle}>
                {activeCell.originHub} → {activeCell.destinationHub}
              </h3>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Risk Index</span>
                <strong className={styles.metricValue}>{activeCell.riskScore} / 100</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Avg Port Dwell</span>
                <strong className={styles.metricValue}>{activeCell.dwellDays} Days</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Schedule Variance</span>
                <strong
                  className={`${styles.metricValue} ${
                    activeCell.transitVarianceDays > 0 ? styles.delayPositive : ""
                  }`}
                >
                  +{activeCell.transitVarianceDays} Days
                </strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Lead Ocean Carrier</span>
                <strong className={styles.metricValueSmall}>{activeCell.primaryCarrier}</strong>
              </div>
            </div>

            {activeCell.recommendedAlternate && (
              <div className={styles.alternateRoutingBox}>
                <div className={styles.alternateHeading}>
                  <span className={styles.alternateIcon} aria-hidden="true">⇄</span>
                  <strong>Proactive Reroute Recommendation</strong>
                </div>
                <p className={styles.alternateText}>{activeCell.recommendedAlternate}</p>
                <div className={styles.alternateSavings}>
                  Est. Latency Mitigation: <strong>-2.5 Days</strong> | SLA Protection: <strong>99.1%</strong>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
};
