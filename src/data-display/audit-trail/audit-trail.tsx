"use client";

import { type FC, type ReactNode } from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import styles from "./audit-trail.module.css";

export interface ApprovalStep {
  id: string;
  approver: string;
  role?: string;
  status: "approved" | "pending" | "rejected";
  timestamp?: string;
  notes?: string;
}

export interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  className?: string;
}

export const ApprovalTimeline: FC<ApprovalTimelineProps> = ({
  steps,
  className = "",
}) => {
  return (
    <div className={`${styles.approvalContainer} ${className}`.trim()}>
      {steps.map((step) => {
        const isApproved = step.status === "approved";
        const isRejected = step.status === "rejected";

        return (
          <div key={step.id} className={styles.approvalStep}>
            <div className={styles.stepIconWrap}>
              {isApproved ? (
                <CheckCircle2 size={16} className={styles.approvedIcon} aria-hidden="true" />
              ) : isRejected ? (
                <XCircle size={16} className={styles.rejectedIcon} aria-hidden="true" />
              ) : (
                <Clock size={16} className={styles.pendingIcon} aria-hidden="true" />
              )}
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <span className={styles.approver}>{step.approver}</span>
                {step.role && <span className={styles.role}>({step.role})</span>}
                <span className={`${styles.statusBadge} ${styles[step.status]}`}>
                  {step.status}
                </span>
                {step.timestamp && (
                  <span className={styles.timestamp}>{step.timestamp}</span>
                )}
              </div>
              {step.notes && <div className={styles.stepNotes}>{step.notes}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  time: string;
  hash?: string;
}

export interface AuditTrailPanelProps {
  title?: ReactNode;
  logs: AuditLogItem[];
  className?: string;
}

export const AuditTrailPanel: FC<AuditTrailPanelProps> = ({
  title = "Audit Trail & Verification",
  logs,
  className = "",
}) => {
  return (
    <div className={`${styles.auditPanel} ${className}`.trim()}>
      <div className={styles.auditHeader}>
        <ShieldCheck size={14} className={styles.shieldIcon} aria-hidden="true" />
        <h4 className={styles.auditTitle}>{title}</h4>
      </div>
      <div className={styles.logList}>
        {logs.map((log) => (
          <div key={log.id} className={styles.logRow}>
            <div className={styles.logMeta}>
              <span className={styles.logUser}>{log.user}</span>
              <span className={styles.logAction}>{log.action}</span>
            </div>
            <div className={styles.logTimeRow}>
              <span className={styles.logTime}>{log.time}</span>
              {log.hash && <span className={styles.logHash}>{log.hash}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
