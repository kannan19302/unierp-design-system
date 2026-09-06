import React, { useState, useId, useMemo } from "react";
import styles from "./cash-flow-forecast-waterfall.module.css";

export type CashFlowCategoryType = "opening" | "inflow" | "outflow" | "closing";

export interface CashFlowStepItem {
  id: string;
  name: string;
  category: CashFlowCategoryType;
  amount: number; // positive for inflows & opening, positive absolute for outflows
  varianceFactor?: number; // multiplier applied when sensitivity shifts
  notes?: string;
}

export interface CashFlowForecastWaterfallProps {
  /** Title of the forecast run */
  title?: string;
  /** Currency code */
  currency?: string;
  /** Opening cash balance */
  openingBalance: number;
  /** Cash flow step items */
  items: CashFlowStepItem[];
  /** Minimum required cash liquidity buffer before alert */
  minimumCashBuffer?: number;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const CashFlowForecastWaterfall: React.FC<CashFlowForecastWaterfallProps> = ({
  title = "30-Day Liquidity & Cash Burn Waterfall Forecast",
  currency = "USD",
  openingBalance,
  items,
  minimumCashBuffer = 5000000,
  density = "compact",
  className = "",
}) => {
  const [sensitivityPercent, setSensitivityPercent] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const headingId = useId();

  // Compute waterfall geometry and intermediate balances
  const { steps, finalCash, isBufferBreached } = useMemo(() => {
    let currentBalance = openingBalance;
    const computedSteps: Array<{
      item: CashFlowStepItem;
      startVal: number;
      endVal: number;
      delta: number;
      adjustedAmount: number;
    }> = [];

    // Opening step
    computedSteps.push({
      item: {
        id: "opening-step",
        name: "Opening Liquidity",
        category: "opening",
        amount: openingBalance,
      },
      startVal: 0,
      endVal: openingBalance,
      delta: openingBalance,
      adjustedAmount: openingBalance,
    });

    for (const item of items) {
      let adjAmount = item.amount;
      if (item.category === "inflow") {
        adjAmount = item.amount * (1 + sensitivityPercent / 100);
      } else if (item.category === "outflow") {
        // Outflow increases when collections lag
        adjAmount = item.amount * (1 - (sensitivityPercent / 100) * 0.5);
      }

      const start = currentBalance;
      if (item.category === "inflow") {
        currentBalance += adjAmount;
      } else if (item.category === "outflow") {
        currentBalance -= adjAmount;
      }

      computedSteps.push({
        item,
        startVal: start,
        endVal: currentBalance,
        delta: item.category === "inflow" ? adjAmount : -adjAmount,
        adjustedAmount: adjAmount,
      });
    }

    return {
      steps: computedSteps,
      finalCash: currentBalance,
      isBufferBreached: currentBalance < minimumCashBuffer,
    };
  }, [openingBalance, items, sensitivityPercent, minimumCashBuffer]);

  const maxVal = Math.max(
    ...steps.map((s) => Math.max(s.startVal, s.endVal)),
    minimumCashBuffer,
    1
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedStep = steps.find((s) => s.item.id === selectedItemId) || steps[steps.length - 1];

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
            🌊
          </div>
          <div>
            <h2 id={headingId} className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>
              Deterministic cash bridge modeling receipts, scheduled disbursements, and buffer floors.
            </p>
          </div>
        </div>

        {/* Buffer Alarm Badge */}
        <div className={styles.statusBox}>
          {isBufferBreached ? (
            <span className={styles.alarmBreach}>
              ⚠️ LIQUIDITY ALERT: Below {formatCurrency(minimumCashBuffer)} Buffer
            </span>
          ) : (
            <span className={styles.alarmSafe}>
              ✓ BUFFER SECURE: {formatCurrency(finalCash - minimumCashBuffer)} Headroom
            </span>
          )}
        </div>
      </header>

      {/* Sensitivity Slider Control */}
      <div className={styles.controlsBar}>
        <div className={styles.sliderGroup}>
          <label htmlFor={`${headingId}-sensitivity`} className={styles.sliderLabel}>
            AR Collection Variance Shock:
            <span className={styles.sliderValue}>
              {sensitivityPercent >= 0 ? `+${sensitivityPercent}%` : `${sensitivityPercent}%`}
            </span>
          </label>
          <input
            id={`${headingId}-sensitivity`}
            type="range"
            min="-30"
            max="30"
            step="5"
            value={sensitivityPercent}
            onChange={(e) => setSensitivityPercent(Number(e.target.value))}
            className={styles.rangeInput}
          />
        </div>
        <div className={styles.presetButtons}>
          <button
            type="button"
            className={styles.presetBtn}
            onClick={() => setSensitivityPercent(-15)}
          >
            -15% Recession
          </button>
          <button
            type="button"
            className={styles.presetBtn}
            onClick={() => setSensitivityPercent(0)}
          >
            Baseline
          </button>
          <button
            type="button"
            className={styles.presetBtn}
            onClick={() => setSensitivityPercent(15)}
          >
            +15% Accelerated
          </button>
        </div>
      </div>

      {/* Visual Waterfall Chart Bars */}
      <div className={styles.waterfallCanvas} role="region" aria-label="Cash Waterfall Chart">
        <div
          className={styles.bufferLine}
          style={{ bottom: `${(minimumCashBuffer / maxVal) * 100}%` }}
          title={`Minimum Buffer: ${formatCurrency(minimumCashBuffer)}`}
        >
          <span className={styles.bufferLabel}>Buffer Floor: {formatCurrency(minimumCashBuffer)}</span>
        </div>

        <div className={styles.barsGrid}>
          {steps.map((step) => {
            const isSelected = step.item.id === selectedItemId;
            const bottomPct = (Math.min(step.startVal, step.endVal) / maxVal) * 100;
            const heightPct = (Math.abs(step.endVal - step.startVal) / maxVal) * 100;

            let barColorClass = styles.barOpening;
            if (step.item.category === "inflow") barColorClass = styles.barInflow;
            if (step.item.category === "outflow") barColorClass = styles.barOutflow;

            return (
              <div
                key={step.item.id}
                className={`${styles.barColumn} ${isSelected ? styles.barColumnSelected : ""}`}
                onClick={() => setSelectedItemId(step.item.id)}
              >
                <div className={styles.barValueTop}>
                  {step.item.category === "opening"
                    ? formatCurrency(step.endVal)
                    : `${step.delta >= 0 ? "+" : ""}${formatCurrency(step.delta)}`}
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${barColorClass}`}
                    style={{
                      bottom: `${bottomPct}%`,
                      height: `${Math.max(heightPct, 2)}%`,
                    }}
                  />
                </div>
                <span className={styles.barName} title={step.item.name}>
                  {step.item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Inspector & Table */}
      <div className={styles.bottomLayout}>
        <div className={styles.tableCard}>
          <h3 className={styles.sectionHeading}>Cash Flow Bridge Steps</h3>
          <table className={styles.stepTable}>
            <thead>
              <tr>
                <th>Flow Item</th>
                <th>Category</th>
                <th className={styles.numCol}>Adjusted Value</th>
                <th className={styles.numCol}>Cumulative Balance</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr
                  key={s.item.id}
                  className={s.item.id === selectedItemId ? styles.rowSelected : ""}
                  onClick={() => setSelectedItemId(s.item.id)}
                >
                  <td className={styles.nameCell}>{s.item.name}</td>
                  <td>
                    <span className={`${styles.catChip} ${styles[`cat_${s.item.category}`]}`}>
                      {s.item.category.toUpperCase()}
                    </span>
                  </td>
                  <td
                    className={`${styles.numCol} ${
                      s.delta >= 0 ? styles.positiveText : styles.negativeText
                    }`}
                  >
                    {s.item.category === "opening"
                      ? formatCurrency(s.adjustedAmount)
                      : `${s.delta >= 0 ? "+" : ""}${formatCurrency(s.delta)}`}
                  </td>
                  <td className={`${styles.numCol} ${styles.balanceCell}`}>
                    {formatCurrency(s.endVal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inspection Panel */}
        {selectedStep && (
          <aside className={styles.inspectPanel} aria-label="Step Inspection">
            <h3 className={styles.sectionHeading}>Selected Position Analysis</h3>
            <div className={styles.inspectCard}>
              <h4 className={styles.inspectTitle}>{selectedStep.item.name}</h4>
              <div className={styles.inspectRow}>
                <span className={styles.inspectLabel}>Category:</span>
                <span className={styles.inspectVal}>
                  {selectedStep.item.category.toUpperCase()}
                </span>
              </div>
              <div className={styles.inspectRow}>
                <span className={styles.inspectLabel}>Impact Delta:</span>
                <span
                  className={`${styles.inspectVal} ${
                    selectedStep.delta >= 0 ? styles.positiveText : styles.negativeText
                  }`}
                >
                  {selectedStep.delta >= 0 ? "+" : ""}
                  {formatCurrency(selectedStep.delta)}
                </span>
              </div>
              <div className={styles.inspectRow}>
                <span className={styles.inspectLabel}>Ending Cash:</span>
                <span className={`${styles.inspectVal} ${styles.balanceCell}`}>
                  {formatCurrency(selectedStep.endVal)}
                </span>
              </div>
              <div className={styles.inspectRow}>
                <span className={styles.inspectLabel}>Buffer Headroom:</span>
                <span
                  className={`${styles.inspectVal} ${
                    selectedStep.endVal >= minimumCashBuffer
                      ? styles.positiveText
                      : styles.negativeText
                  }`}
                >
                  {formatCurrency(selectedStep.endVal - minimumCashBuffer)}
                </span>
              </div>
              {selectedStep.item.notes && (
                <p className={styles.inspectNotes}>
                  💡 <em>{selectedStep.item.notes}</em>
                </p>
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
