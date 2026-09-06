import React, { useId, useState, useMemo } from "react";
import styles from "./matrix-inventory-variant-picker.module.css";

export interface VariantStockCell {
  quantity: number;
  reserved?: number;
  skuSuffix?: string;
}

export interface MatrixInventoryVariantPickerProps {
  productTitle: string; // "Meridian Technical Waterproof Parka"
  baseSku: string; // "PRK-900"
  wholesalePrice: number; // 145.00
  msrp: number; // 295.00
  xAxisAttributeName?: string; // "Color"
  xAxisValues: string[]; // ["Obsidian Black", "Navy Blue", "Alpine Sage", "Arctic White"]
  yAxisAttributeName?: string; // "Size"
  yAxisValues: string[]; // ["XS", "S", "M", "L", "XL", "2XL"]
  initialStockMatrix?: Record<string, VariantStockCell>; // key: `${yVal}__${xVal}`
  lowStockThreshold?: number; // e.g. 10
  onCellQuantityChange?: (yVal: string, xVal: string, newQuantity: number) => void;
  onSaveInventory?: (matrix: Record<string, VariantStockCell>) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const MatrixInventoryVariantPicker: React.FC<MatrixInventoryVariantPickerProps> = ({
  productTitle,
  baseSku,
  wholesalePrice,
  msrp,
  xAxisAttributeName = "Color",
  xAxisValues,
  yAxisAttributeName = "Size",
  yAxisValues,
  initialStockMatrix = {},
  lowStockThreshold = 10,
  onCellQuantityChange,
  onSaveInventory,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [stockMatrix, setStockMatrix] =
    useState<Record<string, VariantStockCell>>(initialStockMatrix);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const getCellKey = (yVal: string, xVal: string) => `${yVal}__${xVal}`;

  const handleQtyInput = (yVal: string, xVal: string, val: string) => {
    const qty = Math.max(0, parseInt(val, 10) || 0);
    const key = getCellKey(yVal, xVal);
    const updated = {
      ...stockMatrix,
      [key]: {
        ...(stockMatrix[key] || { quantity: 0 }),
        quantity: qty,
      },
    };
    setStockMatrix(updated);
    onCellQuantityChange?.(yVal, xVal, qty);
  };

  // Calculate totals
  const { totalUnits, totalWholesaleValue, lowStockCount } = useMemo(() => {
    let units = 0;
    let lowCount = 0;
    yAxisValues.forEach((y) => {
      xAxisValues.forEach((x) => {
        const key = getCellKey(y, x);
        const cell = stockMatrix[key];
        const q = cell ? cell.quantity : 0;
        units += q;
        if (q < lowStockThreshold) {
          lowCount += 1;
        }
      });
    });
    return {
      totalUnits: units,
      totalWholesaleValue: units * wholesalePrice,
      lowStockCount: lowCount,
    };
  }, [stockMatrix, yAxisValues, xAxisValues, wholesalePrice, lowStockThreshold]);

  const filteredXValues = useMemo(() => {
    if (!searchTerm.trim()) return xAxisValues;
    return xAxisValues.filter((x) =>
      x.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [xAxisValues, searchTerm]);

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("en-US").format(val);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val);

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
            📦
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.skuBadge}>SKU: {baseSku}</span>
              <span className={styles.variantCount}>
                {yAxisValues.length * xAxisValues.length} Total Variants ({yAxisAttributeName} × {xAxisAttributeName})
              </span>
              {lowStockCount > 0 && (
                <span className={styles.lowStockBadge}>
                  ⚠️ {lowStockCount} Variants Low Stock
                </span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>
              Variant Inventory Matrix: {productTitle}
            </h2>
          </div>
        </div>

        {/* Action Button */}
        {onSaveInventory && (
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={() => onSaveInventory(stockMatrix)}
            >
              ✓ Commit Stock Changes
            </button>
          </div>
        )}
      </header>

      {/* Financial Valuation Ribbon */}
      <div className={styles.valuationRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Total Units on Hand</span>
          <span className={styles.ribbonValue}>{formatNumber(totalUnits)} units</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Total Inventory Asset Value</span>
          <span className={`${styles.ribbonValue} ${styles.assetValue}`}>
            {formatCurrency(totalWholesaleValue)} (Wholesale)
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Unit Wholesale / MSRP</span>
          <span className={styles.ribbonValue}>
            {formatCurrency(wholesalePrice)} / {formatCurrency(msrp)}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Low Stock Alert Threshold</span>
          <span className={styles.ribbonValue}>&lt; {lowStockThreshold} units</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <label htmlFor={`filter-${headingId}`} className={styles.srOnly}>
            Filter {xAxisAttributeName}
          </label>
          <input
            id={`filter-${headingId}`}
            type="text"
            placeholder={`Filter ${xAxisAttributeName.toLowerCase()} variants...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <span className={styles.matrixHint}>
          Type directly into cells to update bulk variant quantities.
        </span>
      </div>

      {/* 2D Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Inventory matrix for {productTitle} by {yAxisAttributeName} and {xAxisAttributeName}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thYAxis}>
                {yAxisAttributeName} \ {xAxisAttributeName}
              </th>
              {filteredXValues.map((xVal) => (
                <th key={xVal} scope="col" className={styles.thCol}>
                  {xVal}
                </th>
              ))}
              <th scope="col" className={styles.thTotal}>Row Total</th>
            </tr>
          </thead>
          <tbody>
            {yAxisValues.map((yVal) => {
              const rowTotal = filteredXValues.reduce((acc, xVal) => {
                const cell = stockMatrix[getCellKey(yVal, xVal)];
                return acc + (cell ? cell.quantity : 0);
              }, 0);

              return (
                <tr key={yVal} className={styles.tableRow}>
                  <th scope="row" className={styles.yHeaderCell}>
                    <strong>{yVal}</strong>
                  </th>
                  {filteredXValues.map((xVal) => {
                    const key = getCellKey(yVal, xVal);
                    const cell = stockMatrix[key];
                    const qty = cell ? cell.quantity : 0;
                    const isLow = qty < lowStockThreshold;

                    return (
                      <td key={xVal} className={styles.cellTd}>
                        <div
                          className={`${styles.cellWrap} ${
                            isLow ? styles.cellLowStock : ""
                          }`}
                        >
                          <label
                            htmlFor={`cell-${yVal}-${xVal}-${headingId}`}
                            className={styles.srOnly}
                          >
                            Quantity for {yVal} {xVal}
                          </label>
                          <input
                            id={`cell-${yVal}-${xVal}-${headingId}`}
                            type="number"
                            min="0"
                            value={qty}
                            onChange={(e) =>
                              handleQtyInput(yVal, xVal, e.target.value)
                            }
                            className={styles.qtyInput}
                          />
                          {isLow && (
                            <span
                              className={styles.lowIndicator}
                              title="Low stock threshold breached"
                              aria-hidden="true"
                            >
                              ⚠️
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className={styles.rowTotalCell}>
                    <strong>{formatNumber(rowTotal)}</strong>
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
