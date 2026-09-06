import React, { useId, useState } from "react";
import styles from "./construction-submittal-register.module.css";

export type ConstructionSubmittalStatus =
  | "APPROVED"
  | "APPROVED_AS_NOTED"
  | "REVISE_RESUBMIT"
  | "PENDING_REVIEW"
  | "OVERDUE";

export interface ConstructionSubmittalItem {
  id: string; // "sub_033000_14"
  submittalNumber: string; // "03-3000-014"
  specSection: string; // "03 30 00 Cast-in-Place Concrete"
  title: string; // "High-Strength Structural Concrete Mix Design C-40"
  subcontractor: string; // "Apex Structural Pours LLC"
  reviewer: string; // "Thornton Tomasetti Structural Engineering"
  status: ConstructionSubmittalStatus;
  leadTimeWeeks: number; // 4
  requiredOnSiteDate: string; // "2026-10-15"
  ballInCourt: string; // "Lead Structural Engineer"
}

export interface ConstructionSubmittalRegisterProps {
  submittals: ConstructionSubmittalItem[];
  projectName?: string;
  onUpdateStatus?: (submittalId: string, status: ConstructionSubmittalStatus) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ConstructionSubmittalRegister: React.FC<ConstructionSubmittalRegisterProps> = ({
  submittals: initialSubmittals,
  projectName = "Hudson Yards Tower IV Construction",
  onUpdateStatus,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [submittals, setSubmittals] = useState<ConstructionSubmittalItem[]>(initialSubmittals);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = submittals.filter((s) =>
    statusFilter === "ALL" ? true : s.status === statusFilter
  );

  const approvedCount = submittals.filter(
    (s) => s.status === "APPROVED" || s.status === "APPROVED_AS_NOTED"
  ).length;
  const overdueCount = submittals.filter((s) => s.status === "OVERDUE").length;
  const pendingCount = submittals.filter((s) => s.status === "PENDING_REVIEW").length;

  const handleStatusChange = (submittalId: string, newStatus: ConstructionSubmittalStatus) => {
    setSubmittals((prev) =>
      prev.map((s) => (s.id === submittalId ? { ...s, status: newStatus } : s))
    );
    onUpdateStatus?.(submittalId, newStatus);
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
            <span className={styles.epcBadge}>AEC &amp; EPC ENGINEERING REGISTER</span>
            <span className={styles.projectBadge}>{projectName}</span>
          </div>
          <div className={styles.kpiPills}>
            <span className={styles.kpiApproved}>{approvedCount} Approved</span>
            <span className={styles.kpiPending}>{pendingCount} In Review</span>
            {overdueCount > 0 && <span className={styles.kpiOverdue}>{overdueCount} Overdue</span>}
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Master Construction Submittal Register &amp; CSI Spec Log
          </h2>

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
              <option value="ALL">All Submittals ({submittals.length})</option>
              <option value="APPROVED">Approved</option>
              <option value="APPROVED_AS_NOTED">Approved as Noted</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="REVISE_RESUBMIT">Revise &amp; Resubmit</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Construction submittal register log">
          <thead>
            <tr>
              <th scope="col">Submittal #</th>
              <th scope="col">CSI Spec Section</th>
              <th scope="col">Title &amp; Package</th>
              <th scope="col">Subcontractor</th>
              <th scope="col">Reviewer &amp; Ball In Court</th>
              <th scope="col">Required On-Site</th>
              <th scope="col">Lead Time</th>
              <th scope="col">Status</th>
              <th scope="col">Review Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              return (
                <tr key={item.id} className={item.status === "OVERDUE" ? styles.overdueRow : ""}>
                  <td className={styles.monoCell}>
                    <span className={styles.submittalNum}>{item.submittalNumber}</span>
                  </td>
                  <td>
                    <span className={styles.specBadge}>{item.specSection}</span>
                  </td>
                  <td>
                    <div className={styles.titleCell}>
                      <span className={styles.submittalTitle}>{item.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.subcontractorName}>{item.subcontractor}</span>
                  </td>
                  <td>
                    <div className={styles.reviewerCell}>
                      <span className={styles.reviewerName}>{item.reviewer}</span>
                      <span className={styles.ballInCourt}>BIC: {item.ballInCourt}</span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>{item.requiredOnSiteDate}</td>
                  <td>{item.leadTimeWeeks} wks</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        item.status === "APPROVED"
                          ? styles.statusApproved
                          : item.status === "APPROVED_AS_NOTED"
                          ? styles.statusNoted
                          : item.status === "PENDING_REVIEW"
                          ? styles.statusPending
                          : item.status === "OVERDUE"
                          ? styles.statusOverdue
                          : styles.statusRevise
                      }`}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.actionSelect}
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as ConstructionSubmittalStatus)
                      }
                      aria-label={`Update status for submittal ${item.submittalNumber}`}
                    >
                      <option value="APPROVED">Approve</option>
                      <option value="APPROVED_AS_NOTED">Approve As Noted</option>
                      <option value="PENDING_REVIEW">In Review</option>
                      <option value="REVISE_RESUBMIT">Revise &amp; Resubmit</option>
                      <option value="OVERDUE">Mark Overdue</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Submittals adhere to MasterFormat 2020 CSI specifications. All review decisions logged into the immutable project audit trail.
        </span>
      </footer>
    </section>
  );
};
