import React, { useState, useId, useMemo } from "react";
import styles from "./payment-run-cockpit.module.css";

export type PaymentRail = "ach" | "sepa" | "wire" | "virtual_card" | "check";

export interface PayableInvoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  currency: string;
  dueDate: string;
  discountAvailable?: number;
  rail: PaymentRail;
  bankAccountMasked: string;
  riskScore: number; // 0-100 (higher = riskier)
}

export interface PaymentRunCockpitProps {
  /** Identifier of the payment run batch */
  runBatchId?: string;
  /** Title of the payment run */
  title?: string;
  /** Invoices eligible for this payment run */
  invoices: PayableInvoice[];
  /** Cutoff timestamp or remaining string */
  executionCutoff?: string;
  /** Callback fired when user executes batch payments */
  onExecutePaymentRun?: (selectedInvoiceIds: string[], rail: PaymentRail | "all") => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const PaymentRunCockpit: React.FC<PaymentRunCockpitProps> = ({
  runBatchId = "PR-2026-0906-01",
  title = "Commercial Accounts Payable Execution Run",
  invoices,
  executionCutoff = "Today at 16:30 EST (Bank Wire Window)",
  onExecutePaymentRun,
  density = "compact",
  className = "",
}) => {
  const [selectedRail, setSelectedRail] = useState<PaymentRail | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(invoices.map((inv) => inv.id))
  );
  const headingId = useId();

  const filteredInvoices = useMemo(() => {
    if (selectedRail === "all") return invoices;
    return invoices.filter((inv) => inv.rail === selectedRail);
  }, [invoices, selectedRail]);

  const summary = useMemo(() => {
    let totalGross = 0;
    let totalDiscount = 0;
    let maxRisk = 0;

    for (const inv of invoices) {
      if (selectedIds.has(inv.id)) {
        totalGross += inv.amount;
        totalDiscount += inv.discountAvailable || 0;
        if (inv.riskScore > maxRisk) maxRisk = inv.riskScore;
      }
    }

    return {
      selectedCount: selectedIds.size,
      totalGross,
      totalNet: totalGross - totalDiscount,
      totalDiscount,
      maxRisk,
    };
  }, [invoices, selectedIds]);

  const toggleInvoice = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredInvoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInvoices.map((i) => i.id)));
    }
  };

  const formatCurrency = (val: number, cur: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getRailBadge = (rail: PaymentRail) => {
    switch (rail) {
      case "ach":
        return "ACH NACHA";
      case "sepa":
        return "SEPA Instant";
      case "wire":
        return "SWIFT / Fedwire";
      case "virtual_card":
        return "Virtual Card (1.5% Rebate)";
      case "check":
        return "Paper Check Lockbox";
    }
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Cockpit Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.batchTag} aria-hidden="true">
            💳
          </div>
          <div>
            <div className={styles.runIdRow}>
              <span className={styles.batchCode}>{runBatchId}</span>
              <span className={styles.statusPill}>PENDING AUTHORIZATION</span>
            </div>
            <h2 id={headingId} className={styles.title}>{title}</h2>
          </div>
        </div>

        <div className={styles.cutoffBox}>
          <span className={styles.cutoffLabel}>Execution Cutoff Window</span>
          <span className={styles.cutoffValue}>⏱️ {executionCutoff}</span>
        </div>
      </header>

      {/* KPI Metrics Strip */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Selected Invoices</span>
          <span className={styles.kpiValue}>
            {summary.selectedCount} / {invoices.length}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Gross Disbursement</span>
          <span className={styles.kpiValue}>{formatCurrency(summary.totalGross)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Cash Discounts Captured</span>
          <span className={`${styles.kpiValue} ${styles.discountText}`}>
            +{formatCurrency(summary.totalDiscount)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Net Settlement Value</span>
          <span className={`${styles.kpiValue} ${styles.netValue}`}>
            {formatCurrency(summary.totalNet)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Max Anomaly Risk</span>
          <span
            className={`${styles.kpiValue} ${
              summary.maxRisk > 50 ? styles.riskHigh : styles.riskLow
            }`}
          >
            {summary.maxRisk}/100 {summary.maxRisk > 50 ? "⚠️ Elevated" : "✓ Low"}
          </span>
        </div>
      </div>

      {/* Payment Rail Filter Selector */}
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Filter Payment Rail:</span>
        <div className={styles.railButtons} role="radiogroup" aria-label="Filter by payment rail">
          {(["all", "wire", "ach", "sepa", "virtual_card", "check"] as const).map((rail) => (
            <button
              key={rail}
              type="button"
              role="radio"
              aria-checked={selectedRail === rail}
              className={`${styles.railBtn} ${
                selectedRail === rail ? styles.railBtnActive : ""
              }`}
              onClick={() => setSelectedRail(rail)}
            >
              {rail === "all" ? "All Rails" : rail.toUpperCase().replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th className={styles.checkboxTh}>
                <input
                  type="checkbox"
                  aria-label="Select all invoices in view"
                  checked={
                    filteredInvoices.length > 0 &&
                    filteredInvoices.every((inv) => selectedIds.has(inv.id))
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Invoice #</th>
              <th>Vendor & Beneficiary</th>
              <th>Payment Rail</th>
              <th>Bank Account</th>
              <th>Due Date</th>
              <th className={styles.numberCell}>Gross Amount</th>
              <th className={styles.numberCell}>Early Discount</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => {
              const isSelected = selectedIds.has(inv.id);
              return (
                <tr
                  key={inv.id}
                  className={isSelected ? styles.rowSelected : ""}
                  onClick={() => toggleInvoice(inv.id)}
                >
                  <td
                    className={styles.checkboxTd}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      aria-label={`Select invoice ${inv.invoiceNumber} for ${inv.vendorName}`}
                      checked={isSelected}
                      onChange={() => toggleInvoice(inv.id)}
                    />
                  </td>
                  <td className={styles.invoiceNumCell}>{inv.invoiceNumber}</td>
                  <td className={styles.vendorCell}>{inv.vendorName}</td>
                  <td>
                    <span className={styles.railChip}>{getRailBadge(inv.rail)}</span>
                  </td>
                  <td className={styles.monoCell}>{inv.bankAccountMasked}</td>
                  <td>{inv.dueDate}</td>
                  <td className={`${styles.numberCell} ${styles.monoCell}`}>
                    {formatCurrency(inv.amount, inv.currency)}
                  </td>
                  <td className={`${styles.numberCell} ${styles.discountCell}`}>
                    {inv.discountAvailable
                      ? `-${formatCurrency(inv.discountAvailable, inv.currency)}`
                      : "—"}
                  </td>
                  <td>
                    <span
                      className={`${styles.riskBadge} ${
                        inv.riskScore > 50 ? styles.riskBadgeWarn : styles.riskBadgeOk
                      }`}
                    >
                      {inv.riskScore}/100
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Execution Bar */}
      <footer className={styles.footer}>
        <div className={styles.footerNote}>
          🔒 Authorized payments undergo real-time ISO 20022 XML generation and dual-control cryptographic signature.
        </div>
        <button
          type="button"
          disabled={summary.selectedCount === 0}
          className={styles.executeButton}
          onClick={() => onExecutePaymentRun?.(Array.from(selectedIds), selectedRail)}
        >
          Authorize &amp; Transmit Batch ({summary.selectedCount} Payments • {formatCurrency(summary.totalNet)})
        </button>
      </footer>
    </section>
  );
};
