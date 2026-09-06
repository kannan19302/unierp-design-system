import React, { useState, useId, useMemo } from "react";
import styles from "./tax-engine-breakdown-table.module.css";

export type JurisdictionLevel = "country" | "state" | "county" | "city" | "special_district";
export type ExemptionStatus = "none" | "verified" | "pending_review" | "expired";

export interface TaxLineItem {
  id: string;
  jurisdictionName: string;
  jurisdictionCode: string;
  level: JurisdictionLevel;
  taxableBase: number;
  ratePercent: number; // e.g. 6.25 for 6.25%
  calculatedTax: number;
  isReverseCharge?: boolean;
  exemptionStatus: ExemptionStatus;
  certificateNumber?: string;
  isOverridden?: boolean;
  overrideReason?: string;
}

export interface TaxEngineBreakdownTableProps {
  /** Title of the tax determination report */
  title?: string;
  /** Currency code */
  currency?: string;
  /** Invoice or transaction reference */
  transactionRef?: string;
  /** Tax line items */
  lineItems: TaxLineItem[];
  /** Callback fired when an override is submitted */
  onTaxOverride?: (lineId: string, newRate: number, reason: string) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const TaxEngineBreakdownTable: React.FC<TaxEngineBreakdownTableProps> = ({
  title = "Multi-Jurisdictional Tax Determination Schedule",
  currency = "USD",
  transactionRef = "TXN-2026-90412",
  lineItems,
  onTaxOverride,
  density = "compact",
  className = "",
}) => {
  const [items, setItems] = useState<TaxLineItem[]>(lineItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [overrideRateInput, setOverrideRateInput] = useState<string>("");
  const [overrideReasonInput, setOverrideReasonInput] = useState<string>("");
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const headingId = useId();

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];

  const summary = useMemo(() => {
    let totalBase = 0;
    let totalTax = 0;
    let totalExempt = 0;

    for (const item of items) {
      if (item.exemptionStatus === "verified") {
        totalExempt += item.taxableBase;
      } else {
        totalBase += item.taxableBase;
        totalTax += item.calculatedTax;
      }
    }

    const effectiveRate = totalBase > 0 ? (totalTax / totalBase) * 100 : 0;

    return {
      totalBase,
      totalTax,
      totalExempt,
      effectiveRate,
    };
  }, [items]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getLevelBadgeClass = (lvl: JurisdictionLevel) => {
    switch (lvl) {
      case "country":
        return styles.levelCountry;
      case "state":
        return styles.levelState;
      case "county":
        return styles.levelCounty;
      case "city":
        return styles.levelCity;
      case "special_district":
        return styles.levelSpecial;
    }
  };

  const handleOpenOverride = (item: TaxLineItem) => {
    setSelectedItemId(item.id);
    setOverrideRateInput(String(item.ratePercent));
    setOverrideReasonInput(item.overrideReason || "");
    setIsOverrideModalOpen(true);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    const newRate = parseFloat(overrideRateInput);
    if (isNaN(newRate)) return;

    const updated = items.map((item) => {
      if (item.id === selectedItemId) {
        const newTax = (item.taxableBase * newRate) / 100;
        return {
          ...item,
          ratePercent: newRate,
          calculatedTax: newTax,
          isOverridden: true,
          overrideReason: overrideReasonInput,
        };
      }
      return item;
    });

    setItems(updated);
    setIsOverrideModalOpen(false);
    onTaxOverride?.(selectedItemId, newRate, overrideReasonInput);
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
            🏛️
          </div>
          <div>
            <div className={styles.refRow}>
              <span className={styles.refCode}>{transactionRef}</span>
              <span className={styles.nexusPill}>TAX NEXUS DETERMINED</span>
            </div>
            <h2 id={headingId} className={styles.title}>{title}</h2>
          </div>
        </div>

        <div className={styles.rateHighlight}>
          <span className={styles.rateLabel}>Effective Blended Tax Rate</span>
          <span className={styles.rateValue}>{summary.effectiveRate.toFixed(3)}%</span>
        </div>
      </header>

      {/* KPI Metrics */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Taxable Base</span>
          <span className={styles.kpiValue}>{formatCurrency(summary.totalBase)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Exempted Sales Amount</span>
          <span className={`${styles.kpiValue} ${styles.exemptValue}`}>
            {formatCurrency(summary.totalExempt)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Calculated Tax</span>
          <span className={`${styles.kpiValue} ${styles.taxValue}`}>
            {formatCurrency(summary.totalTax)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Gross Transaction</span>
          <span className={styles.kpiValue}>
            {formatCurrency(summary.totalBase + summary.totalTax + summary.totalExempt)}
          </span>
        </div>
      </div>

      {/* Tax Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.taxTable}>
          <thead>
            <tr>
              <th>Jurisdiction</th>
              <th>Level</th>
              <th>Exemption / Certificate</th>
              <th className={styles.numCol}>Taxable Base</th>
              <th className={styles.numCol}>Tax Rate</th>
              <th className={styles.numCol}>Tax Amount</th>
              <th className={styles.actionCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={item.id === selectedItemId ? styles.selectedRow : ""}>
                <td>
                  <div className={styles.jurisdictionCell}>
                    <span className={styles.jurisdictionName}>{item.jurisdictionName}</span>
                    <span className={styles.jurisdictionCode}>{item.jurisdictionCode}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.levelBadge} ${getLevelBadgeClass(item.level)}`}>
                    {item.level.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td>
                  {item.exemptionStatus !== "none" ? (
                    <div className={styles.exemptionInfo}>
                      <span className={`${styles.exemptBadge} ${styles[`exempt_${item.exemptionStatus}`]}`}>
                        {item.exemptionStatus.replace("_", " ").toUpperCase()}
                      </span>
                      {item.certificateNumber && (
                        <span className={styles.certNum}>Cert #{item.certificateNumber}</span>
                      )}
                    </div>
                  ) : (
                    <span className={styles.taxableText}>Taxable</span>
                  )}
                </td>
                <td className={`${styles.numCol} ${styles.monoCol}`}>
                  {formatCurrency(item.taxableBase)}
                </td>
                <td className={`${styles.numCol} ${styles.monoCol}`}>
                  {item.ratePercent.toFixed(3)}%
                  {item.isOverridden && (
                    <span className={styles.overrideTag} title={item.overrideReason}>
                      OVERRIDDEN
                    </span>
                  )}
                </td>
                <td className={`${styles.numCol} ${styles.monoCol} ${styles.taxAmountCell}`}>
                  {item.exemptionStatus === "verified"
                    ? "$0.00 (Exempt)"
                    : formatCurrency(item.calculatedTax)}
                </td>
                <td className={styles.actionCol}>
                  <button
                    type="button"
                    className={styles.overrideBtn}
                    onClick={() => handleOpenOverride(item)}
                  >
                    Override Rate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Override Dialog / Sheet */}
      {isOverrideModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="override-dialog-title">
          <div className={styles.modalCard}>
            <h3 id="override-dialog-title" className={styles.modalTitle}>
              Manual Tax Rate Override: {selectedItem?.jurisdictionName}
            </h3>
            <p className={styles.modalDesc}>
              Tax rate overrides trigger immutable audit logging and require statutory justification.
            </p>

            <form onSubmit={handleSaveOverride} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="tax-override-rate" className={styles.formLabel}>
                  New Tax Rate (%):
                </label>
                <input
                  id="tax-override-rate"
                  type="number"
                  step="0.001"
                  required
                  value={overrideRateInput}
                  onChange={(e) => setOverrideRateInput(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tax-override-reason" className={styles.formLabel}>
                  Audit Exemption / Justification Reason:
                </label>
                <textarea
                  id="tax-override-reason"
                  required
                  rows={3}
                  value={overrideReasonInput}
                  onChange={(e) => setOverrideReasonInput(e.target.value)}
                  placeholder="e.g. Enterprise economic development zone statutory abatement #991-A"
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsOverrideModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Apply Tax Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
