import React, { useId, useState } from "react";
import styles from "./database-grant-privilege-matrix.module.css";

export type DbObjectType = "WAREHOUSE" | "DATABASE" | "SCHEMA" | "TABLE" | "VIEW";
export type PrivilegeType = "USAGE" | "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "OWNERSHIP";
export type GrantState = "GRANTED" | "REVOKED" | "INHERITED" | "NONE";

export interface DbCatalogObject {
  id: string; // "db_schema_accounts"
  name: string; // "PUBLIC.ACCOUNTS"
  type: DbObjectType;
  privileges: Record<PrivilegeType, GrantState>;
}

export interface DatabaseGrantPrivilegeMatrixProps {
  currentRole: string; // "DATA_ANALYST"
  roles: string[];
  objects: DbCatalogObject[];
  onApplyPrivileges?: (changes: {
    role: string;
    objectId: string;
    privilege: PrivilegeType;
    newState: GrantState;
  }[]) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const PRIVILEGE_COLUMNS: PrivilegeType[] = [
  "USAGE",
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "OWNERSHIP",
];

export const DatabaseGrantPrivilegeMatrix: React.FC<DatabaseGrantPrivilegeMatrixProps> = ({
  currentRole: initialRole,
  roles,
  objects: initialObjects,
  onApplyPrivileges,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const roleSelectId = useId();

  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [matrixData, setMatrixData] = useState<DbCatalogObject[]>(initialObjects);
  const [pendingChanges, setPendingChanges] = useState<
    { objectId: string; privilege: PrivilegeType; newState: GrantState }[]
  >([]);

  const togglePrivilege = (objectId: string, priv: PrivilegeType) => {
    setMatrixData((prev) =>
      prev.map((obj) => {
        if (obj.id !== objectId) return obj;
        const currentState = obj.privileges[priv] ?? "NONE";
        const nextState: GrantState = currentState === "GRANTED" ? "REVOKED" : "GRANTED";

        // Track pending changes
        setPendingChanges((pChanges) => {
          const filtered = pChanges.filter(
            (c) => !(c.objectId === objectId && c.privilege === priv)
          );
          return [...filtered, { objectId, privilege: priv, newState: nextState }];
        });

        return {
          ...obj,
          privileges: {
            ...obj.privileges,
            [priv]: nextState,
          },
        };
      })
    );
  };

  const handleApply = () => {
    onApplyPrivileges?.(
      pendingChanges.map((c) => ({
        role: selectedRole,
        objectId: c.objectId,
        privilege: c.privilege,
        newState: c.newState,
      }))
    );
    setPendingChanges([]);
  };

  const handleDiscard = () => {
    setMatrixData(initialObjects);
    setPendingChanges([]);
  };

  const getCellClass = (state: GrantState) => {
    switch (state) {
      case "GRANTED":
        return styles.cellGranted;
      case "INHERITED":
        return styles.cellInherited;
      case "REVOKED":
        return styles.cellRevoked;
      default:
        return styles.cellNone;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.categoryBadge}>DATABASE SECURITY &amp; ACCESS CONTROL</span>
          <span
            className={`${styles.pendingPill} ${
              pendingChanges.length > 0 ? styles.pillPending : styles.pillSynced
            }`}
          >
            {pendingChanges.length > 0
              ? `${pendingChanges.length} UNCOMMITTED CHANGES`
              : "PRIVILEGES SYNCHRONIZED"}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Role-Based Database Catalog Privilege Matrix
          </h2>
          <div className={styles.rolePicker}>
            <label htmlFor={roleSelectId} className={styles.roleLabel}>
              Active Security Role:
            </label>
            <select
              id={roleSelectId}
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPendingChanges([]);
              }}
              className={styles.roleSelect}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Privilege Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.matrixTable} aria-label="Database object privilege matrix">
          <thead>
            <tr>
              <th scope="col" className={styles.objectCol}>
                Catalog Object &amp; Scope
              </th>
              <th scope="col" className={styles.typeCol}>
                Type
              </th>
              {PRIVILEGE_COLUMNS.map((priv) => (
                <th key={priv} scope="col" className={styles.privCol}>
                  {priv}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.map((obj) => (
              <tr key={obj.id}>
                <td className={styles.objectCell}>
                  <code className={styles.objectCode}>{obj.name}</code>
                </td>
                <td>
                  <span className={styles.typeBadge}>{obj.type}</span>
                </td>
                {PRIVILEGE_COLUMNS.map((priv) => {
                  const state = obj.privileges[priv] ?? "NONE";
                  return (
                    <td key={priv} className={styles.cellAlign}>
                      <button
                        type="button"
                        className={`${styles.grantButton} ${getCellClass(state)}`}
                        onClick={() => togglePrivilege(obj.id, priv)}
                        aria-label={`Toggle ${priv} privilege on ${obj.name} (currently ${state})`}
                      >
                        {state === "GRANTED"
                          ? "✓ GRANT"
                          : state === "INHERITED"
                          ? "↳ INHERIT"
                          : state === "REVOKED"
                          ? "✕ DENY"
                          : "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotGranted}`} /> Explicitly Granted
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotInherited}`} /> Inherited
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotRevoked}`} /> Revoked / Denied
          </span>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.discardBtn}
            onClick={handleDiscard}
            disabled={pendingChanges.length === 0}
            aria-label="Discard uncommitted privilege changes"
          >
            Discard Changes
          </button>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={pendingChanges.length === 0}
            aria-label="Apply uncommitted privilege modifications"
          >
            Apply Changes ({pendingChanges.length})
          </button>
        </div>
      </footer>
    </section>
  );
};
