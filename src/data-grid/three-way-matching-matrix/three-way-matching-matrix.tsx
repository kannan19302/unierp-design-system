import React, { useId, useState, useMemo } from "react";
import styles from "./three-way-matching-matrix.module.css";

export type MatchStatus =
  | "matched"
  | "price_variance"
  | "quantity_variance"
  | "missing_receipt"
  | "disputed"
  | "approved";

export interface MatchedLineItem {
  id: string;
  lineNumber: number;
  itemCode: string;
  description: string;
  // Purchase Order
  poNumber: string;
  poQty: number;
  poUnitPrice: number;
  // Goods Receipt Note (GRN)
  grnNumber?: string;
  receivedQty?: number;
  receivedDate?: string;
  // Vendor Invoice
  invoiceNumber: string;
  billedQty: number;
  billedUnitPrice: number;
  // Status
  status: MatchStatus;
  varianceReason?: string;
}

export interface ThreeWayMatchingMatrixProps {
  /** Invoice reference number */
  invoiceReference?: string;
  /** Vendor name */
  vendorName?: string;
  /** Purchase order reference */
  poReference?: string;
  /** Line items undergoing three-way matching */
  items: MatchedLineItem[];
  /** Price variance percentage tolerance threshold (default 2%) */
  priceTolerancePercent?: number;
  /** Quantity variance threshold in units (default 0) */
  qtyToleranceThreshold?: number;
  /** Currency code */
  currency?: string;
  /** Callback when user approves a match */
  onApproveMatch?: (itemIds: string[]) => void;
  /** Callback when user flags or disputes an item */
  onDisputeItem?: (itemId: string, reason: string) => void;
  /** Density scale */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const ThreeWayMatchingMatrix: React.FC<ThreeWayMatchingMatrixProps> = ({
  invoiceReference = "INV-2026-9042",
  vendorName = "Apex Industrial Dynamics LLC",
  poReference = "PO-88210",
  items: initialItems,
  priceTolerancePercent = 2.0,
  qtyToleranceThreshold = 0,
  currency = "USD",
  onApproveMatch,
  onDisputeItem,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [items, setItems] = useState<MatchedLineItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Financial calculations
  const totals = useMemo(() => {
    let poTotal = 0;
    let invoiceTotal = 0;
    let varianceCount = 0;

    items.forEach((item) => {
      poTotal += item.poQty * item.poUnitPrice;
      invoiceTotal += item.billedQty * item.billedUnitPrice;
      if (
        item.status === "price_variance" ||
        item.status === "quantity_variance" ||
        item.status === "missing_receipt"
      ) {
        varianceCount++;
      }
    });

    const netVariance = invoiceTotal - poTotal;
    const netVariancePct = poTotal > 0 ? (netVariance / poTotal) * 100 : 0;

    return {
      poTotal,
      invoiceTotal,
      netVariance,
      netVariancePct,
      varianceCount,
      allMatched: varianceCount === 0,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    if (statusFilter === "variances") {
      return items.filter(
        (i) =>
          i.status === "price_variance" ||
          i.status === "quantity_variance" ||
          i.status === "missing_receipt"
      );
    }
    return items.filter((i) => i.status === statusFilter);
  }, [items, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBatchApprove = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.has(item.id) ? { ...item, status: "approved" as MatchStatus } : item
      )
    );
    setSelectedIds(new Set());
    onApproveMatch?.(ids);
  };

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "matched":
        return <span className={`${styles.statusBadge} ${styles.statusMatched}`}>✓ MATCHED</span>;
      case "approved":
        return <span className={`${styles.statusBadge} ${styles.statusApproved}`}>✓ APPROVED</span>;
      case "price_variance":
        return <span className={`${styles.statusBadge} ${styles.statusPriceVariance}`}>⚠️ PRICE VARIANCE</span>;
      case "quantity_variance":
        return <span className={`${styles.statusBadge} ${styles.statusQtyVariance}`}>⚠️ QTY VARIANCE</span>;
      case "missing_receipt":
        return <span className={`${styles.statusBadge} ${styles.statusMissingReceipt}`}>⛔ MISSING GRN</span>;
      case "disputed":
        return <span className={`${styles.statusBadge} ${styles.statusDisputed}`}>🛑 DISPUTED</span>;
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
            ⚖️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.invBadge}>{invoiceReference}</span>
              <span className={styles.poBadge}>Linked {poReference}</span>
              <span className={styles.vendorName}>{vendorName}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Three-Way Reconciliation Matching
            </h2>
          </div>
        </div>

        {/* Summary HUD */}
        <div className={styles.hudStats}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>PO Commitment:</span>
            <span className={styles.hudValue}>{formatCurrency(totals.poTotal)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Invoice Total:</span>
            <span className={styles.hudValue}>{formatCurrency(totals.invoiceTotal)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Variance Delta:</span>
            <span
              className={`${styles.hudValue} ${
                Math.abs(totals.netVariance) > 0 ? styles.textVariance : styles.textOk
              }`}
            >
              {totals.netVariance > 0 ? "+" : ""}
              {formatCurrency(totals.netVariance)} ({totals.netVariancePct.toFixed(1)}%)
            </span>
          </div>
        </div>
      </header>

      {/* Variance Alert Banner if present */}
      {totals.varianceCount > 0 ? (
        <div className={styles.alertBanner} role="alert">
          <span className={styles.alertIcon} aria-hidden="true">⚠️</span>
          <div className={styles.alertContent}>
            <strong>{totals.varianceCount} Discrepancy Found:</strong> Invoices exceed configured PO tolerance thresholds ({priceTolerancePercent}% price / {qtyToleranceThreshold} qty). Automated voucher release blocked pending AP review.
          </div>
        </div>
      ) : (
        <div className={styles.safeBanner}>
          <span className={styles.safeIcon} aria-hidden="true">✓</span>
          <div className={styles.safeContent}>
            <strong>Zero Tolerance Discrepancies:</strong> All line items reconcile within policy parameters. Ready for automated payment run scheduling.
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Filter View:</span>
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "all" ? styles.filterActive : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Lines ({items.length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "variances" ? styles.filterActive : ""}`}
            onClick={() => setStatusFilter("variances")}
          >
            Variances ({totals.varianceCount})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "matched" ? styles.filterActive : ""}`}
            onClick={() => setStatusFilter("matched")}
          >
            Matched
          </button>
        </div>

        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.approveBtn}
            onClick={handleBatchApprove}
            disabled={selectedIds.size === 0}
          >
            Approve Selected ({selectedIds.size})
          </button>
        </div>
      </div>

      {/* Tri-Fold Matching Grid */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Three-way line reconciliation table">
          <thead>
            <tr className={styles.headerGroupRow}>
              <th scope="col" rowSpan={2} className={styles.checkTh}>
                <input
                  type="checkbox"
                  aria-label="Select all lines"
                  checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" rowSpan={2} className={styles.lineTh}>
                #
              </th>
              <th scope="col" rowSpan={2} className={styles.descTh}>
                Item / Description
              </th>
              <th scope="colgroup" colSpan={2} className={styles.poColGroup}>
                Purchase Order ({poReference})
              </th>
              <th scope="colgroup" colSpan={2} className={styles.grnColGroup}>
                Goods Receipt (GRN)
              </th>
              <th scope="colgroup" colSpan={3} className={styles.invColGroup}>
                Vendor Invoice ({invoiceReference})
              </th>
              <th scope="col" rowSpan={2} className={styles.statusTh}>
                Match Status
              </th>
              <th scope="col" rowSpan={2} className={styles.actionsTh}>
                <span className={styles.srOnly}>Row Actions</span>
              </th>
            </tr>
            <tr className={styles.subHeaderRow}>
              <th scope="col" className={styles.numSubTh}>Qty</th>
              <th scope="col" className={styles.numSubTh}>Unit Price</th>
              <th scope="col" className={styles.numSubTh}>Recv Qty</th>
              <th scope="col" className={styles.txtSubTh}>GRN Ref</th>
              <th scope="col" className={styles.numSubTh}>Billed Qty</th>
              <th scope="col" className={styles.numSubTh}>Billed Price</th>
              <th scope="col" className={styles.numSubTh}>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const isPriceMismatch = item.billedUnitPrice !== item.poUnitPrice;
              const isQtyMismatch = item.billedQty !== item.poQty;
              const isMissingGrn = !item.receivedQty;

              return (
                <tr
                  key={item.id}
                  className={`${styles.dataRow} ${isSelected ? styles.rowSelected : ""}`}
                >
                  <td className={styles.checkCell}>
                    <input
                      type="checkbox"
                      aria-label={`Select line ${item.lineNumber}: ${item.description}`}
                      checked={isSelected}
                      onChange={() => toggleSelectOne(item.id)}
                    />
                  </td>
                  <td className={styles.lineCell}>{item.lineNumber}</td>
                  <td className={styles.descCell}>
                    <span className={styles.skuTag}>{item.itemCode}</span>
                    <span className={styles.itemDesc}>{item.description}</span>
                  </td>
                  {/* PO */}
                  <td className={styles.numCell}>{item.poQty}</td>
                  <td className={styles.numCell}>{formatCurrency(item.poUnitPrice)}</td>
                  {/* GRN */}
                  <td
                    className={`${styles.numCell} ${
                      isMissingGrn ? styles.cellMissing : item.receivedQty !== item.poQty ? styles.cellWarn : ""
                    }`}
                  >
                    {item.receivedQty !== undefined ? item.receivedQty : "—"}
                  </td>
                  <td className={styles.txtCell}>
                    {item.grnNumber || <span className={styles.badgeNone}>NONE</span>}
                  </td>
                  {/* Invoice */}
                  <td
                    className={`${styles.numCell} ${
                      isQtyMismatch ? styles.cellVariance : ""
                    }`}
                  >
                    {item.billedQty}
                  </td>
                  <td
                    className={`${styles.numCell} ${
                      isPriceMismatch ? styles.cellVariance : ""
                    }`}
                  >
                    {formatCurrency(item.billedUnitPrice)}
                  </td>
                  <td className={`${styles.numCell} ${styles.totalCell}`}>
                    {formatCurrency(item.billedQty * item.billedUnitPrice)}
                  </td>
                  {/* Status */}
                  <td className={styles.statusCell}>{getStatusBadge(item.status)}</td>
                  {/* Actions */}
                  <td className={styles.actionCell}>
                    {item.status !== "approved" && (
                      <button
                        type="button"
                        className={styles.rowActionBtn}
                        onClick={() => {
                          onDisputeItem?.(
                            item.id,
                            item.varianceReason || "Discrepancy flagged by AP reviewer"
                          );
                        }}
                        aria-label={`Flag discrepancy for line ${item.lineNumber}`}
                      >
                        Dispute
                      </button>
                    )}
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
