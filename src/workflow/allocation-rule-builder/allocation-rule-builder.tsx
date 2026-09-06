import React, { useState, useId, useMemo } from "react";
import styles from "./allocation-rule-builder.module.css";

export type AllocationBasisType = "percentage" | "fixed_amount" | "ratio" | "headcount";

export interface AllocationTarget {
  id: string;
  entityName: string;
  costCenterCode: string;
  basisValue: number;
}

export interface AllocationRuleBuilderProps {
  /** Cost pool title (e.g. "Corporate IT & Shared Infrastructure Pool") */
  poolName: string;
  /** Total monetary balance in the pool */
  poolAmount: number;
  /** ISO Currency code (default: "USD") */
  currency?: string;
  /** Allocation basis type (default: "percentage") */
  basisType?: AllocationBasisType;
  /** Initial target rows */
  initialTargets?: AllocationTarget[];
  /** Callback fired when targets or basis values are modified */
  onChangeTargets?: (targets: AllocationTarget[], isBalanced: boolean) => void;
  /** Density */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_TARGETS: AllocationTarget[] = [
  { id: "target-1", entityName: "North America Retail Operations", costCenterCode: "CC-1010", basisValue: 40 },
  { id: "target-2", entityName: "EMEA Commercial Sales", costCenterCode: "CC-2040", basisValue: 35 },
  { id: "target-3", entityName: "Global Engineering & R&D", costCenterCode: "CC-5000", basisValue: 25 },
];

export const AllocationRuleBuilder: React.FC<AllocationRuleBuilderProps> = ({
  poolName,
  poolAmount,
  currency = "USD",
  basisType = "percentage",
  initialTargets = DEFAULT_TARGETS,
  onChangeTargets,
  density = "compact",
  className,
}) => {
  const ruleId = useId();
  const [activeBasis, setActiveBasis] = useState<AllocationBasisType>(basisType);
  const [targets, setTargets] = useState<AllocationTarget[]>(initialTargets);

  // Compute total basis sum
  const totalBasisValue = useMemo(() => {
    return targets.reduce((sum, t) => sum + (Number(t.basisValue) || 0), 0);
  }, [targets]);

  // Balance status
  const isBalanced = useMemo(() => {
    if (activeBasis === "percentage") {
      return Math.abs(totalBasisValue - 100) < 0.01;
    }
    if (activeBasis === "fixed_amount") {
      return Math.abs(totalBasisValue - poolAmount) < 0.01;
    }
    return totalBasisValue > 0;
  }, [activeBasis, totalBasisValue, poolAmount]);

  const remainingValue = useMemo(() => {
    if (activeBasis === "percentage") {
      return 100 - totalBasisValue;
    }
    if (activeBasis === "fixed_amount") {
      return poolAmount - totalBasisValue;
    }
    return 0;
  }, [activeBasis, totalBasisValue, poolAmount]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const calculateAllocatedAmount = (target: AllocationTarget) => {
    if (activeBasis === "percentage") {
      return (poolAmount * (target.basisValue || 0)) / 100;
    }
    if (activeBasis === "fixed_amount") {
      return target.basisValue || 0;
    }
    if (totalBasisValue > 0) {
      return (poolAmount * (target.basisValue || 0)) / totalBasisValue;
    }
    return 0;
  };

  const handleBasisValueChange = (id: string, newVal: number) => {
    const next = targets.map((t) => (t.id === id ? { ...t, basisValue: newVal } : t));
    setTargets(next);
    onChangeTargets?.(next, isBalanced);
  };

  const handleEntityNameChange = (id: string, newName: string) => {
    const next = targets.map((t) => (t.id === id ? { ...t, entityName: newName } : t));
    setTargets(next);
    onChangeTargets?.(next, isBalanced);
  };

  const handleCostCenterChange = (id: string, newCode: string) => {
    const next = targets.map((t) => (t.id === id ? { ...t, costCenterCode: newCode } : t));
    setTargets(next);
    onChangeTargets?.(next, isBalanced);
  };

  const handleAddRow = () => {
    const newTarget: AllocationTarget = {
      id: `target-${Date.now()}`,
      entityName: "New Cost Center Entity",
      costCenterCode: "CC-0000",
      basisValue: 0,
    };
    const next = [...targets, newTarget];
    setTargets(next);
    onChangeTargets?.(next, false);
  };

  const handleRemoveRow = (id: string) => {
    if (targets.length <= 1) return;
    const next = targets.filter((t) => t.id !== id);
    setTargets(next);
    onChangeTargets?.(next, isBalanced);
  };

  const handleAutoBalance = () => {
    if (targets.length === 0 || remainingValue === 0) return;
    const lastTarget = targets[targets.length - 1];
    if (!lastTarget) return;

    const adjustedValue = Math.round((lastTarget.basisValue + remainingValue) * 100) / 100;
    const next = targets.map((t, idx) =>
      idx === targets.length - 1 ? { ...t, basisValue: Math.max(0, adjustedValue) } : t
    );
    setTargets(next);
    onChangeTargets?.(next, true);
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${ruleId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.badgeRule}>RULE ENGINE</span>
          <h3 id={`${ruleId}-title`} className={styles.poolTitle}>
            {poolName}
          </h3>
          <span className={styles.poolAmountPill}>{formatCurrency(poolAmount)}</span>
        </div>

        {/* Allocation Basis Selector */}
        <div className={styles.basisToggleGroup} role="group" aria-label="Allocation basis">
          <button
            type="button"
            className={`${styles.basisBtn} ${activeBasis === "percentage" ? styles.basisBtnActive : ""}`}
            onClick={() => setActiveBasis("percentage")}
          >
            Percentage (%)
          </button>
          <button
            type="button"
            className={`${styles.basisBtn} ${activeBasis === "fixed_amount" ? styles.basisBtnActive : ""}`}
            onClick={() => setActiveBasis("fixed_amount")}
          >
            Fixed Currency ($)
          </button>
          <button
            type="button"
            className={`${styles.basisBtn} ${activeBasis === "headcount" ? styles.basisBtnActive : ""}`}
            onClick={() => setActiveBasis("headcount")}
          >
            Headcount Ratio (FTE)
          </button>
        </div>
      </div>

      {/* Target Distribution Grid */}
      <div className={styles.gridContainer}>
        <table className={styles.table} aria-label="Allocation target breakdown">
          <thead>
            <tr>
              <th scope="col" className={styles.thEntity}>Target Business Entity</th>
              <th scope="col" className={styles.thCode}>Cost Center</th>
              <th scope="col" className={styles.thBasis}>
                {activeBasis === "percentage"
                  ? "Allocation %"
                  : activeBasis === "fixed_amount"
                  ? "Fixed Amount"
                  : "Headcount (FTE)"}
              </th>
              <th scope="col" className={styles.thCalculated}>Calculated Share</th>
              <th scope="col" className={styles.thActions}>
                <span className={styles.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {targets.map((target) => {
              const share = calculateAllocatedAmount(target);
              return (
                <tr key={target.id} className={styles.tr}>
                  <td className={styles.td}>
                    <input
                      type="text"
                      value={target.entityName}
                      onChange={(e) => handleEntityNameChange(target.id, e.target.value)}
                      className={styles.inputEntity}
                      aria-label="Target business entity name"
                    />
                  </td>
                  <td className={styles.td}>
                    <input
                      type="text"
                      value={target.costCenterCode}
                      onChange={(e) => handleCostCenterChange(target.id, e.target.value)}
                      className={styles.inputCode}
                      aria-label="Cost center code"
                    />
                  </td>
                  <td className={styles.td}>
                    <div className={styles.basisInputWrapper}>
                      <input
                        type="number"
                        step={activeBasis === "percentage" ? "0.1" : "1"}
                        value={target.basisValue}
                        onChange={(e) =>
                          handleBasisValueChange(target.id, parseFloat(e.target.value) || 0)
                        }
                        className={styles.inputBasis}
                        aria-label="Allocation basis value"
                      />
                      <span className={styles.basisUnit}>
                        {activeBasis === "percentage" ? "%" : activeBasis === "fixed_amount" ? currency : "FTE"}
                      </span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.tdCalculated}`}>
                    <span className={styles.calculatedAmount}>{formatCurrency(share)}</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemoveRow(target.id)}
                      disabled={targets.length <= 1}
                      title="Remove distribution row"
                      aria-label={`Remove ${target.entityName}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Controls & Balance Status */}
      <div className={styles.footer}>
        <div className={styles.leftActions}>
          <button type="button" className={styles.addBtn} onClick={handleAddRow}>
            + Add Target Entity
          </button>
          {!isBalanced && (activeBasis === "percentage" || activeBasis === "fixed_amount") && (
            <button
              type="button"
              className={styles.autoBalanceBtn}
              onClick={handleAutoBalance}
            >
              Auto-Balance Remainder ({remainingValue > 0 ? `+${remainingValue.toFixed(2)}` : remainingValue.toFixed(2)})
            </button>
          )}
        </div>

        {/* Live Balance Summary */}
        <div className={styles.balanceSummary}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>
              Total {activeBasis === "percentage" ? "Allocated %" : "Allocated"}:
            </span>
            <span
              className={`${styles.totalValue} ${
                isBalanced ? styles.textSuccess : styles.textDanger
              }`}
            >
              {activeBasis === "percentage"
                ? `${totalBasisValue.toFixed(2)}% / 100.00%`
                : `${formatCurrency(totalBasisValue)} / ${formatCurrency(poolAmount)}`}
            </span>
          </div>
          <div className={styles.balanceBadgeWrapper}>
            {isBalanced ? (
              <span className={styles.balancedBadge}>✓ Perfectly Balanced</span>
            ) : (
              <span className={styles.unbalancedBadge}>
                ⚠ Unbalanced ({remainingValue > 0 ? `${remainingValue.toFixed(2)} remaining` : `${Math.abs(remainingValue).toFixed(2)} over`})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
