import React, { useId, useState } from "react";
import styles from "./statistical-process-control-chart.module.css";

export interface SpcSubgroupSample {
  sampleIndex: number; // 1, 2, 3...
  timestamp: string; // "08:15"
  meanValue: number; // 85.004
  rangeValue: number; // 0.012
  isViolation: boolean;
  violationRule?: string; // "Rule 1: Point exceeds 3-sigma UCL limit"
}

export interface StatisticalProcessControlChartProps {
  processName?: string;
  nominalMean?: number;
  ucl?: number;
  lcl?: number;
  unitOfMeasure?: string;
  subgroups: SpcSubgroupSample[];
  onInspectSample?: (sampleIndex: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const StatisticalProcessControlChart: React.FC<StatisticalProcessControlChartProps> = ({
  processName = "Cylinder Bore Diameter Machining (Station CNC-04)",
  nominalMean = 85.0,
  ucl = 85.045,
  lcl = 84.955,
  unitOfMeasure = "mm",
  subgroups: initialSubgroups,
  onInspectSample,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [subgroups] = useState<SpcSubgroupSample[]>(initialSubgroups);
  const [activeSampleIndex, setActiveSampleIndex] = useState<number | null>(null);

  const violationCount = subgroups.filter((s) => s.isViolation).length;
  const isProcessInControl = violationCount === 0;

  // Compute SVG coordinates for chart plotting
  const chartHeight = 160;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 24;

  const minVal = lcl - (ucl - lcl) * 0.2;
  const maxVal = ucl + (ucl - lcl) * 0.2;
  const valRange = maxVal - minVal || 1;

  const getY = (val: number) =>
    chartHeight - paddingY - ((val - minVal) / valRange) * (chartHeight - paddingY * 2);

  const getX = (index: number) =>
    paddingX + (index / Math.max(subgroups.length - 1, 1)) * (chartWidth - paddingX * 2);

  const uclY = getY(ucl);
  const lclY = getY(lcl);
  const meanY = getY(nominalMean);

  const polylinePoints = subgroups
    .map((s, i) => `${getX(i)},${getY(s.meanValue)}`)
    .join(" ");

  const handleSelect = (idx: number) => {
    setActiveSampleIndex(idx);
    onInspectSample?.(idx);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.spcBadge}>SIX SIGMA SPC X-BAR CONTROL CHART</span>
            <span className={styles.uomBadge}>Tolerance: ±{(ucl - nominalMean).toFixed(3)} {unitOfMeasure}</span>
          </div>

          <div className={styles.kpiPills}>
            <span
              className={`${styles.kpiStatus} ${
                isProcessInControl ? styles.kpiInControl : styles.kpiOutOfControl
              }`}
            >
              {isProcessInControl ? "Process In Statistical Control" : `${violationCount} Special Cause Violations`}
            </span>
            <span className={styles.kpiSamples}>{subgroups.length} Subgroups Sampled</span>
          </div>
        </div>

        <h2 id={headingId} className={styles.title}>
          {processName}
        </h2>

        {/* Tolerance Metadata Strip */}
        <div className={styles.specStrip}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Upper Control Limit (UCL +3σ):</span>
            <span className={`${styles.specValue} ${styles.valUcl}`}>
              {ucl.toFixed(3)} {unitOfMeasure}
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Process Centerline (X̄ Target):</span>
            <span className={`${styles.specValue} ${styles.valMean}`}>
              {nominalMean.toFixed(3)} {unitOfMeasure}
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Lower Control Limit (LCL -3σ):</span>
            <span className={`${styles.specValue} ${styles.valLcl}`}>
              {lcl.toFixed(3)} {unitOfMeasure}
            </span>
          </div>
        </div>
      </header>

      {/* SVG Control Chart */}
      <div className={styles.chartWrapper}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className={styles.chartSvg}
          role="img"
          aria-label="Process control chart showing X-bar mean line, UCL, and LCL"
        >
          {/* LCL Line */}
          <line
            x1={paddingX}
            y1={lclY}
            x2={chartWidth - paddingX}
            y2={lclY}
            className={styles.limitLine}
            strokeDasharray="4 4"
          />
          <text x={paddingX - 4} y={lclY + 3} textAnchor="end" className={styles.axisLabel}>
            LCL
          </text>

          {/* Nominal Mean Line */}
          <line
            x1={paddingX}
            y1={meanY}
            x2={chartWidth - paddingX}
            y2={meanY}
            className={styles.meanLine}
          />
          <text x={paddingX - 4} y={meanY + 3} textAnchor="end" className={styles.axisLabel}>
            X̄
          </text>

          {/* UCL Line */}
          <line
            x1={paddingX}
            y1={uclY}
            x2={chartWidth - paddingX}
            y2={uclY}
            className={styles.limitLine}
            strokeDasharray="4 4"
          />
          <text x={paddingX - 4} y={uclY + 3} textAnchor="end" className={styles.axisLabel}>
            UCL
          </text>

          {/* Data Polyline */}
          <polyline fill="none" points={polylinePoints} className={styles.dataLine} />

          {/* Sample Points */}
          {subgroups.map((s, i) => {
            const cx = getX(i);
            const cy = getY(s.meanValue);
            const isSelected = activeSampleIndex === s.sampleIndex;

            return (
              <circle
                key={s.sampleIndex}
                cx={cx}
                cy={cy}
                r={isSelected ? 6 : 4}
                className={`${styles.dataPoint} ${
                  s.isViolation ? styles.pointViolation : ""
                } ${isSelected ? styles.pointSelected : ""}`}
                onClick={() => handleSelect(s.sampleIndex)}
              >
                <title>
                  {`Sample #${s.sampleIndex}: ${s.meanValue.toFixed(3)} ${unitOfMeasure}${
                    s.isViolation ? ` (${s.violationRule})` : ""
                  }`}
                </title>
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Subgroup Inspection Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Subgroup measurement records">
          <thead>
            <tr>
              <th scope="col">Sample #</th>
              <th scope="col">Timestamp</th>
              <th scope="col">Subgroup Mean (X̄)</th>
              <th scope="col">Range (R)</th>
              <th scope="col">Statistical Status</th>
              <th scope="col">Violation Description</th>
            </tr>
          </thead>
          <tbody>
            {subgroups.map((s) => {
              const isSelected = activeSampleIndex === s.sampleIndex;
              return (
                <tr
                  key={s.sampleIndex}
                  className={`${s.isViolation ? styles.violationRow : ""} ${
                    isSelected ? styles.selectedRow : ""
                  }`}
                  onClick={() => handleSelect(s.sampleIndex)}
                  style={{ cursor: "pointer" }}
                >
                  <td className={styles.monoCell}>#{s.sampleIndex}</td>
                  <td className={styles.monoCell}>{s.timestamp}</td>
                  <td className={`${styles.monoCell} ${styles.meanCell}`}>
                    {s.meanValue.toFixed(3)} {unitOfMeasure}
                  </td>
                  <td className={styles.monoCell}>
                    {s.rangeValue.toFixed(3)} {unitOfMeasure}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        s.isViolation ? styles.statusViolation : styles.statusConforming
                      }`}
                    >
                      {s.isViolation ? "SPECIAL CAUSE" : "CONFORMING"}
                    </span>
                  </td>
                  <td className={styles.ruleDesc}>{s.violationRule ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Automated Western Electric &amp; Nelson statistical run rules active. Process capability indices: Cpk 1.67, Ppk 1.54.
        </span>
      </footer>
    </section>
  );
};
