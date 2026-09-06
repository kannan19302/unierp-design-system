import React, { useId, useState } from "react";
import styles from "./security-waf-rule-inspector.module.css";

export type ThreatCategory =
  | "SQL_INJECTION"
  | "XSS_SCRIPTING"
  | "CREDENTIAL_STUFFING"
  | "BAD_BOT"
  | "RATE_ABUSE";

export type WafActionTaken = "BLOCKED" | "CHALLENGED" | "LOGGED";

export interface WafSecurityEventItem {
  id: string; // "waf_evt_8841"
  timestamp: string; // "2026-09-06 05:22:14 UTC"
  clientIp: string; // "198.51.100.42"
  countryIso: string; // "RO"
  uriPath: string; // "/api/v1/auth/login"
  httpMethod: string; // "POST"
  threatCategory: ThreatCategory;
  ruleMatched: string; // "OWASP CRS 942100: SQLi Operator Detected"
  actionTaken: WafActionTaken;
  asnNumber: number; // AS13335
}

export interface SecurityWafRuleInspectorProps {
  events: WafSecurityEventItem[];
  onBlockIp?: (ip: string) => void;
  onAllowlistIp?: (ip: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SecurityWafRuleInspector: React.FC<SecurityWafRuleInspectorProps> = ({
  events: initialEvents,
  onBlockIp,
  onAllowlistIp,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [events] = useState<WafSecurityEventItem[]>(initialEvents);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [managedIps, setManagedIps] = useState<Record<string, "BLOCKED" | "ALLOWED">>({});

  const filtered = events.filter((e) =>
    categoryFilter === "ALL" ? true : e.threatCategory === categoryFilter
  );

  const blockedCount = events.filter((e) => e.actionTaken === "BLOCKED").length;
  const challengedCount = events.filter((e) => e.actionTaken === "CHALLENGED").length;

  const handleBlock = (ip: string) => {
    setManagedIps((prev) => ({ ...prev, [ip]: "BLOCKED" }));
    onBlockIp?.(ip);
  };

  const handleAllow = (ip: string) => {
    setManagedIps((prev) => ({ ...prev, [ip]: "ALLOWED" }));
    onAllowlistIp?.(ip);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.wafBadge}>WAF SECURITY LOG &amp; THREAT INSPECTOR</span>
            <span className={styles.engineBadge}>OWASP MODSECURITY CORE RULESET 4.0</span>
          </div>

          <div className={styles.kpiPills}>
            <span className={styles.kpiBlocked}>{blockedCount} Threats Blocked</span>
            <span className={styles.kpiChallenged}>{challengedCount} Bot Challenges</span>
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Edge Web Application Firewall Threat Stream
          </h2>

          <div className={styles.filterControl}>
            <label htmlFor={`${headingId}-filter`} className={styles.filterLabel}>
              Filter Threat:
            </label>
            <select
              id={`${headingId}-filter`}
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Threat Signatures ({events.length})</option>
              <option value="SQL_INJECTION">SQL Injection</option>
              <option value="XSS_SCRIPTING">Cross-Site Scripting</option>
              <option value="CREDENTIAL_STUFFING">Credential Stuffing</option>
              <option value="BAD_BOT">Automated Bad Bot</option>
              <option value="RATE_ABUSE">Rate Limit Abuse</option>
            </select>
          </div>
        </div>
      </header>

      {/* Events Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="WAF security threats and mitigated events">
          <thead>
            <tr>
              <th scope="col">Mitigation Action</th>
              <th scope="col">Threat Signature</th>
              <th scope="col">Client IP &amp; Origin</th>
              <th scope="col">HTTP Target</th>
              <th scope="col">OWASP Rule Matched</th>
              <th scope="col">Timestamp</th>
              <th scope="col">Mitigation Override</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const currentStatus = managedIps[item.clientIp];
              const isBlocked = item.actionTaken === "BLOCKED" || currentStatus === "BLOCKED";
              const isChallenged = item.actionTaken === "CHALLENGED";

              return (
                <tr key={item.id} className={isBlocked ? styles.blockedRow : ""}>
                  <td>
                    <span
                      className={`${styles.actionBadge} ${
                        isBlocked
                          ? styles.actionBlocked
                          : isChallenged
                          ? styles.actionChallenged
                          : styles.actionLogged
                      }`}
                    >
                      {currentStatus ?? item.actionTaken}
                    </span>
                  </td>
                  <td>
                    <span className={styles.threatBadge}>
                      {item.threatCategory.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <div className={styles.ipCell}>
                      <span className={styles.ipAddress}>{item.clientIp}</span>
                      <span className={styles.geoText}>
                        [{item.countryIso}] AS{item.asnNumber}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.targetCell}>
                      <span className={styles.httpMethod}>{item.httpMethod}</span>
                      <span className={styles.uriPath}>{item.uriPath}</span>
                    </div>
                  </td>
                  <td className={styles.ruleCell}>{item.ruleMatched}</td>
                  <td className={styles.monoCell}>{item.timestamp}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        type="button"
                        className={styles.blockBtn}
                        onClick={() => handleBlock(item.clientIp)}
                        disabled={currentStatus === "BLOCKED"}
                        aria-label={`Permanently block IP ${item.clientIp}`}
                      >
                        Block IP
                      </button>
                      <button
                        type="button"
                        className={styles.allowBtn}
                        onClick={() => handleAllow(item.clientIp)}
                        disabled={currentStatus === "ALLOWED"}
                        aria-label={`Allowlist IP ${item.clientIp}`}
                      >
                        Allow
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Edge inspection active across all globally distributed POP locations. Blocks sync to Cloudflare API / iptables within 50ms.
        </span>
      </footer>
    </section>
  );
};
