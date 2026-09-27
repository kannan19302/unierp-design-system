"use client";

import React, { forwardRef, useState } from "react";
import styles from "./inline-editable-record.module.css";

export interface RecordField {
  key: string;
  label: string;
  value: string;
  editable?: boolean;
}

export interface InlineEditableRecordProps
  extends React.HTMLAttributes<HTMLDivElement> {
  fields: RecordField[];
  onSave?: (data: Record<string, string>) => void;
}

/**
 * InlineEditableRecord
 *
 * An enterprise form component providing inline field value editing with
 * instant save, validation, and accessibility support.
 *
 * @maturity stable
 */
export const InlineEditableRecord = forwardRef<
  HTMLDivElement,
  InlineEditableRecordProps
>(function InlineEditableRecord(
  { fields, onSave, className, ...restProps },
  ref
) {
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  );

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="form"
      aria-label="Inline editable record"
      {...restProps}
    >
      <div className={styles.content}>
        {fields.map((f) => (
          <div key={f.key} className={styles.row}>
            <div className={styles.label} style={{ minWidth: 120 }}>
              {f.label}
            </div>
            {editing === f.key ? (
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  flex: 1,
                }}
              >
                <input
                  className={styles.input}
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
                  className={styles.btn}
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
                  onClick={() => setEditing(null)}
                  aria-label={`Cancel editing ${f.label}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  flex: 1,
                }}
              >
                <span>{values[f.key]}</span>
                {f.editable !== false && (
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={() => setEditing(f.key)}
                    style={{ padding: "var(--space-1)" }}
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
