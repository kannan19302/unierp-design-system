import React, { useId, useState } from "react";
import styles from "./rfi-submission-workflow.module.css";

export interface RfiAttachment {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
}

export interface RfiActivityLogItem {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  action: string;
  comment?: string;
}

export interface RfiSubmissionWorkflowProps {
  rfiNumber: string; // "RFI-2026-089"
  projectTitle: string; // "Hudson Yards Tower C"
  discipline: "Structural Steel" | "MEP" | "Architectural" | "Civil" | "Facade" | string;
  subject: string; // "Discrepancy between Grid line C-4 foundation slab and column anchor bolts"
  questionDetails: string;
  proposedSolution?: string;
  assignedReviewer: string; // "Thornton Tomasetti (Lead Structural)"
  coordinatingContractor: string; // "Turner Construction"
  costImpactEstimate: number; // e.g. 15400
  scheduleImpactDays: number; // e.g. 4
  status: "draft" | "submitted" | "in_review" | "answered" | "closed";
  officialResponse?: string;
  responseAuthor?: string;
  responseDate?: string;
  attachments?: RfiAttachment[];
  activityLog?: RfiActivityLogItem[];
  onSubmitRfi?: (data: { proposedSolution: string; costImpact: number; scheduleImpact: number }) => void;
  onApproveResponse?: (response: string) => void;
  onCloseRfi?: () => void;
  onAddComment?: (comment: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const RfiSubmissionWorkflow: React.FC<RfiSubmissionWorkflowProps> = ({
  rfiNumber,
  projectTitle,
  discipline,
  subject,
  questionDetails,
  proposedSolution: initialProposed = "",
  assignedReviewer,
  coordinatingContractor,
  costImpactEstimate: initialCost = 0,
  scheduleImpactDays: initialSchedule = 0,
  status = "submitted",
  officialResponse,
  responseAuthor,
  responseDate,
  attachments = [],
  activityLog = [],
  onSubmitRfi,
  onApproveResponse,
  onCloseRfi,
  onAddComment,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [proposedSolution, setProposedSolution] = useState(initialProposed);
  const [costImpact, setCostImpact] = useState(initialCost);
  const [scheduleImpact, setScheduleImpact] = useState(initialSchedule);
  const [newComment, setNewComment] = useState("");
  const [responderText, setResponderText] = useState("");

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const getStatusBadgeClass = () => {
    switch (status) {
      case "closed":
        return styles.statusClosed;
      case "answered":
        return styles.statusAnswered;
      case "in_review":
        return styles.statusInReview;
      case "submitted":
        return styles.statusSubmitted;
      default:
        return styles.statusDraft;
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment?.(newComment.trim());
    setNewComment("");
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header Banner */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.metaRow}>
            <span className={styles.rfiBadge}>{rfiNumber}</span>
            <span className={styles.disciplineBadge}>{discipline}</span>
            <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
              {status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {subject}
          </h2>
          <p className={styles.projectSubtitle}>
            Project: <strong>{projectTitle}</strong> &bull; Contractor: {coordinatingContractor}
          </p>
        </div>

        {/* Impact Metric Cards */}
        <div className={styles.impactMetrics}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Cost Impact</span>
            <span className={costImpact > 0 ? styles.metricValueAlert : styles.metricValue}>
              {costImpact > 0 ? `+${formatCurrency(costImpact)}` : "$0 (None)"}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Schedule Impact</span>
            <span className={scheduleImpact > 0 ? styles.metricValueAlert : styles.metricValue}>
              {scheduleImpact > 0 ? `+${scheduleImpact} days` : "0 days"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid: Details & Review vs Activity & Attachments */}
      <div className={styles.workflowGrid}>
        {/* Left Column: Inquiry & Formal Response */}
        <div className={styles.mainColumn}>
          {/* Section 1: Detailed Question */}
          <div className={styles.card}>
            <h3 className={styles.sectionHeader}>Inquiry & Discrepancy Statement</h3>
            <p className={styles.questionText}>{questionDetails}</p>
          </div>

          {/* Section 2: Contractor Proposed Solution */}
          <div className={styles.card}>
            <h3 className={styles.sectionHeader}>Contractor Proposed Solution</h3>
            {status === "draft" || status === "submitted" ? (
              <div className={styles.formGroup}>
                <label htmlFor="rfi-proposed-solution" className={styles.inputLabel}>
                  Recommendation / Suggested Field Modification
                </label>
                <textarea
                  id="rfi-proposed-solution"
                  className={styles.textarea}
                  rows={3}
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  placeholder="State recommended engineering adjustment or drawing revision..."
                />
                <div className={styles.inlineInputs}>
                  <div>
                    <label htmlFor="rfi-cost-impact" className={styles.inputLabel}>
                      Estimated Cost ($)
                    </label>
                    <input
                      id="rfi-cost-impact"
                      type="number"
                      className={styles.inputField}
                      value={costImpact}
                      onChange={(e) => setCostImpact(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="rfi-sched-impact" className={styles.inputLabel}>
                      Schedule Impact (Days)
                    </label>
                    <input
                      id="rfi-sched-impact"
                      type="number"
                      className={styles.inputField}
                      value={scheduleImpact}
                      onChange={(e) => setScheduleImpact(Number(e.target.value))}
                    />
                  </div>
                </div>
                {status === "draft" && (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() =>
                      onSubmitRfi?.({
                        proposedSolution,
                        costImpact,
                        scheduleImpact,
                      })
                    }
                  >
                    Submit RFI for Review
                  </button>
                )}
              </div>
            ) : (
              <p className={styles.solutionText}>
                {proposedSolution || "No specific contractor solution proposed."}
              </p>
            )}
          </div>

          {/* Section 3: Official Engineering Response */}
          <div className={`${styles.card} ${styles.responseCard}`}>
            <div className={styles.responseHeaderRow}>
              <h3 className={styles.sectionHeader}>Official Reviewer Response</h3>
              <span className={styles.reviewerLabel}>Assigned: {assignedReviewer}</span>
            </div>

            {officialResponse ? (
              <div className={styles.officialAnswerBox}>
                <div className={styles.answerMeta}>
                  <span>By: <strong>{responseAuthor ?? assignedReviewer}</strong></span>
                  {responseDate && <span>Date: {responseDate}</span>}
                </div>
                <p className={styles.answerContent}>{officialResponse}</p>
                {status === "answered" && (
                  <div className={styles.actionRow}>
                    <button
                      type="button"
                      className={styles.confirmButton}
                      onClick={() => onCloseRfi?.()}
                    >
                      Acknowledge & Close RFI
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.pendingAnswerBox}>
                <p className={styles.pendingText}>
                  Awaiting formal response from <strong>{assignedReviewer}</strong>.
                </p>
                {status === "in_review" && (
                  <div className={styles.formGroup}>
                    <label htmlFor="rfi-reviewer-text" className={styles.inputLabel}>
                      Provide Official Technical Direction
                    </label>
                    <textarea
                      id="rfi-reviewer-text"
                      className={styles.textarea}
                      rows={4}
                      value={responderText}
                      onChange={(e) => setResponderText(e.target.value)}
                      placeholder="Specify structural modification or refer to amended spec sheet..."
                    />
                    <button
                      type="button"
                      className={styles.primaryButton}
                      disabled={!responderText.trim()}
                      onClick={() => onApproveResponse?.(responderText)}
                    >
                      Issue Official Engineering Response
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attachments & Audit Activity Feed */}
        <div className={styles.sideColumn}>
          {/* Attachments Section */}
          <div className={styles.card}>
            <div className={styles.cardHeaderWithCount}>
              <h3 className={styles.sectionHeader}>Spec Attachments</h3>
              <span className={styles.counterBadge}>{attachments.length}</span>
            </div>
            {attachments.length === 0 ? (
              <p className={styles.emptyNote}>No spec sheets or sketches attached.</p>
            ) : (
              <ul className={styles.attachmentList}>
                {attachments.map((att) => (
                  <li key={att.id} className={styles.attachmentItem}>
                    <div className={styles.fileIcon} aria-hidden="true">
                      📄
                    </div>
                    <div className={styles.fileDetails}>
                      <span className={styles.fileName}>{att.name}</span>
                      <span className={styles.fileSize}>
                        {att.type} &bull; {formatFileSize(att.sizeBytes)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.downloadButton}
                      aria-label={`Download attachment ${att.name}`}
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity Log / Discussion */}
          <div className={styles.card}>
            <div className={styles.cardHeaderWithCount}>
              <h3 className={styles.sectionHeader}>RFI Audit Trail</h3>
              <span className={styles.counterBadge}>{activityLog.length}</span>
            </div>

            <div className={styles.activityFeed}>
              {activityLog.map((log) => (
                <div key={log.id} className={styles.logItem}>
                  <div className={styles.logBullet} aria-hidden="true" />
                  <div className={styles.logContent}>
                    <div className={styles.logMeta}>
                      <span className={styles.logAuthor}>{log.author}</span>
                      <span className={styles.logTime}>{log.timestamp}</span>
                    </div>
                    <p className={styles.logAction}>
                      <strong>{log.role}:</strong> {log.action}
                    </p>
                    {log.comment && <p className={styles.logComment}>&ldquo;{log.comment}&rdquo;</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <label htmlFor="rfi-new-comment" className={styles.srOnly}>
                Add clarification note
              </label>
              <input
                id="rfi-new-comment"
                type="text"
                className={styles.commentInput}
                placeholder="Add clarification note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className={styles.secondaryButton}
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
