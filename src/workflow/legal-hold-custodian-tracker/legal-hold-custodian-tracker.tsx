import React, { useId, useState } from "react";
import styles from "./legal-hold-custodian-tracker.module.css";

export type LegalHoldStatus = "ACKNOWLEDGED" | "PENDING" | "ESCALATED" | "RELEASED";

export interface LegalMatterInfo {
  matterNumber: string; // "MAT-2026-881"
  matterName: string; // "FTC Antitrust Investigation - Project Horizon"
  issuingCounsel: string; // "Cravath, Swaine & Moore LLP"
  effectiveDate: string; // "2026-03-01"
}

export interface LegalHoldCustodian {
  id: string;
  name: string; // "Dr. Julian Vance"
  department: string; // "Product Engineering & Architecture"
  email: string; // "jvance@enterprise.com"
  acknowledgmentStatus: LegalHoldStatus;
  acknowledgedAt?: string; // "2026-03-02 09:14 EST"
  dataSourcesPreserved: string[]; // ["Exchange Mailbox", "OneDrive", "Slack", "GitHub"]
  silentPreservationActive: boolean;
}

export interface LegalHoldCustodianTrackerProps {
  matter: LegalMatterInfo;
  custodians: LegalHoldCustodian[];
  onSendEscalationReminder?: (custodianId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const LegalHoldCustodianTracker: React.FC<LegalHoldCustodianTrackerProps> = ({
  matter,
  custodians: initialCustodians,
  onSendEscalationReminder,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [custodians, setCustodians] = useState<LegalHoldCustodian[]>(initialCustodians);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = custodians.filter((c) =>
    statusFilter === "ALL" ? true : c.acknowledgmentStatus === statusFilter
  );

  const ackCount = custodians.filter((c) => c.acknowledgmentStatus === "ACKNOWLEDGED").length;
  const pendingCount = custodians.filter((c) => c.acknowledgmentStatus === "PENDING").length;
  const escalatedCount = custodians.filter((c) => c.acknowledgmentStatus === "ESCALATED").length;

  const handleEscalate = (custodianId: string) => {
    setCustodians((prev) =>
      prev.map((c) =>
        c.id === custodianId ? { ...c, acknowledgmentStatus: "ESCALATED" as LegalHoldStatus } : c
      )
    );
    onSendEscalationReminder?.(custodianId);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.matterBadgeGroup}>
            <span className={styles.legalBadge}>LEGAL HOLD &amp; EDISCOVERY LITIGATION</span>
            <span className={styles.matterNumBadge}>{matter.matterNumber}</span>
          </div>

          <div className={styles.kpiPills}>
            <span className={styles.kpiAck}>{ackCount} Acknowledged</span>
            <span className={styles.kpiPending}>{pendingCount} Pending</span>
            {escalatedCount > 0 && (
              <span className={styles.kpiEscalated}>{escalatedCount} Escalated</span>
            )}
          </div>
        </div>

        <div className={styles.titleRow}>
          <div>
            <h2 id={headingId} className={styles.title}>
              Legal Hold Notice Custodian Compliance &amp; Preservation Log
            </h2>
            <div className={styles.matterSubtext}>
              {matter.matterName} • Counsel: {matter.issuingCounsel} • Effective {matter.effectiveDate}
            </div>
          </div>

          <div className={styles.filterControl}>
            <label htmlFor={`${headingId}-filter`} className={styles.filterLabel}>
              Filter Status:
            </label>
            <select
              id={`${headingId}-filter`}
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Custodians ({custodians.length})</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="PENDING">Pending Notice</option>
              <option value="ESCALATED">Escalated to Manager</option>
              <option value="RELEASED">Released from Hold</option>
            </select>
          </div>
        </div>
      </header>

      {/* Custodians Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Legal hold custodian audit register">
          <thead>
            <tr>
              <th scope="col">Custodian &amp; Department</th>
              <th scope="col">Corporate Email</th>
              <th scope="col">Notice Status</th>
              <th scope="col">Signed Timestamp</th>
              <th scope="col">Preserved Data Repositories</th>
              <th scope="col">Silent Hold</th>
              <th scope="col">Compliance Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cust) => {
              const isAck = cust.acknowledgmentStatus === "ACKNOWLEDGED";
              const isEscalated = cust.acknowledgmentStatus === "ESCALATED";

              return (
                <tr key={cust.id} className={isEscalated ? styles.escalatedRow : ""}>
                  <td>
                    <div className={styles.custodianCell}>
                      <span className={styles.custodianName}>{cust.name}</span>
                      <span className={styles.departmentName}>{cust.department}</span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>{cust.email}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        isAck
                          ? styles.statusAck
                          : isEscalated
                          ? styles.statusEscalated
                          : cust.acknowledgmentStatus === "PENDING"
                          ? styles.statusPending
                          : styles.statusReleased
                      }`}
                    >
                      {cust.acknowledgmentStatus}
                    </span>
                  </td>
                  <td className={styles.monoCell}>
                    {cust.acknowledgedAt ?? "Awaiting Signature"}
                  </td>
                  <td>
                    <div className={styles.repoList}>
                      {cust.dataSourcesPreserved.map((repo, i) => (
                        <span key={i} className={styles.repoPill}>
                          {repo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.silentBadge} ${
                        cust.silentPreservationActive ? styles.silentActive : styles.silentInactive
                      }`}
                    >
                      {cust.silentPreservationActive ? "LITIGATION HOLD LOCK" : "STANDARD"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.remindBtn}
                      onClick={() => handleEscalate(cust.id)}
                      disabled={isAck || cust.acknowledgmentStatus === "RELEASED"}
                      aria-label={`Send escalation notice to ${cust.name}`}
                    >
                      {isAck ? "Compliant" : isEscalated ? "Escalation Sent" : "Send Escalation"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Enforces Federal Rules of Civil Procedure (FRCP) Rule 37(e) spoliation sanctions defense. Silent holds preserve M365 and Slack content automatically.
        </span>
      </footer>
    </section>
  );
};
