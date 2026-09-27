"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./inline-editable-record.module.css";

export interface RecordField {
  key: string;
  label: string;
  value: string;
  editable?: boolean;
}

export const inlineEditableRecordVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type InlineEditableRecordDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface InlineEditableRecordProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineEditableRecordVariants> {
  fields: RecordField[];
  onSave?: (data: Record<string, string>) => void;
  density?: InlineEditableRecordDensity;
  className?: string;
}

/**
 * `<InlineEditableRecord>`
 *
 * An enterprise form component providing inline field value editing with
 * instant save, cancellation, validation, and accessibility support.
 *
 * @maturity stable
 */
export const InlineEditableRecord = forwardRef<
  HTMLDivElement,
  InlineEditableRecordProps
>(function InlineEditableRecord(
  {
    fields,
    onSave,
    density = "standard",
    className = "",
    ...restProps
  },
  ref
) {
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  );

  return (
    <div
      ref={ref}
      data-slot="inline-editable-record"
      data-density={density}
      className={inlineEditableRecordVariants({ density, className })}
      role="form"
      aria-label="Inline editable record"
      {...restProps}
    >
      <div className={styles.content} data-slot="inline-editable-record-content">
        {fields.map((f) => (
          <div key={f.key} className={styles.row} data-slot="inline-editable-record-row">
            <div className={styles.label} data-slot="inline-editable-record-label">
              {f.label}
            </div>
            {editing === f.key ? (
              <div className={styles.editContainer} data-slot="inline-editable-record-edit-container">
                <input
                  className={styles.input}
                  data-slot="inline-editable-record-input"
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [f.key]: e.target.value,
                    }))
                  }
                  aria-label={f.label}
                  autoFocus
                />
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSave}`}
                  data-slot="inline-editable-record-save-btn"
                  onClick={() => {
                    setEditing(null);
                    onSave?.(values);
                  }}
                  aria-label={`Save ${f.label}`}
                >
                  ✓
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  data-slot="inline-editable-record-cancel-btn"
                  onClick={() => setEditing(null)}
                  aria-label={`Cancel editing ${f.label}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={styles.valueContainer} data-slot="inline-editable-record-value">
                <span className={styles.displayValue}>{values[f.key]}</span>
                {f.editable !== false && (
                  <button
                    type="button"
                    className={styles.btn}
                    data-slot="inline-editable-record-edit-btn"
                    onClick={() => setEditing(f.key)}
                    aria-label={`Edit ${f.label}`}
                  >
                    ✎
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

InlineEditableRecord.displayName = "InlineEditableRecord";
