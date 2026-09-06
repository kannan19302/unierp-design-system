import React, { useId, useState, useMemo } from "react";
import styles from "./secret-vault-access-matrix.module.css";

export type SecretEnvironment = "PRODUCTION" | "STAGING" | "DEVELOPMENT";

export interface VaultSecretRecord {
  id: string; // "sec_db_url"
  keyName: string; // "DATABASE_URL"
  description: string; // "PostgreSQL main connection pool string"
  environments: Record<SecretEnvironment, { value: string; isSet: boolean }>;
  rotationAgeDays: number; // 42
  lastRotatedBy: string; // "alex.dev@corp.com"
  securityTier: "RESTRICTED" | "INTERNAL";
}

export interface SecretVaultAccessMatrixProps {
  secrets: VaultSecretRecord[];
  onRotateSecret?: (secretId: string, env: SecretEnvironment) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SecretVaultAccessMatrix: React.FC<SecretVaultAccessMatrixProps> = ({
  secrets,
  onRotateSecret,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const searchInputId = useId();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const filteredSecrets = useMemo(() => {
    if (!searchQuery.trim()) return secrets;
    const q = searchQuery.toLowerCase();
    return secrets.filter(
      (s) =>
        s.keyName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.lastRotatedBy.toLowerCase().includes(q)
    );
  }, [secrets, searchQuery]);

  const toggleReveal = (secretId: string, env: SecretEnvironment) => {
    const compositeKey = `${secretId}_${env}`;
    setRevealedSecrets((prev) => ({
      ...prev,
      [compositeKey]: !prev[compositeKey],
    }));
  };

  const overdueRotationCount = secrets.filter((s) => s.rotationAgeDays > 90).length;

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.vaultBadge}>MULTI-ENVIRONMENT SECRET VAULT</span>
          <span
            className={`${styles.alertPill} ${
              overdueRotationCount > 0 ? styles.pillOverdue : styles.pillCompliant
            }`}
          >
            {overdueRotationCount > 0
              ? `${overdueRotationCount} SECRETS REQUIRE ROTATION (>90d)`
              : "ALL SECRETS COMPLIANT"}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Multi-Environment Secret Vault &amp; Key Rotation Matrix
          </h2>
          <div className={styles.searchGroup}>
            <label htmlFor={searchInputId} className={styles.srOnly}>
              Search Secret Keys
            </label>
            <input
              id={searchInputId}
              type="search"
              placeholder="Search secret key or maintainer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      {/* Secret Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Secret vault environment access records">
          <thead>
            <tr>
              <th scope="col">Secret Key</th>
              <th scope="col">Production</th>
              <th scope="col">Staging</th>
              <th scope="col">Development</th>
              <th scope="col">Age</th>
              <th scope="col">Security Tier</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSecrets.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  No secret entries match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredSecrets.map((sec) => (
                <tr key={sec.id}>
                  <td>
                    <div className={styles.keyCell}>
                      <code className={styles.keyCode}>{sec.keyName}</code>
                      <span className={styles.keyDesc}>{sec.description}</span>
                    </div>
                  </td>

                  {(["PRODUCTION", "STAGING", "DEVELOPMENT"] as SecretEnvironment[]).map((env) => {
                    const envData = sec.environments[env];
                    const isRevealed = !!revealedSecrets[`${sec.id}_${env}`];
                    return (
                      <td key={env} className={styles.envCell}>
                        {envData && envData.isSet ? (
                          <div className={styles.secretValueWrapper}>
                            <span className={styles.secretValue}>
                              {isRevealed ? envData.value : "••••••••••••"}
                            </span>
                            <button
                              type="button"
                              className={styles.revealBtn}
                              onClick={() => toggleReveal(sec.id, env)}
                              aria-label={`${isRevealed ? "Mask" : "Reveal"} ${sec.keyName} on ${env}`}
                            >
                              {isRevealed ? "Hide" : "Show"}
                            </button>
                          </div>
                        ) : (
                          <span className={styles.unsetPill}>Not Set</span>
                        )}
                      </td>
                    );
                  })}

                  <td>
                    <span
                      className={`${styles.agePill} ${
                        sec.rotationAgeDays > 90 ? styles.ageOverdue : styles.ageFresh
                      }`}
                    >
                      {sec.rotationAgeDays}d
                    </span>
                  </td>

                  <td>
                    <span
                      className={`${styles.tierBadge} ${
                        sec.securityTier === "RESTRICTED" ? styles.tierRestricted : styles.tierInternal
                      }`}
                    >
                      {sec.securityTier}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={styles.rotateBtn}
                      onClick={() => onRotateSecret?.(sec.id, "PRODUCTION")}
                      aria-label={`Trigger key rotation for ${sec.keyName}`}
                    >
                      Rotate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerInfo}>
          Secrets are encrypted at rest with AES-256 GCM envelope encryption. Audit logs record all reveal actions.
        </span>
      </footer>
    </section>
  );
};
