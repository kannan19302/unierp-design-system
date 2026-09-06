import React, { useId, useState } from "react";
import styles from "./cam-expense-reconciliation-ledger.module.css";

export interface PropertySpecification {
  id: string; // "prop_one_financial_01"
  propertyName: string; // "One Financial Center, Boston"
  tenantName: string; // "Deloitte Global Services LLC"
  suiteNumber: string; // "Suite 2400"
  leasedAreaSqFt: number; // 45000
  buildingGrossLeasableSqFt: number; // 600000
  proRataSharePercent: number; // 7.50
  fiscalYear: number; // 2025
}

export interface CamExpenseItem {
  id: string; // "cam_exp_hvac_01"
  expenseCategory: string; // "HVAC Operations & Maintenance"
  annualBudgetUsd: number; // 450000.00
  actualExpenseUsd: number; // 472500.00
  varianceUsd: number; // 22500.00
  tenantShareEstimatedUsd: number; // 33750.00
  tenantShareActualUsd: number; // 35437.50
  reconciliationDueUsd: number; // 1687.50 (positive = tenant owes)
}

export interface CamExpenseReconciliationLedgerProps {
  property: PropertySpecification;
  expenseCategories: CamExpenseItem[];
  onApproveReconciliation?: (propertyId: string, netAdjustmentUsd: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CamExpenseReconciliationLedger: React.FC<CamExpenseReconciliationLedgerProps> = ({
  property,
  expenseCategories,
  onApproveReconciliation,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  const totalBudget = expenseCategories.reduce((acc, c) => acc + c.annualBudgetUsd, 0);
  const totalActual = expenseCategories.reduce((acc, c) => acc + c.actualExpenseUsd, 0);
  const totalTenantEstimated = expenseCategories.reduce(
    (acc, c) => acc + c.tenantShareEstimatedUsd,
    0
  );
  const totalTenantActual = expenseCategories.reduce(
    (acc, c) => acc + c.tenantShareActualUsd,
    0
  );
  const netReconciliationDue = expenseCategories.reduce(
    (acc, c) => acc + c.reconciliationDueUsd,
    0
  );

  const handleApprove = () => {
    setIsApproved(true);
    onApproveReconciliation?.(property.id, netReconciliationDue);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeRow}>
            <span className={styles.creBadge}>CRE ASSET MANAGEMENT &amp; LEASE AUDIT</span>
            <span className={styles.yearBadge}>FY {property.fiscalYear} TRUE-UP</span>
          </div>
          <div className={styles.shareBadge}>
            Tenant Pro-Rata Share:{" "}
            <strong>{property.proRataSharePercent.toFixed(2)}%</strong> ({property.leasedAreaSqFt.toLocaleString()} / {property.buildingGrossLeasableSqFt.toLocaleString()} RSF)
          </div>
        </div>

        <div className={styles.titleRow}>
          <div>
            <h2 id={headingId} className={styles.title}>
              Common Area Maintenance (CAM) Expense Reconciliation
            </h2>
            <div className={styles.subTitle}>
              {property.propertyName} • {property.tenantName} ({property.suiteNumber})
            </div>
          </div>

          <button
            type="button"
            className={styles.approveBtn}
            onClick={handleApprove}
            disabled={isApproved}
            aria-label="Approve CAM Reconciliation True-Up Statement"
          >
            {isApproved ? "True-Up Approved & Invoiced" : "Approve CAM True-Up"}
          </button>
        </div>
      </header>

      {/* Summary KPI Strip */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Building Budget</span>
          <span className={styles.kpiValue}>{formatCurrency(totalBudget)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Building Actuals</span>
          <span className={styles.kpiValue}>{formatCurrency(totalActual)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Tenant Billed to Date</span>
          <span className={styles.kpiValue}>{formatCurrency(totalTenantEstimated)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Tenant Pro-Rata Obligation</span>
          <span className={styles.kpiValue}>{formatCurrency(totalTenantActual)}</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiCardHighlight}`}>
          <span className={styles.kpiLabel}>Net True-Up Adjustment</span>
          <span
            className={`${styles.kpiValue} ${
              netReconciliationDue >= 0 ? styles.duePositive : styles.dueRefund
            }`}
          >
            {netReconciliationDue >= 0 ? "+" : ""}
            {formatCurrency(netReconciliationDue)}
          </span>
          <span className={styles.kpiSubtext}>
            {netReconciliationDue >= 0 ? "Tenant Owes Landlord" : "Tenant Credit / Refund Due"}
          </span>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="CAM expense category breakdown">
          <thead>
            <tr>
              <th scope="col">Expense Category</th>
              <th scope="col">Building Budget</th>
              <th scope="col">Building Actual</th>
              <th scope="col">Gross Variance</th>
              <th scope="col">Tenant Estimated</th>
              <th scope="col">Tenant Actual ({property.proRataSharePercent.toFixed(2)}%)</th>
              <th scope="col">Reconciliation Balance</th>
            </tr>
          </thead>
          <tbody>
            {expenseCategories.map((item) => {
              const isOwed = item.reconciliationDueUsd >= 0;
              return (
                <tr key={item.id}>
                  <td className={styles.categoryName}>{item.expenseCategory}</td>
                  <td className={styles.monoCell}>{formatCurrency(item.annualBudgetUsd)}</td>
                  <td className={styles.monoCell}>{formatCurrency(item.actualExpenseUsd)}</td>
                  <td
                    className={`${styles.monoCell} ${
                      item.varianceUsd > 0 ? styles.varianceOver : styles.varianceUnder
                    }`}
                  >
                    {item.varianceUsd > 0 ? "+" : ""}
                    {formatCurrency(item.varianceUsd)}
                  </td>
                  <td className={styles.monoCell}>
                    {formatCurrency(item.tenantShareEstimatedUsd)}
                  </td>
                  <td className={styles.monoCell}>
                    {formatCurrency(item.tenantShareActualUsd)}
                  </td>
                  <td
                    className={`${styles.monoCell} ${styles.balanceCell} ${
                      isOwed ? styles.balanceOwed : styles.balanceCredit
                    }`}
                  >
                    {isOwed ? "+" : ""}
                    {formatCurrency(item.reconciliationDueUsd)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td>Total Reconciled CAM</td>
              <td className={styles.monoCell}>{formatCurrency(totalBudget)}</td>
              <td className={styles.monoCell}>{formatCurrency(totalActual)}</td>
              <td className={styles.monoCell}>
                {totalActual - totalBudget >= 0 ? "+" : ""}
                {formatCurrency(totalActual - totalBudget)}
              </td>
              <td className={styles.monoCell}>{formatCurrency(totalTenantEstimated)}</td>
              <td className={styles.monoCell}>{formatCurrency(totalTenantActual)}</td>
              <td
                className={`${styles.monoCell} ${styles.balanceCell} ${
                  netReconciliationDue >= 0 ? styles.balanceOwed : styles.balanceCredit
                }`}
              >
                {netReconciliationDue >= 0 ? "+" : ""}
                {formatCurrency(netReconciliationDue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Calculated in accordance with BOMA Standard Method for Measuring Floor Area and Lease Section 4.2 Operating Expenses.
        </span>
      </footer>
    </section>
  );
};
