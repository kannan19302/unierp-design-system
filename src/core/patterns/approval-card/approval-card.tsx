import { forwardRef, type HTMLAttributes } from "react";
import styles from "./approval-card.module.css";

export interface ApprovalCardProps extends HTMLAttributes<HTMLDivElement> {
  requestTitle?: string;
  requesterName?: string;
  amount?: string;
  department?: string;
  submissionDate?: string;
  onApprove?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
}

export const ApprovalCard = forwardRef<HTMLDivElement, ApprovalCardProps>(
  (
    {
      requestTitle = "Capital Expenditure Request #CAP-204",
      requesterName = "Sarah Chen (VP Supply Chain)",
      amount = "$148,500.00 USD",
      department = "Logistics & Fleet",
      submissionDate = "2026-09-21 14:32 UTC",
      onApprove,
      onReject,
      isLoading = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${className}`}
        role="article"
        aria-label={`Approval request: ${requestTitle}`}
        {...props}
      >
        <div className={styles.header}>
          <div className={styles.badge}>Pending Approval</div>
          <span className={styles.date}>{submissionDate}</span>
        </div>

        <h3 className={styles.title}>{requestTitle}</h3>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Requester</span>
            <span className={styles.value}>{requesterName}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Department</span>
            <span className={styles.value}>{department}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Total Amount</span>
            <span className={styles.amount}>{amount}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.rejectBtn}
            onClick={onReject}
            disabled={isLoading}
          >
            Reject Request
          </button>
          <button
            type="button"
            className={styles.approveBtn}
            onClick={onApprove}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve & Sign"}
          </button>
        </div>
      </div>
    );
  }
);

ApprovalCard.displayName = "ApprovalCard";
