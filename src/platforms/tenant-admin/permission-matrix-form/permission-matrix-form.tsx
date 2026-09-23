"use client";

import React, { forwardRef } from "react";
import styles from "./permission-matrix-form.module.css";

export interface PermissionMatrixFormProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  roles: string[];
  resources: string[];
  permissions: Record<string, Record<string, boolean>>;
  onToggle?: (role: string, resource: string, value: boolean) => void;
  title?: string;
}

/**
 * PermissionMatrixForm
 *
 * An enterprise RBAC / ABAC matrix configuration table mapping tenant roles
 * to specific domain resources with granular toggle states.
 *
 * @maturity stable
 */
export const PermissionMatrixForm = forwardRef<
  HTMLDivElement,
  PermissionMatrixFormProps
>(function PermissionMatrixForm(
  {
    roles,
    resources,
    permissions,
    onToggle,
    title = "Permission Matrix",
    className,
    ...restProps
  },
  ref
) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="region"
      aria-label={title}
      {...restProps}
    >
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Resource</th>
              {roles.map((r) => (
                <th
                  key={r}
                  className={styles.th}
                  style={{ textAlign: "center" }}
                >
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => (
              <tr key={res}>
                <td className={styles.td}>{res}</td>
                {roles.map((role) => (
                  <td
                    key={role}
                    className={styles.td}
                    style={{ textAlign: "center" }}
                  >
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={permissions[role]?.[res] || false}
                      onChange={(e) => onToggle?.(role, res, e.target.checked)}
                      aria-label={`${role} ${res} permission`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PermissionMatrixForm.displayName = "PermissionMatrixForm";
