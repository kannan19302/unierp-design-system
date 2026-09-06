import React, { useState, useId, useMemo } from "react";
import styles from "./audit-log-forensic-explorer.module.css";

export type AuditRiskLevel = "low" | "medium" | "high";
export type AuditResult = "success" | "denied";

export interface ForensicEvent {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  ipAddress: string;
  geoCountry: string;
  action: string;
  targetResource: string;
  result: AuditResult;
  riskLevel: AuditRiskLevel;
  sha256Signature: string;
  userAgent: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
}

export interface AuditLogForensicExplorerProps {
  /** Title of the forensic ledger */
  title?: string;
  /** Cryptographic ledger integrity status */
  ledgerStatus?: string;
  /** Events list */
  events: ForensicEvent[];
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const AuditLogForensicExplorer: React.FC<AuditLogForensicExplorerProps> = ({
  title = "Immutable Zero-Trust Forensic Audit Ledger",
  ledgerStatus = "CRYPTOGRAPHICALLY VERIFIED (SHA-256 MERKLE ANCHOR)",
  events,
  density = "compact",
  className = "",
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRisk, setFilterRisk] = useState<"all" | AuditRiskLevel>("all");
  const headingId = useId();

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filterRisk !== "all" && ev.riskLevel !== filterRisk) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ev.actorEmail.toLowerCase().includes(q) ||
          ev.action.toLowerCase().includes(q) ||
          ev.targetResource.toLowerCase().includes(q) ||
          ev.ipAddress.includes(q)
        );
      }
      return true;
    });
  }, [events, filterRisk, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRiskClass = (risk: AuditRiskLevel) => {
    switch (risk) {
      case "low":
        return styles.riskLow;
      case "medium":
        return styles.riskMed;
      case "high":
        return styles.riskHigh;
    }
  };

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
            🔍
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.verifiedBadge}>✓ {ledgerStatus}</span>
            </div>
            <h2 id={headingId} className={styles.title}>{title}</h2>
          </div>
        </div>

        {/* Search & Filter Ribbon */}
        <div className={styles.filterRibbon}>
          <input
            type="search"
            aria-label="Search audit events by actor, action, or IP"
            placeholder="Search actor, action, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.riskFilters} role="radiogroup" aria-label="Filter by risk">
            {(["all", "high", "medium", "low"] as const).map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={filterRisk === r}
                className={`${styles.filterBtn} ${filterRisk === r ? styles.filterBtnActive : ""}`}
                onClick={() => setFilterRisk(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Events Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.forensicTable}>
          <thead>
            <tr>
              <th className={styles.expandCol}>
                <span className={styles.srOnly}>Expand Details</span>
              </th>
              <th>Timestamp (UTC)</th>
              <th>Actor Principal</th>
              <th>Action Mutation</th>
              <th>Target Resource</th>
              <th>IP &amp; Origin</th>
              <th>Result</th>
              <th>Risk Assessment</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((ev) => {
              const isExpanded = expandedId === ev.id;

              return (
                <React.Fragment key={ev.id}>
                  <tr
                    className={`${styles.eventRow} ${isExpanded ? styles.rowExpanded : ""}`}
                    onClick={() => toggleExpand(ev.id)}
                  >
                    <td className={styles.expandCol}>
                      <button
                        type="button"
                        className={styles.expandBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(ev.id);
                        }}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} event ${ev.id}`}
                      >
                        {isExpanded ? "▼" : "▶"}
                      </button>
                    </td>
                    <td className={styles.monoCell}>{ev.timestamp}</td>
                    <td>
                      <div className={styles.actorCell}>
                        <span className={styles.actorEmail}>{ev.actorEmail}</span>
                        <span className={styles.actorRole}>{ev.actorRole}</span>
                      </div>
                    </td>
                    <td>
                      <code className={styles.actionCode}>{ev.action}</code>
                    </td>
                    <td className={styles.monoCell}>{ev.targetResource}</td>
                    <td>
                      <div className={styles.ipCell}>
                        <span className={styles.ipText}>{ev.ipAddress}</span>
                        <span className={styles.geoText}>{ev.geoCountry}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.resultBadge} ${
                          ev.result === "success" ? styles.resultSuccess : styles.resultDenied
                        }`}
                      >
                        {ev.result.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.riskBadge} ${getRiskClass(ev.riskLevel)}`}>
                        {ev.riskLevel.toUpperCase()}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Forensic Drawer */}
                  {isExpanded && (
                    <tr className={styles.expandedDetailRow}>
                      <td colSpan={8} className={styles.detailCell}>
                        <div className={styles.forensicDetails}>
                          <div className={styles.hashBox}>
                            <span className={styles.hashLabel}>Cryptographic Signature:</span>
                            <code className={styles.hashCode}>{ev.sha256Signature}</code>
                          </div>

                          <div className={styles.uaBox}>
                            <span className={styles.hashLabel}>User Agent:</span>
                            <span className={styles.uaText}>{ev.userAgent}</span>
                          </div>

                          {(ev.previousState || ev.newState) && (
                            <div className={styles.diffGrid}>
                              {ev.previousState && (
                                <div className={styles.diffPane}>
                                  <span className={styles.diffLabel}>Previous State:</span>
                                  <pre className={styles.codePre}>
                                    {JSON.stringify(ev.previousState, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {ev.newState && (
                                <div className={styles.diffPane}>
                                  <span className={styles.diffLabel}>Mutated New State:</span>
                                  <pre className={styles.codePre}>
                                    {JSON.stringify(ev.newState, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
