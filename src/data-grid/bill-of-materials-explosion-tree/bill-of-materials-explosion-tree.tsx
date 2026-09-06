import React, { useState, useId, useMemo } from "react";
import styles from "./bill-of-materials-explosion-tree.module.css";

export type BomStockStatus = "in_stock" | "low_stock" | "shortage";

export interface BomNodeItem {
  id: string;
  partNumber: string;
  description: string;
  level: number; // 0 for top assembly, 1 for subassembly, 2 for components, 3 for hardware
  quantityPerAssy: number;
  unitCost: number;
  stockStatus: BomStockStatus;
  availableStock: number;
  ecoRevision?: string;
  children?: BomNodeItem[];
}

export interface BillOfMaterialsExplosionTreeProps {
  /** Assembly product title */
  assemblyTitle?: string;
  /** Top-level assembly part number */
  assemblyPartNumber?: string;
  /** Currency code */
  currency?: string;
  /** Root BOM structure */
  bomData: BomNodeItem;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

interface FlattenedBomRow {
  node: BomNodeItem;
  parentId: string | null;
  depth: number;
  hasChildren: boolean;
  extendedCost: number;
}

export const BillOfMaterialsExplosionTree: React.FC<BillOfMaterialsExplosionTreeProps> = ({
  assemblyTitle = "Precision Robotic Actuator Assembly (MK-IV)",
  assemblyPartNumber = "ASM-9901-ROB",
  currency = "USD",
  bomData,
  density = "compact",
  className = "",
}) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [filterOnlyShortages, setFilterOnlyShortages] = useState<boolean>(false);
  const headingId = useId();

  // Recursively flatten tree respecting collapse state
  const flatRows = useMemo(() => {
    const rows: FlattenedBomRow[] = [];

    const traverse = (node: BomNodeItem, depth: number, parentId: string | null) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isCollapsed = collapsedIds.has(node.id);
      const extendedCost = node.quantityPerAssy * node.unitCost;

      if (!filterOnlyShortages || node.stockStatus === "shortage") {
        rows.push({
          node,
          parentId,
          depth,
          hasChildren,
          extendedCost,
        });
      }

      if (hasChildren && !isCollapsed && node.children) {
        for (const child of node.children) {
          traverse(child, depth + 1, node.id);
        }
      }
    };

    traverse(bomData, 0, null);
    return rows;
  }, [bomData, collapsedIds, filterOnlyShortages]);

  // Aggregate stats over whole tree
  const aggregates = useMemo(() => {
    let totalCost = 0;
    let totalParts = 0;
    let totalShortages = 0;

    const countNode = (node: BomNodeItem) => {
      totalParts += 1;
      totalCost += node.quantityPerAssy * node.unitCost;
      if (node.stockStatus === "shortage") totalShortages += 1;
      if (node.children) {
        node.children.forEach(countNode);
      }
    };

    countNode(bomData);
    return { totalCost, totalParts, totalShortages };
  }, [bomData]);

  const toggleCollapse = (id: string) => {
    const next = new Set(collapsedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCollapsedIds(next);
  };

  const expandAll = () => setCollapsedIds(new Set());
  const collapseAll = () => {
    const ids = new Set<string>();
    const collectIds = (node: BomNodeItem) => {
      if (node.children && node.children.length > 0) {
        ids.add(node.id);
        node.children.forEach(collectIds);
      }
    };
    collectIds(bomData);
    setCollapsedIds(ids);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getStockBadge = (status: BomStockStatus) => {
    switch (status) {
      case "in_stock":
        return styles.stockIn;
      case "low_stock":
        return styles.stockLow;
      case "shortage":
        return styles.stockShort;
    }
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
            ⚙️
          </div>
          <div>
            <div className={styles.refRow}>
              <span className={styles.partCode}>{assemblyPartNumber}</span>
              <span className={styles.revPill}>REV {bomData.ecoRevision || "A.0"}</span>
            </div>
            <h2 id={headingId} className={styles.title}>{assemblyTitle}</h2>
          </div>
        </div>

        {/* Global Assembly Aggregates */}
        <div className={styles.costBadgeBox}>
          <span className={styles.costLabel}>Total Roll-Up Cost</span>
          <span className={styles.costValue}>{formatCurrency(aggregates.totalCost)}</span>
        </div>
      </header>

      {/* Control Ribbon */}
      <div className={styles.controlsBar}>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.controlBtn} onClick={expandAll}>
            Expand All
          </button>
          <button type="button" className={styles.controlBtn} onClick={collapseAll}>
            Collapse All
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${filterOnlyShortages ? styles.btnActive : ""}`}
            onClick={() => setFilterOnlyShortages(!filterOnlyShortages)}
          >
            {filterOnlyShortages ? "Showing Shortages Only" : "Filter Shortages Only"}
          </button>
        </div>

        <div className={styles.statsSummary}>
          <span className={styles.statChip}>
            {aggregates.totalParts} Parts
          </span>
          <span
            className={`${styles.statChip} ${
              aggregates.totalShortages > 0 ? styles.shortageAlert : ""
            }`}
          >
            {aggregates.totalShortages} Shortages
          </span>
        </div>
      </div>

      {/* Indented BOM Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th className={styles.indentTh}>Indented Part Hierarchy</th>
              <th>Part Number</th>
              <th>Revision</th>
              <th className={styles.numCol}>Qty / Assy</th>
              <th className={styles.numCol}>Unit Cost</th>
              <th className={styles.numCol}>Extended Cost</th>
              <th>Stock Status</th>
              <th className={styles.numCol}>Available</th>
            </tr>
          </thead>
          <tbody>
            {flatRows.map((row) => {
              const isCollapsed = collapsedIds.has(row.node.id);

              return (
                <tr key={row.node.id} className={styles.rowItem}>
                  <td className={styles.treeCell}>
                    <div
                      className={styles.indentSpacer}
                      style={{ paddingLeft: `calc(${row.depth} * var(--space-4))` }}
                    >
                      {row.hasChildren ? (
                        <button
                          type="button"
                          className={styles.toggleBtn}
                          onClick={() => toggleCollapse(row.node.id)}
                          aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${row.node.description}`}
                        >
                          {isCollapsed ? "▶" : "▼"}
                        </button>
                      ) : (
                        <span className={styles.leafDot} aria-hidden="true">
                          •
                        </span>
                      )}
                      <span className={styles.partDesc}>{row.node.description}</span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>{row.node.partNumber}</td>
                  <td className={styles.revCell}>{row.node.ecoRevision || "—"}</td>
                  <td className={`${styles.numCol} ${styles.monoCell}`}>
                    {row.node.quantityPerAssy}
                  </td>
                  <td className={`${styles.numCol} ${styles.monoCell}`}>
                    {formatCurrency(row.node.unitCost)}
                  </td>
                  <td className={`${styles.numCol} ${styles.monoCell} ${styles.extCostCell}`}>
                    {formatCurrency(row.extendedCost)}
                  </td>
                  <td>
                    <span
                      className={`${styles.stockBadge} ${getStockBadge(row.node.stockStatus)}`}
                    >
                      {row.node.stockStatus.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className={`${styles.numCol} ${styles.monoCell}`}>
                    {row.node.availableStock.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
