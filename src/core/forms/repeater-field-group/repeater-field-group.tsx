"use client";

import React, { forwardRef, useState } from "react";
import styles from "./repeater-field-group.module.css";

export interface RepeaterFieldGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label: string;
  fields: string[];
  maxRows?: number;
  initialRows?: Record<string, string>[];
  onChange?: (rows: Record<string, string>[]) => void;
}

/**
 * RepeaterFieldGroup
 *
 * Dynamic repeatable sub-form rows for line items, dynamic parameters,
 * split allocations, and multi-entry records.
 *
 * @maturity stable
 */
export const RepeaterFieldGroup = forwardRef<
  HTMLDivElement,
  RepeaterFieldGroupProps
>(function RepeaterFieldGroup(
  {
    label,
    fields,
    maxRows = 20,
    initialRows,
    onChange,
    className,
    ...restProps
  },
  ref
) {
  const [rows, setRows] = useState<Record<string, string>[]>(() => {
    if (initialRows && initialRows.length > 0) return initialRows;
    return [
      fields.reduce(
        (a, f) => ({ ...a, [f]: "" }),
        {} as Record<string, string>
      ),
    ];
  });

  const addRow = () => {
    if (rows.length < maxRows) {
      const next = [
        ...rows,
        fields.reduce(
          (a, f) => ({ ...a, [f]: "" }),
          {} as Record<string, string>
        ),
      ];
      setRows(next);
      onChange?.(next);
    }
  };

  const removeRow = (i: number) => {
    const next = rows.filter((_, ri) => ri !== i);
    setRows(next);
    onChange?.(next);
  };

  const updateCell = (ri: number, field: string, val: string) => {
    const next = [...rows];
    next[ri] = { ...next[ri], [field]: val };
    setRows(next);
    onChange?.(next);
  };

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="group"
      aria-label={label}
      {...restProps}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{label}</h3>
        <button
          type="button"
          className={styles.btn}
          onClick={addRow}
          disabled={rows.length >= maxRows}
        >
          + Add Row
        </button>
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {fields.map((f) => (
            <input
              key={f}
              className={styles.input}
              placeholder={f}
              value={row[f] ?? ""}
              onChange={(e) => updateCell(ri, f, e.target.value)}
              aria-label={`${f} (row ${ri + 1})`}
            />
          ))}
          {rows.length > 1 && (
            <button
              type="button"
              className={styles.btn}
              onClick={() => removeRow(ri)}
              aria-label={`Remove row ${ri + 1}`}
              style={{ flexShrink: 0 }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
});

RepeaterFieldGroup.displayName = "RepeaterFieldGroup";
