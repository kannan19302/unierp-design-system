import React, { useId, useState } from "react";
import styles from "./customer-sla-breach-timeline.module.css";

export type SlaSeverityLevel = "P1_CRITICAL" | "P2_MAJOR" | "P3_MINOR";
export type SlaBreachStatus = "WITHIN_SLA" | "AT_RISK" | "BREACHED";

export interface CustomerSlaTicket {
  id: string;
  title: string;
  priority: SlaSeverityLevel;
  openedAt: string;
  targetResolutionTime: string;
  timeRemainingMinutes: number;
  breachStatus: SlaBreachStatus;
  financialPenaltyAccrued: number;
  escalationTier: "TIER_1_ONCALL" | "TIER_2_DEV_LEAD" | "TIER_3_VP_ENG";
  isEscalated: boolean;
}

export const defaultSlaTickets: CustomerSlaTicket[] = [
  {
    id: "INC-9901",
    title: "Global Transaction Gateway 504 Gateway Timeouts",
    priority: "P1_CRITICAL",
    openedAt: "2026-09-06 06:30 UTC",
    targetResolutionTime: "30 mins",
    timeRemainingMinutes: -45,
    breachStatus: "BREACHED",
    financialPenaltyAccrued: 15000,
    escalationTier: "TIER_3_VP_ENG",
    isEscalated: false,
  },
  {
    id: "INC-9904",
    title: "Secondary Index Replication Lag > 5000ms",
    priority: "P2_MAJOR",
    openedAt: "2026-09-06 08:00 UTC",
    targetResolutionTime: "2 hours",
    timeRemainingMinutes: 25,
    breachStatus: "AT_RISK",
    financialPenaltyAccrued: 0,
    escalationTier: "TIER_2_DEV_LEAD",
    isEscalated: false,
  },
  {
    id: "INC-9877",
    title: "Webhook Payload Signature Verification Flakiness",
    priority: "P3_MINOR",
    openedAt: "2026-09-06 05:00 UTC",
    targetResolutionTime: "8 hours",
    timeRemainingMinutes: 240,
    breachStatus: "WITHIN_SLA",
    financialPenaltyAccrued: 0,
    escalationTier: "TIER_1_ONCALL",
    isEscalated: false,
  },
];

export interface CustomerSlaBreachTimelineProps {
  accountName?: string;
  tier?: string;
  msaContractId?: string;
  tickets?: CustomerSlaTicket[];
  onEscalateTicket?: (ticketId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CustomerSlaBreachTimeline: React.FC<CustomerSlaBreachTimelineProps> = ({
  accountName = "Morgan & Stanley Global Markets",
  tier = "Platinum Enterprise (99.99% Availability)",
  msaContractId = "MSA-2024-MS-009",
  tickets = defaultSlaTickets,
  onEscalateTicket,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const priorityFilterId = useId();
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [ticketList, setTicketList] = useState<CustomerSlaTicket[]>(tickets);

  const handleEscalate = (ticketId: string) => {
    setTicketList((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, isEscalated: true } : t))
    );
    onEscalateTicket?.(ticketId);
  };

  const filteredTickets = ticketList.filter((t) => {
    if (filterPriority === "ALL") return true;
    return t.priority === filterPriority;
  });

  const totalPenalties = ticketList.reduce((acc, t) => acc + t.financialPenaltyAccrued, 0);
  const breachedCount = ticketList.filter((t) => t.breachStatus === "BREACHED").length;
  const atRiskCount = ticketList.filter((t) => t.breachStatus === "AT_RISK").length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getPriorityClass = (pri: SlaSeverityLevel) => {
    switch (pri) {
      case "P1_CRITICAL":
        return styles.p1Critical;
      case "P2_MAJOR":
        return styles.p2Major;
      case "P3_MINOR":
        return styles.p3Minor;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.accountMeta}>
            <span className={styles.tierBadge}>{tier}</span>
            <span className={styles.accountName}>{accountName}</span>
            <span className={styles.msaRef}>{msaContractId}</span>
          </div>

          <div className={styles.filterControls}>
            <label htmlFor={priorityFilterId} className={styles.selectLabel}>
              Filter Priority:
            </label>
            <select
              id={priorityFilterId}
              className={styles.selectInput}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter incidents by priority level"
            >
              <option value="ALL">All Incidents ({ticketList.length})</option>
              <option value="P1_CRITICAL">P1 Critical</option>
              <option value="P2_MAJOR">P2 Major</option>
              <option value="P3_MINOR">P3 Minor</option>
            </select>
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Enterprise Customer SLA Breach Timeline &amp; Penalty Accrual
          </h2>
        </div>
      </header>

      {/* Summary KPI Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Breached Incidents</span>
          <span className={`${styles.kpiValue} ${breachedCount > 0 ? styles.penaltyValue : ""}`}>
            {breachedCount}
          </span>
        </div>
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>At-Risk (&lt; 30m)</span>
          <span className={styles.kpiValue}>{atRiskCount}</span>
        </div>
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Total SLA Service Credits</span>
          <span className={`${styles.kpiValue} ${styles.penaltyValue}`}>
            {formatCurrency(totalPenalties)}
          </span>
        </div>
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Uptime Commitment</span>
          <span className={styles.kpiValue}>99.99% (Monthly)</span>
        </div>
      </div>

      {/* Incident List */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Active Incidents and SLA Timelines">
          <thead>
            <tr>
              <th scope="col">Incident Details</th>
              <th scope="col">Severity</th>
              <th scope="col">Target MTTR</th>
              <th scope="col">SLA Status / Time Remaining</th>
              <th scope="col">Financial Penalty</th>
              <th scope="col">Escalation Tier</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className={styles.incidentCell}>
                    <span className={styles.incidentId}>{t.id}</span>
                    <span className={styles.incidentTitle}>{t.title}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.priorityPill} ${getPriorityClass(t.priority)}`}>
                    {t.priority.replace("_", " ")}
                  </span>
                </td>
                <td>{t.targetResolutionTime}</td>
                <td>
                  {t.breachStatus === "BREACHED" ? (
                    <span className={`${styles.countdownPill} ${styles.breachedCount}`}>
                      BREACHED ({Math.abs(t.timeRemainingMinutes)}m ago)
                    </span>
                  ) : t.breachStatus === "AT_RISK" ? (
                    <span className={`${styles.countdownPill} ${styles.breachedCount}`}>
                      AT RISK ({t.timeRemainingMinutes}m left)
                    </span>
                  ) : (
                    <span className={`${styles.countdownPill} ${styles.safeCount}`}>
                      ON TRACK ({t.timeRemainingMinutes}m left)
                    </span>
                  )}
                </td>
                <td>
                  <span className={t.financialPenaltyAccrued > 0 ? styles.penaltyValue : ""}>
                    {formatCurrency(t.financialPenaltyAccrued)}
                  </span>
                </td>
                <td>{t.escalationTier.replace(/_/g, " ")}</td>
                <td>
                  {t.isEscalated ? (
                    <span className={styles.escalatedBadge}>Executive Escalated</span>
                  ) : (
                    <button
                      type="button"
                      className={styles.escalateBtn}
                      onClick={() => handleEscalate(t.id)}
                      aria-label={`Escalate SLA breach for ${t.id}`}
                    >
                      Escalate Tier
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span>ITIL v4 Service Level Agreement &amp; Financial Credit Calculation Engine.</span>
        <span>Calendar: 24x7x365 Enterprise Platinum Tier</span>
      </footer>
    </section>
  );
};
