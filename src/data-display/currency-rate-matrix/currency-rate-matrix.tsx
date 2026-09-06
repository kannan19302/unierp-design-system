"use client";

import {
  useState,
  useMemo,
  type FC,
  type ChangeEvent,
} from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calculator,
  Clock,
  ArrowRight,
  Globe,
  Search,
} from "lucide-react";
import styles from "./currency-rate-matrix.module.css";

export type CurrencyRateDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface ExchangeRateEntry {
  currencyCode: string;
  currencyName: string;
  symbol: string;
  flagEmoji?: string;
  spotRate: number; // e.g. 1 Base = X Foreign
  inverseRate: number; // e.g. 1 Foreign = X Base
  change24h: number; // Percentage, e.g. +0.45 or -1.2
  sourceProvider: string; // e.g. "ECB Fixing", "Bloomberg BFIX", "Fed H.10"
  effectiveTimestamp: string;
  isCustomOverride?: boolean;
}

export interface CurrencyRateMatrixProps {
  /** Functional base currency (default: USD) */
  baseCurrency?: string;
  /** List of foreign exchange currency rates */
  rates: ExchangeRateEntry[];
  /** Callback when refresh or fetch rate fixing is requested */
  onRefreshRates?: () => void;
  /** Callback when a custom FX rate override is edited */
  onRateOverride?: (currencyCode: string, newRate: number) => void;
  /** Density scale */
  density?: CurrencyRateDensity;
  className?: string;
}

/**
 * `<CurrencyRateMatrix>` — High-density foreign exchange rates & multi-currency matrix.
 * Benchmarked against Mercury Banking (#45), SAP S/4HANA FX (#12), and Coupa (#34).
 */
export const CurrencyRateMatrix: FC<CurrencyRateMatrixProps> = ({
  baseCurrency = "USD",
  rates,
  onRefreshRates,
  density = "compact",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    rates[0]?.currencyCode || "EUR"
  );
  const [showCalculator, setShowCalculator] = useState(false);

  const filteredRates = useMemo(() => {
    if (!searchQuery.trim()) return rates;
    const q = searchQuery.toLowerCase();
    return rates.filter(
      (r) =>
        r.currencyCode.toLowerCase().includes(q) ||
        r.currencyName.toLowerCase().includes(q) ||
        r.sourceProvider.toLowerCase().includes(q)
    );
  }, [rates, searchQuery]);

  const activeRateObj = useMemo(
    () => rates.find((r) => r.currencyCode === selectedCurrency) || rates[0],
    [rates, selectedCurrency]
  );

  const convertedValue = useMemo(() => {
    if (!activeRateObj) return 0;
    return calcAmount * activeRateObj.spotRate;
  }, [calcAmount, activeRateObj]);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCalcAmount(isNaN(val) ? 0 : val);
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Currency Rate Matrix"
    >
      {/* ── Header Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.baseInfo}>
          <Globe size={16} className={styles.globeIcon} aria-hidden="true" />
          <span className={styles.baseLabel}>Base Currency:</span>
          <span className={styles.baseBadge}>{baseCurrency}</span>
        </div>

        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search currency code, name, provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter currency rates"
          />
        </div>

        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={`${styles.toolBtn} ${showCalculator ? styles.toolBtnActive : ""}`}
            onClick={() => setShowCalculator((prev) => !prev)}
            aria-pressed={showCalculator}
            title="Toggle Quick FX Calculator"
          >
            <Calculator size={14} aria-hidden="true" />
            <span>FX Calculator</span>
          </button>

          {onRefreshRates && (
            <button
              type="button"
              className={styles.toolBtn}
              onClick={onRefreshRates}
              title="Refresh Rate Fixings"
              aria-label="Refresh Rate Fixings"
            >
              <RefreshCw size={14} aria-hidden="true" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Inline Calculator Ribbon (Collapsible) ── */}
      {showCalculator && activeRateObj && (
        <div className={styles.calcBar}>
          <div className={styles.calcInputGroup}>
            <span className={styles.calcLabel}>{baseCurrency}</span>
            <input
              type="number"
              className={styles.calcInput}
              value={calcAmount}
              onChange={handleAmountChange}
              aria-label={`Amount in ${baseCurrency}`}
            />
          </div>

          <ArrowRight size={16} className={styles.calcArrow} aria-hidden="true" />

          <div className={styles.calcInputGroup}>
            <select
              className={styles.calcSelect}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              aria-label="Select Target Foreign Currency"
            >
              {rates.map((r) => (
                <option key={r.currencyCode} value={r.currencyCode}>
                  {r.currencyCode} ({r.symbol}) - {r.currencyName}
                </option>
              ))}
            </select>
            <span className={styles.calcResult}>
              {activeRateObj.symbol} {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
          </div>

          <span className={styles.calcRateNote}>
            1 {baseCurrency} = {activeRateObj.spotRate.toFixed(4)} {activeRateObj.currencyCode}
          </span>
        </div>
      )}

      {/* ── High-Density Rate Table ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Currency</th>
              <th scope="col" className={styles.numericCol}>Spot Rate (1 {baseCurrency})</th>
              <th scope="col" className={styles.numericCol}>Inverse Rate</th>
              <th scope="col" className={styles.numericCol}>24h Delta</th>
              <th scope="col">Benchmark Source</th>
              <th scope="col">Effective Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredRates.map((rate) => {
              const isPositive = rate.change24h >= 0;
              return (
                <tr
                  key={rate.currencyCode}
                  className={styles.row}
                  onClick={() => setSelectedCurrency(rate.currencyCode)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCurrency(rate.currencyCode);
                    }
                  }}
                  role="row"
                >
                  <td className={styles.currencyCell}>
                    <div className={styles.currencyGroup}>
                      {rate.flagEmoji && <span className={styles.flag}>{rate.flagEmoji}</span>}
                      <span className={styles.code}>{rate.currencyCode}</span>
                      <span className={styles.name}>{rate.currencyName}</span>
                    </div>
                  </td>
                  <td className={`${styles.numericCol} ${styles.rateCell}`}>
                    {rate.spotRate.toFixed(4)}
                  </td>
                  <td className={`${styles.numericCol} ${styles.inverseCell}`}>
                    {rate.inverseRate.toFixed(6)}
                  </td>
                  <td className={`${styles.numericCol} ${styles.deltaCell}`}>
                    <span
                      className={`${styles.deltaBadge} ${
                        isPositive ? styles.deltaPositive : styles.deltaNegative
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp size={11} aria-hidden="true" />
                      ) : (
                        <TrendingDown size={11} aria-hidden="true" />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {rate.change24h.toFixed(2)}%
                      </span>
                    </span>
                  </td>
                  <td className={styles.sourceCell}>
                    <span className={styles.providerTag}>{rate.sourceProvider}</span>
                  </td>
                  <td className={styles.timeCell}>
                    <div className={styles.timeGroup}>
                      <Clock size={11} className={styles.timeIcon} aria-hidden="true" />
                      <span>{rate.effectiveTimestamp}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
