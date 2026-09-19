"use client";

import {
  forwardRef,
  type CSSProperties,
  type ChangeEvent,
} from "react";
import styles from "./record-field-policy-matrix.module.css";

export type FieldPermissionLevel =
  | "READ_WRITE"
  | "READ_ONLY"
  | "MASKED"
  | "NO_ACCESS";

export interface MatrixField {
  id: string;
  name: string;
  type?: string;
  isPii?: boolean;
}

export interface MatrixRole {
  id: string;
  name: string;
}

export interface RecordFieldPolicyMatrixProps {
  /** Entity fields (rows) */
  fields: MatrixField[];
  /** Enterprise roles (columns) */
  roles: MatrixRole[];
  /** Mapping of fieldId -> roleId -> permission level */
  matrix: Record<string, Record<string, FieldPermissionLevel>>;
  /** Callback when permission level is altered */
  onChangePermission: (
    fieldId: string,
    roleId: string,
    level: FieldPermissionLevel,
  ) => void;
  /** Title header */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const PERMISSION_OPTIONS: { value: FieldPermissionLevel; label: string }[] = [
  { value: "READ_WRITE", label: "Read / Write" },
  { value: "READ_ONLY", label: "Read Only" },
  { value: "MASKED", label: "Masked" },
  { value: "NO_ACCESS", label: "No Access" },
];

/**
 * `<RecordFieldPolicyMatrix>` — Role-by-field access control matrix with PII indicators and permission level selectors.
 *
 * @maturity stable
 */
export const RecordFieldPolicyMatrix = forwardRef<
  HTMLDivElement,
  RecordFieldPolicyMatrixProps
>(
  (
    {
      fields,
      roles,
      matrix,
      onChangePermission,
      title = "Field-Level Security Policy Matrix",
      className,
      style,
    },
    ref,
  ) => {
    const handleSelectChange =
      (fieldId: string, roleId: string) => (e: ChangeEvent<HTMLSelectElement>) => {
        onChangePermission(
          fieldId,
          roleId,
          e.target.value as FieldPermissionLevel,
        );
      };

    const containerClasses = [styles.container, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={title}
      >
        <div className={styles.header}>
          <div className={styles.headerLead}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.subtitle}>
              {fields.length} Fields × {roles.length} Roles
            </span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.fieldTh}`}>Entity Field</th>
                {roles.map((role) => (
                  <th key={role.id} className={styles.th}>
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.fieldTd}`}>
                    <div className={styles.fieldNameBox}>
                      <span className={styles.fieldName}>{field.name}</span>
                      {field.isPii && (
                        <span className={styles.piiBadge} title="Personally Identifiable Information">
                          PII
                        </span>
                      )}
                      {field.type && (
                        <span className={styles.fieldType}>{field.type}</span>
                      )}
                    </div>
                  </td>

                  {roles.map((role) => {
                    const currentLevel: FieldPermissionLevel =
                      matrix[field.id]?.[role.id] ?? "NO_ACCESS";

                    return (
                      <td key={role.id} className={styles.td}>
                        <div className={styles.selectWrapper}>
                          <select
                            className={`${styles.permSelect} ${styles[currentLevel]}`}
                            value={currentLevel}
                            onChange={handleSelectChange(field.id, role.id)}
                            aria-label={`Permission for ${field.name} in role ${role.name}`}
                          >
                            {PERMISSION_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

RecordFieldPolicyMatrix.displayName = "RecordFieldPolicyMatrix";
