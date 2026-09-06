"use client";

import React from "react";
import styles from "./permission-matrix-form.module.css";

export interface PermissionMatrixFormProps { roles: string[]; resources: string[]; permissions: Record<string, Record<string, boolean>>; onToggle?: (role: string, resource: string, value: boolean) => void; }

export const PermissionMatrixForm: React.FC<PermissionMatrixFormProps> = (props) => {
  const { roles, resources, permissions, onToggle } = props;
  return (
    <div className={styles.container} role="region" aria-label="Permission matrix">
      <h3 className={styles.title}>Permission Matrix</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}><thead><tr><th className={styles.th}>Resource</th>{roles.map(r => <th key={r} className={styles.th} style={{ textAlign: 'center' }}>{r}</th>)}</tr></thead>
        <tbody>{resources.map(res => (
          <tr key={res}><td className={styles.td}>{res}</td>{roles.map(role => (
            <td key={role} className={styles.td} style={{ textAlign: 'center' }}><input type="checkbox" className={styles.checkbox} checked={permissions[role]?.[res] || false} onChange={e => onToggle?.(role, res, e.target.checked)} aria-label={`${role} ${res}`} /></td>
          ))}</tr>
        ))}</tbody></table>
      </div>
    </div>
  );
};
