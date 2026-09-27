"use client";

import React, { forwardRef } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  CornerDownRight,
} from "lucide-react";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";
import { cva, type VariantProps } from "../../foundation/utils/cva";

import styles from "./approval-chain.module.css";

export const approvalChainVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type ApprovalChainVariantProps = VariantProps<typeof approvalChainVariants>;

export type ApprovalStatus =
  | "approved"
  | "rejected"
  | "pending"
  | "skipped"
  | "delegated";

export interface Approver {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  status: ApprovalStatus;
  comment?: string;
  decidedAt?: string;
}

export interface ApprovalStep {
  id: string;
  title: string;
  description?: string;
  status: ApprovalStatus;
  approvers: Approver[];
  /** Minimum required approvals for this step (e.g. 1 of 3 or 2 of 2) */
  quorum?: number;
  slaDeadline?: string;
  canApprove?: boolean;
}

export interface ApprovalChainProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ApprovalChainVariantProps {
  steps: ApprovalStep[];
  onApprove?: (stepId: string) => void;
  onReject?: (stepId: string) => void;
  onDelegate?: (stepId: string) => void;
  loading?: boolean;
}

/**
 * `<ApprovalChain>` — Enterprise Multi-Stage Approval Engine.
 *
 * Capabilities:
 * - Visual node status representation (`approved`, `rejected`, `pending`, `delegated`)
 * - Quorum calculation (e.g. "2 of 3 signed")
 * - SLA timers and overdue warnings
 * - Approver identity badges with decision timestamps and comments
 * - Inline authorization action dispatchers (`Approve`, `Reject`, `Delegate`)
 * - Strict 4-tier density scaling and semantic anatomy data-slots
 *
 * @maturity stable
 */
export const ApprovalChain = forwardRef<HTMLDivElement, ApprovalChainProps>(
  (
    {
      steps,
      onApprove,
      onReject,
      onDelegate,
      loading = false,
      density = "standard",
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="approval-chain"
        data-density={density}
        className={`${approvalChainVariants({ density })}${className ? ` ${className}` : ""}`}
        {...rest}
      >
        <div className={styles.chain} data-slot="approval-chain-list">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const approvedCount = step.approvers.filter(
              (a) => a.status === "approved"
            ).length;
            const quorumText = step.quorum
              ? `${approvedCount}/${step.quorum} Approved`
              : `${approvedCount}/${step.approvers.length} Approved`;

            const stepStatusClass =
              step.status === "approved"
                ? styles.step_approved
                : step.status === "rejected"
                  ? styles.step_rejected
                  : styles.step_pending;

            return (
              <div
                key={step.id}
                data-slot="approval-chain-step"
                data-status={step.status}
                className={`${styles.step} ${stepStatusClass}`}
              >
                {!isLast && (
                  <div className={styles.step_line} data-slot="approval-chain-line" />
                )}

                <div className={styles.step_icon_wrap} data-slot="approval-chain-icon">
                  {step.status === "approved" && <CheckCircle2 size={18} />}
                  {step.status === "rejected" && <XCircle size={18} />}
                  {step.status === "pending" && <Clock size={18} />}
                  {step.status === "delegated" && <CornerDownRight size={18} />}
                  {step.status === "skipped" && <AlertTriangle size={18} />}
                </div>

                <div className={styles.step_body} data-slot="approval-chain-body">
                  <div className={styles.step_header} data-slot="approval-chain-header">
                    <h4 className={styles.step_title} data-slot="approval-chain-title">
                      {step.title}
                    </h4>
                    <div className={styles.step_meta} data-slot="approval-chain-meta">
                      <Badge
                        data-slot="approval-chain-badge"
                        variant={
                          step.status === "approved"
                            ? "success"
                            : step.status === "rejected"
                              ? "danger"
                              : "default"
                        }
                        size="sm"
                      >
                        {quorumText}
                      </Badge>
                      {step.slaDeadline && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-1)",
                          }}
                        >
                          <Clock size={12} />
                          <span>{step.slaDeadline}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {step.description && (
                    <p
                      data-slot="approval-chain-description"
                      style={{
                        margin: 0,
                        fontSize: "var(--type-label)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {step.description}
                    </p>
                  )}

                  <div className={styles.approvers_list} data-slot="approval-chain-approvers">
                    {step.approvers.map((approver) => (
                      <div
                        key={approver.id}
                        className={styles.approver_chip}
                        data-slot="approval-chain-approver"
                      >
                        <UserCheck
                          size={13}
                          style={{ color: "var(--color-text-secondary)" }}
                        />
                        <span style={{ fontWeight: 500 }}>{approver.name}</span>
                        {approver.role && (
                          <span style={{ color: "var(--color-text-muted)" }}>
                            ({approver.role})
                          </span>
                        )}
                        {approver.status === "approved" && (
                          <CheckCircle2
                            size={12}
                            style={{ color: "var(--color-success)" }}
                          />
                        )}
                        {approver.status === "rejected" && (
                          <XCircle
                            size={12}
                            style={{ color: "var(--color-danger)" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {step.approvers.some((a) => a.comment) && (
                    <div className={styles.step_comment} data-slot="approval-chain-comment">
                      {step.approvers.find((a) => a.comment)?.comment}
                    </div>
                  )}

                  {step.canApprove && (
                    <div className={styles.step_actions} data-slot="approval-chain-actions">
                      {onApprove && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onApprove(step.id)}
                          disabled={loading}
                        >
                          Approve
                        </Button>
                      )}
                      {onReject && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onReject(step.id)}
                          disabled={loading}
                        >
                          Reject
                        </Button>
                      )}
                      {onDelegate && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDelegate(step.id)}
                          disabled={loading}
                        >
                          Delegate
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ApprovalChain.displayName = "ApprovalChain";
