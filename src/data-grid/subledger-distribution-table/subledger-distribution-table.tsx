"use client";

import {
  useState,
  useMemo,
  type FC,
  type ChangeEvent,
} from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Scale,
  Sparkles,
} from "lucide-react";
import styles from "./subledger-distribution-table.module.css";

export type DistributionDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface AccountOption {
  id: string;
  code: string;
  name: string;
}

export interface DistributionRow {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  subsidiary?: string;
  department?: string;
  costCenter?: string;
  projectCode?: string;
  memo?: string;
}

export interface SubledgerDistributionTableProps {
  /** Initial row items */
  initialRows?: DistributionRow[];
  /** Available chart of accounts options */
  availableAccounts: AccountOption[];
  /** Available subsidiaries / entities */
  availableSubsidiaries?: string[];
  /** Available departments */
  availableDepartments?: string[];
  /** Available cost centers */
  availableCostCenters?: string[];
  /** Currency code/symbol */
  currency?: string;
  /** Callback when rows or balance changes */
  onRowsChange?: (rows: DistributionRow[], isBalanced: boolean, variance: number) => void;
  /** Whether table is read-only */
  readOnly?: boolean;
  /** Density scale */
  density?: DistributionDensity;
  className?: string;
}

/**
 * `<SubledgerDistributionTable>` — Double-entry multi-dimensional accounting line distribution grid.
 * Benchmarked against NetSuite SuiteCloud (#30), Sage Intacct (#39), and Dynamics 365 (#31).
 */
export const SubledgerDistributionTable: FC<SubledgerDistributionTableProps> = ({
  initialRows = [],
  availableAccounts,
  availableSubsidiaries = ["US Operating Entity (001)", "EMEA Holding B.V. (002)", "APAC Pte Ltd (003)"],
  availableDepartments = ["Finance & Accounting", "Engineering & R&D", "Sales & Marketing", "General & Admin"],
  availableCostCenters = ["CC-1000 Corp", "CC-2000 Sales", "CC-3000 Cloud Ops"],
  currency = "$",
  onRowsChange,
  readOnly = false,
  density = "compact",
  className = "",
}) => {
  const [rows, setRows] = useState<DistributionRow[]>(() => {
    if (initialRows.length > 0) return initialRows;
    return [
      {
        id: `row-${Date.now()}-1`,
        accountId: availableAccounts[0]?.id || "",
        debit: 0,
        credit: 0,
        subsidiary: availableSubsidiaries[0],
        department: availableDepartments[0],
        costCenter: availableCostCenters[0],
        memo: "",
      },
    ];
  });

  const totals = useMemo(() => {
    let debits = 0;
    let credits = 0;
    for (const r of rows) {
      debits += r.debit || 0;
      credits += r.credit || 0;
    }
    const variance = Math.round(Math.abs(debits - credits) * 100) / 100;
    const isBalanced = variance === 0 && (debits > 0 || credits > 0);
    return {
      debits: Math.round(debits * 100) / 100,
      credits: Math.round(credits * 100) / 100,
      variance,
      isBalanced,
    };
  }, [rows]);

  const notifyChange = (newRows: DistributionRow[]) => {
    setRows(newRows);
    let debits = 0;
    let credits = 0;
    for (const r of newRows) {
      debits += r.debit || 0;
      credits += r.credit || 0;
    }
    const variance = Math.round(Math.abs(debits - credits) * 100) / 100;
    const isBalanced = variance === 0 && (debits > 0 || credits > 0);
    onRowsChange?.(newRows, isBalanced, variance);
  };

  const handleFieldChange = (
    rowId: string,
    field: keyof DistributionRow,
    value: string | number
  ) => {
    const updated = rows.map((r) => {
      if (r.id !== rowId) return r;
      if (field === "debit") {
        const val = typeof value === "number" ? value : parseFloat(value) || 0;
        return { ...r, debit: val, credit: val > 0 ? 0 : r.credit };
      }
      if (field === "credit") {
        const val = typeof value === "number" ? value : parseFloat(value) || 0;
        return { ...r, credit: val, debit: val > 0 ? 0 : r.debit };
      }
      return { ...r, [field]: value };
    });
    notifyChange(updated);
  };

  const handleAddLine = () => {
    const newRow: DistributionRow = {
      id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      accountId: availableAccounts[0]?.id || "",
      debit: 0,
      credit: 0,
      subsidiary: availableSubsidiaries[0],
      department: availableDepartments[0],
      costCenter: availableCostCenters[0],
      memo: "",
    };
    notifyChange([...rows, newRow]);
  };

  const handleDeleteLine = (rowId: string) => {
    if (rows.length <= 1) return;
    const updated = rows.filter((r) => r.id !== rowId);
    notifyChange(updated);
  };

  const handleBalanceRemainder = () => {
    if (totals.variance === 0) return;
    const isDebitLesser = totals.debits < totals.credits;
    const balancingRow: DistributionRow = {
      id: `row-${Date.now()}-bal`,
      accountId: availableAccounts[1]?.id || availableAccounts[0]?.id || "",
      debit: isDebitLesser ? totals.variance : 0,
      credit: isDebitLesser ? 0 : totals.variance,
      subsidiary: availableSubsidiaries[0],
      department: availableDepartments[0],
      costCenter: availableCostCenters[0],
      memo: "Automatic balance remainder offset",
    };
    notifyChange([...rows, balancingRow]);
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Subledger Distribution Table"
    >
      {/* ── Table Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.titleGroup}>
          <Scale size={15} className={styles.titleIcon} aria-hidden="true" />
          <h3 className={styles.title}>General Ledger Account Distribution</h3>
          <span className={styles.countBadge}>{rows.length} lines</span>
        </div>

        <div className={styles.toolbarActions}>
          {!readOnly && (
            <>
              {totals.variance > 0 && (
                <button
                  type="button"
                  className={styles.balanceBtn}
                  onClick={handleBalanceRemainder}
                  title="Insert offset line to balance debits and credits"
                >
                  <Sparkles size={13} aria-hidden="true" />
                  <span>Balance Remainder ({currency}{totals.variance.toFixed(2)})</span>
                </button>
              )}

              <button
                type="button"
                className={styles.addLineBtn}
                onClick={handleAddLine}
              >
                <Plus size={13} aria-hidden="true" />
                <span>Add Distribution Line</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Table Matrix ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.accountCol}>GL Account</th>
              <th scope="col" className={styles.numericCol}>Debit ({currency})</th>
              <th scope="col" className={styles.numericCol}>Credit ({currency})</th>
              <th scope="col">Subsidiary</th>
              <th scope="col">Department</th>
              <th scope="col">Cost Center</th>
              <th scope="col">Memo</th>
              {!readOnly && (
                <th scope="col" className={styles.actionCol}>
                  <span className={styles.srOnly}>Row Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={styles.row}>
                <td className={styles.accountCol}>
                  {readOnly ? (
                    <span>
                      {availableAccounts.find((a) => a.id === row.accountId)?.name || row.accountId}
                    </span>
                  ) : (
                    <select
                      className={styles.select}
                      value={row.accountId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleFieldChange(row.id, "accountId", e.target.value)
                      }
                      aria-label={`GL Account for line ${idx + 1}`}
                    >
                      {availableAccounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.code} - {acc.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className={styles.numericCol}>
                  {readOnly ? (
                    <span className={styles.monoAmount}>
                      {row.debit > 0 ? row.debit.toFixed(2) : "-"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      className={`${styles.numberInput} ${styles.numericCol}`}
                      value={row.debit || ""}
                      placeholder="0.00"
                      onChange={(e) => handleFieldChange(row.id, "debit", e.target.value)}
                      aria-label={`Debit amount for line ${idx + 1}`}
                    />
                  )}
                </td>
                <td className={styles.numericCol}>
                  {readOnly ? (
                    <span className={styles.monoAmount}>
                      {row.credit > 0 ? row.credit.toFixed(2) : "-"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      className={`${styles.numberInput} ${styles.numericCol}`}
                      value={row.credit || ""}
                      placeholder="0.00"
                      onChange={(e) => handleFieldChange(row.id, "credit", e.target.value)}
                      aria-label={`Credit amount for line ${idx + 1}`}
                    />
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{row.subsidiary}</span>
                  ) : (
                    <select
                      className={styles.select}
                      value={row.subsidiary || ""}
                      onChange={(e) => handleFieldChange(row.id, "subsidiary", e.target.value)}
                      aria-label={`Subsidiary for line ${idx + 1}`}
                    >
                      {availableSubsidiaries.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{row.department}</span>
                  ) : (
                    <select
                      className={styles.select}
                      value={row.department || ""}
                      onChange={(e) => handleFieldChange(row.id, "department", e.target.value)}
                      aria-label={`Department for line ${idx + 1}`}
                    >
                      {availableDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{row.costCenter}</span>
                  ) : (
                    <select
                      className={styles.select}
                      value={row.costCenter || ""}
                      onChange={(e) => handleFieldChange(row.id, "costCenter", e.target.value)}
                      aria-label={`Cost Center for line ${idx + 1}`}
                    >
                      {availableCostCenters.map((cc) => (
                        <option key={cc} value={cc}>
                          {cc}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{row.memo}</span>
                  ) : (
                    <input
                      type="text"
                      className={styles.memoInput}
                      value={row.memo || ""}
                      placeholder="Line memo / reference..."
                      onChange={(e) => handleFieldChange(row.id, "memo", e.target.value)}
                      aria-label={`Memo for line ${idx + 1}`}
                    />
                  )}
                </td>
                {!readOnly && (
                  <td className={styles.actionCol}>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteLine(row.id)}
                      disabled={rows.length <= 1}
                      title="Delete line item"
                      aria-label={`Delete line ${idx + 1}`}
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Double-Entry Summary Footer ── */}
      <div className={styles.footer}>
        <div className={styles.balanceStatus}>
          {totals.isBalanced ? (
            <span className={styles.badgeBalanced}>
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>Balanced: {currency}0.00 Difference</span>
            </span>
          ) : (
            <span className={styles.badgeUnbalanced}>
              <AlertTriangle size={13} aria-hidden="true" />
              <span>Out of Balance: {currency}{totals.variance.toFixed(2)} Difference</span>
            </span>
          )}
        </div>

        <div className={styles.totalsGroup}>
          <div className={styles.totalItem}>
            <span className={styles.totalLabel}>Total Debits:</span>
            <span className={styles.totalValue}>{currency}{totals.debits.toFixed(2)}</span>
          </div>
          <div className={styles.totalItem}>
            <span className={styles.totalLabel}>Total Credits:</span>
            <span className={styles.totalValue}>{currency}{totals.credits.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
