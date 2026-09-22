"use client";

import {
  useState,
  forwardRef,
  type HTMLAttributes,
} from "react";
import styles from "./batch-entry-form.module.css";

export interface BatchEntryFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  columns: string[];
  initialRows?: number;
  initialData?: string[][];
  onSubmit?: (data: string[][]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * `<BatchEntryForm>` delivers high-throughput matrix data entry for ledger balancing,
 * warehouse inventory counts, and multi-line item transaction staging.
 *
 * @maturity stable
 */
export const BatchEntryForm = forwardRef<HTMLDivElement, BatchEntryFormProps>(
  (
    {
      columns,
      initialRows = 5,
      initialData,
      onSubmit,
      title = "Batch Matrix Entry",
      subtitle,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const [rows, setRows] = useState<string[][]>(() => {
      if (initialData && initialData.length > 0) {
        return initialData;
      }
      return Array.from({ length: initialRows }, () => columns.map(() => ""));
    });

    const updateCell = (ri: number, ci: number, val: string) => {
      const next = rows.map((r) => [...r]);
      const row = next[ri];
      if (row) {
        row[ci] = val;
        setRows(next);
      }
    };

    const handleAddRow = () => {
      setRows((prev) => [...prev, columns.map(() => "")]);
    };

    const handleSubmit = () => {
      onSubmit?.(rows);
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="region"
        aria-label={title}
        {...restProps}
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className={styles.th}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={styles.row}>
                  {row.map((val, ci) => (
                    <td key={ci} className={styles.td}>
                      <input
                        className={styles.input}
                        value={val}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        aria-label={`${columns[ci]} row ${ri + 1}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btn}
            onClick={handleAddRow}
          >
            + Add Row
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSubmit}
          >
            Submit Batch ({rows.length} rows)
          </button>
        </div>
      </div>
    );
  }
);

BatchEntryForm.displayName = "BatchEntryForm";
