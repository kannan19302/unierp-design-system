import React, { useId, useState } from "react";
import styles from "./compensation-band-range-visualizer.module.css";

export interface CompensationPercentiles {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface CompensationBandRecord {
  id: string;
  jobFamily: string;
  jobLevel: string;
  geoZone: string;
  currency: string;
  rangeMin: number;
  rangeMid: number;
  rangeMax: number;
  percentiles: CompensationPercentiles;
  headcount: number;
}

export const defaultCompensationBands: CompensationBandRecord[] = [
  {
    id: "band_swe_l6_z1",
    jobFamily: "Software Engineering",
    jobLevel: "L6 / Staff Principal",
    geoZone: "Tier 1 (SF / NYC / Seattle - 100%)",
    currency: "USD",
    rangeMin: 220000,
    rangeMid: 260000,
    rangeMax: 310000,
    percentiles: {
      p10: 225000,
      p25: 242000,
      p50: 261000,
      p75: 285000,
      p90: 304000,
    },
    headcount: 42,
  },
  {
    id: "band_pm_l5_z1",
    jobFamily: "Product Management",
    jobLevel: "L5 / Senior PM",
    geoZone: "Tier 1 (SF / NYC / Seattle - 100%)",
    currency: "USD",
    rangeMin: 185000,
    rangeMid: 215000,
    rangeMax: 250000,
    percentiles: {
      p10: 190000,
      p25: 202000,
      p50: 216000,
      p75: 232000,
      p90: 247000,
    },
    headcount: 28,
  },
  {
    id: "band_swe_l6_z2",
    jobFamily: "Software Engineering",
    jobLevel: "L6 / Staff Principal",
    geoZone: "Tier 2 (Austin / Denver / Chicago - 88%)",
    currency: "USD",
    rangeMin: 193600,
    rangeMid: 228800,
    rangeMax: 272800,
    percentiles: {
      p10: 198000,
      p25: 213000,
      p50: 229000,
      p75: 251000,
      p90: 268000,
    },
    headcount: 31,
  },
];

export interface CompensationBandRangeVisualizerProps {
  currentOfferOrSalary?: number;
  initialBandId?: string;
  bands?: CompensationBandRecord[];
  onSelectBand?: (bandId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CompensationBandRangeVisualizer: React.FC<CompensationBandRangeVisualizerProps> = ({
  currentOfferOrSalary = 265000,
  initialBandId = "band_swe_l6_z1",
  bands = defaultCompensationBands,
  onSelectBand,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const selectId = useId();
  const [selectedId, setSelectedId] = useState<string>(initialBandId);

  const activeBand: CompensationBandRecord =
    bands.find((b) => b.id === selectedId) || bands[0] || defaultCompensationBands[0]!;

  const handleBandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
    onSelectBand?.(e.target.value);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: activeBand.currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Compa-Ratio = Current / Range Midpoint
  const compaRatio = (currentOfferOrSalary / activeBand.rangeMid) * 100;
  const spreadPercent = ((activeBand.rangeMax - activeBand.rangeMin) / activeBand.rangeMin) * 100;

  // Percentage position of current salary in the min-max range
  const rangeSpan = activeBand.rangeMax - activeBand.rangeMin;
  const rawPosition = ((currentOfferOrSalary - activeBand.rangeMin) / rangeSpan) * 100;
  const clampedPosition = Math.max(2, Math.min(98, rawPosition));
  const midPosition = ((activeBand.rangeMid - activeBand.rangeMin) / rangeSpan) * 100;

  const getCompaClass = (ratio: number) => {
    if (ratio >= 90 && ratio <= 110) return styles.compaHealthy;
    if (ratio < 90) return styles.compaLow;
    return styles.compaHigh;
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badgeRow}>
            <span className={styles.gradeBadge}>{activeBand.jobLevel}</span>
            <span className={styles.geoBadge}>{activeBand.geoZone}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {activeBand.jobFamily} Total Compensation Range
          </h2>
        </div>

        <div className={styles.controls}>
          <label htmlFor={selectId} className={styles.selectLabel}>
            Select Band / Tier:
          </label>
          <select
            id={selectId}
            className={styles.selectInput}
            value={selectedId}
            onChange={handleBandChange}
            aria-label="Select salary band structure"
          >
            {bands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.jobFamily} - {b.jobLevel} ({b.geoZone.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Range Minimum</span>
          <span className={styles.summaryValue}>{formatCurrency(activeBand.rangeMin)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Range Midpoint (P50)</span>
          <span className={styles.summaryValue}>{formatCurrency(activeBand.rangeMid)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Range Maximum</span>
          <span className={styles.summaryValue}>{formatCurrency(activeBand.rangeMax)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Subject Offer / Base</span>
          <span className={styles.summaryValue}>{formatCurrency(currentOfferOrSalary)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Compa-Ratio</span>
          <span className={`${styles.compaPill} ${getCompaClass(compaRatio)}`}>
            {compaRatio.toFixed(1)}%
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Range Spread</span>
          <span className={styles.summaryValue}>{spreadPercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Visualizer Track */}
      <div className={styles.rangeArea}>
        <div
          className={styles.barTrack}
          role="img"
          aria-label={`Visual band track from ${formatCurrency(activeBand.rangeMin)} to ${formatCurrency(
            activeBand.rangeMax
          )} with subject at ${formatCurrency(currentOfferOrSalary)}`}
        >
          <div
            className={styles.bandSegmentMinToMid}
            style={{ width: `${midPosition}%` }}
          />
          <div
            className={styles.bandSegmentMidToMax}
            style={{ width: `${100 - midPosition}%` }}
          />
          <div
            className={styles.midpointMarker}
            style={{ left: `${midPosition}%` }}
            title={`Midpoint: ${formatCurrency(activeBand.rangeMid)}`}
          />
          <div
            className={styles.candidateMarker}
            style={{ left: `${clampedPosition}%` }}
          />
          <div
            className={styles.candidateLabel}
            style={{ left: `${clampedPosition}%` }}
          >
            Subject: {formatCurrency(currentOfferOrSalary)}
          </div>
        </div>

        <div className={styles.scaleRow}>
          <span>Min: {formatCurrency(activeBand.rangeMin)}</span>
          <span>Mid (100%): {formatCurrency(activeBand.rangeMid)}</span>
          <span>Max: {formatCurrency(activeBand.rangeMax)}</span>
        </div>
      </div>

      {/* Market Percentiles Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Radford & Radford Global Survey Percentiles">
          <thead>
            <tr>
              <th scope="col">Survey Benchmark</th>
              <th scope="col">10th Percentile</th>
              <th scope="col">25th Percentile</th>
              <th scope="col">50th (Median)</th>
              <th scope="col">75th Percentile</th>
              <th scope="col">90th Percentile</th>
              <th scope="col">Internal Cohort Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Radford / Carta Global Benchmark</td>
              <td className={styles.monoCell}>{formatCurrency(activeBand.percentiles.p10)}</td>
              <td className={styles.monoCell}>{formatCurrency(activeBand.percentiles.p25)}</td>
              <td className={styles.monoCell}>{formatCurrency(activeBand.percentiles.p50)}</td>
              <td className={styles.monoCell}>{formatCurrency(activeBand.percentiles.p75)}</td>
              <td className={styles.monoCell}>{formatCurrency(activeBand.percentiles.p90)}</td>
              <td>{activeBand.headcount} employees</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span>Compensation Governance &amp; Pay Equity Standard (EO 14035 / EU Pay Transparency Directive).</span>
        <span>Survey Data Cycle: Q3 2026</span>
      </footer>
    </section>
  );
};
