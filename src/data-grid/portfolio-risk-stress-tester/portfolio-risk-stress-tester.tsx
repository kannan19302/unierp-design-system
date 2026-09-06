import React, { useId, useState } from "react";
import styles from "./portfolio-risk-stress-tester.module.css";

export interface AssetClassImpact {
  id: string;
  assetClass: string;
  currentWeight: number;
  currentValue: number;
  scenarioReturnPct: number;
  pnlImpact: number;
  durationOrBeta: string;
  liquidityTier: "HIGH" | "MEDIUM" | "ILLIQUID";
}

export interface VaRStressScenario {
  id: string;
  scenarioName: string;
  description: string;
  portfolioPnlLoss: number;
  portfolioLossPct: number;
  var95: number;
  cvar99: number;
  capitalAdequacyRatio: number;
  assetImpacts: AssetClassImpact[];
}

export const defaultStressScenarios: VaRStressScenario[] = [
  {
    id: "gfc_2008",
    scenarioName: "2008 Global Financial Crisis (Lehman Shock)",
    description: "Equities plunge 40%, high-yield credit spreads blow out +600bps, treasury yields drop.",
    portfolioPnlLoss: -142500000,
    portfolioLossPct: -14.25,
    var95: -24500000,
    cvar99: -41200000,
    capitalAdequacyRatio: 14.8,
    assetImpacts: [
      {
        id: "ast_eq",
        assetClass: "Global Equities (Developed)",
        currentWeight: 45,
        currentValue: 450000000,
        scenarioReturnPct: -26.4,
        pnlImpact: -118800000,
        durationOrBeta: "Beta: 1.08",
        liquidityTier: "HIGH",
      },
      {
        id: "ast_cr",
        assetClass: "Investment Grade Corporate Credit",
        currentWeight: 30,
        currentValue: 300000000,
        scenarioReturnPct: -8.5,
        pnlImpact: -25500000,
        durationOrBeta: "Dur: 7.2y",
        liquidityTier: "MEDIUM",
      },
      {
        id: "ast_ust",
        assetClass: "US Sovereign Treasuries",
        currentWeight: 15,
        currentValue: 150000000,
        scenarioReturnPct: 5.2,
        pnlImpact: 7800000,
        durationOrBeta: "Dur: 8.4y",
        liquidityTier: "HIGH",
      },
      {
        id: "ast_em",
        assetClass: "Emerging Market Debt & Currencies",
        currentWeight: 10,
        currentValue: 100000000,
        scenarioReturnPct: -16.0,
        pnlImpact: -16000000,
        durationOrBeta: "Beta: 1.25",
        liquidityTier: "ILLIQUID",
      },
    ],
  },
  {
    id: "rate_shock_300",
    scenarioName: "Federal Reserve Rate Shock (+300 bps)",
    description: "Aggressive monetary tightening with parallel 300bps yield curve upward shift.",
    portfolioPnlLoss: -86000000,
    portfolioLossPct: -8.6,
    var95: -18200000,
    cvar99: -28900000,
    capitalAdequacyRatio: 16.2,
    assetImpacts: [
      {
        id: "ast_eq",
        assetClass: "Global Equities (Developed)",
        currentWeight: 45,
        currentValue: 450000000,
        scenarioReturnPct: -11.2,
        pnlImpact: -50400000,
        durationOrBeta: "Beta: 0.95",
        liquidityTier: "HIGH",
      },
      {
        id: "ast_cr",
        assetClass: "Investment Grade Corporate Credit",
        currentWeight: 30,
        currentValue: 300000000,
        scenarioReturnPct: -14.6,
        pnlImpact: -43800000,
        durationOrBeta: "Dur: 7.2y",
        liquidityTier: "MEDIUM",
      },
      {
        id: "ast_ust",
        assetClass: "US Sovereign Treasuries",
        currentWeight: 15,
        currentValue: 150000000,
        scenarioReturnPct: -18.2,
        pnlImpact: -27300000,
        durationOrBeta: "Dur: 8.4y",
        liquidityTier: "HIGH",
      },
      {
        id: "ast_em",
        assetClass: "Emerging Market Debt & Currencies",
        currentWeight: 10,
        currentValue: 100000000,
        scenarioReturnPct: 3.5,
        pnlImpact: 3500000,
        durationOrBeta: "Beta: 0.72",
        liquidityTier: "ILLIQUID",
      },
    ],
  },
];

export interface PortfolioRiskStressTesterProps {
  portfolioName?: string;
  totalAum?: number;
  initialScenarioId?: string;
  scenarios?: VaRStressScenario[];
  onSelectScenario?: (scenarioId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const PortfolioRiskStressTester: React.FC<PortfolioRiskStressTesterProps> = ({
  portfolioName = "Global Multi-Asset Institutional Flagship",
  totalAum = 1000000000,
  initialScenarioId = "gfc_2008",
  scenarios = defaultStressScenarios,
  onSelectScenario,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const selectId = useId();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId);

  const activeScenario: VaRStressScenario =
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0] || defaultStressScenarios[0]!;

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedScenarioId(e.target.value);
    onSelectScenario?.(e.target.value);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.portfolioMeta}>
            <span className={styles.modelBadge}>Basel III / Dodd-Frank Stress Engine</span>
            <span className={styles.portfolioName}>{portfolioName}</span>
            <span className={styles.aumText}>Total AUM: {formatCurrency(totalAum)}</span>
          </div>

          <div className={styles.scenarioControls}>
            <label htmlFor={selectId} className={styles.selectLabel}>
              Macro Scenario:
            </label>
            <select
              id={selectId}
              className={styles.selectInput}
              value={selectedScenarioId}
              onChange={handleScenarioChange}
              aria-label="Select macro stress testing scenario"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.scenarioName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Portfolio Value-at-Risk &amp; Factor Shock Simulation
          </h2>
          <span className={styles.scenarioDescription}>{activeScenario.description}</span>
        </div>
      </header>

      {/* Risk Metrics Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Scenario P&amp;L Impact</span>
          <span className={`${styles.kpiValue} ${styles.lossValue}`}>
            {formatCurrency(activeScenario.portfolioPnlLoss)} ({activeScenario.portfolioLossPct.toFixed(2)}%)
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Historical 95% 1-Day VaR</span>
          <span className={styles.kpiValue}>{formatCurrency(activeScenario.var95)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Parametric 99% CVaR</span>
          <span className={styles.kpiValue}>{formatCurrency(activeScenario.cvar99)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Post-Shock Capital Adequacy</span>
          <span className={`${styles.kpiValue} ${styles.safeValue}`}>
            {activeScenario.capitalAdequacyRatio.toFixed(1)}% (Tier 1 &gt; 8%)
          </span>
        </div>
      </div>

      {/* Asset Breakdown Data Grid */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Asset Class Factor Shock Breakdown">
          <thead>
            <tr>
              <th scope="col">Asset Class / Sub-Strategy</th>
              <th scope="col">Allocation</th>
              <th scope="col">Exposure (USD)</th>
              <th scope="col">Shock Return %</th>
              <th scope="col">Simulated P&amp;L</th>
              <th scope="col">Risk Sensitivity</th>
              <th scope="col">Liquidity Tier</th>
            </tr>
          </thead>
          <tbody>
            {activeScenario.assetImpacts.map((item) => (
              <tr key={item.id}>
                <td className={styles.assetCell}>{item.assetClass}</td>
                <td className={styles.monoCell}>{item.currentWeight}%</td>
                <td className={styles.monoCell}>{formatCurrency(item.currentValue)}</td>
                <td
                  className={
                    item.scenarioReturnPct >= 0
                      ? styles.positiveImpact
                      : styles.negativeImpact
                  }
                >
                  {item.scenarioReturnPct >= 0 ? `+${item.scenarioReturnPct.toFixed(1)}%` : `${item.scenarioReturnPct.toFixed(1)}%`}
                </td>
                <td
                  className={
                    item.pnlImpact >= 0
                      ? styles.positiveImpact
                      : styles.negativeImpact
                  }
                >
                  {formatCurrency(item.pnlImpact)}
                </td>
                <td className={styles.monoCell}>{item.durationOrBeta}</td>
                <td>
                  <span
                    className={`${styles.severityPill} ${
                      item.liquidityTier === "HIGH"
                        ? styles.severityLow
                        : item.liquidityTier === "MEDIUM"
                        ? styles.severityModerate
                        : styles.severityCritical
                    }`}
                  >
                    {item.liquidityTier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span>MSCI Barra Factor Risk / Aladdin Monte Carlo 10,000 Iteration Engine.</span>
        <span>Confidence Interval: 99.0% | Horizon: 10 Trading Days</span>
      </footer>
    </section>
  );
};
