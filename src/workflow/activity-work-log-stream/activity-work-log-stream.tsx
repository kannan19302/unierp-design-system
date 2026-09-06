import React, { useState, useId } from "react";
import styles from "./activity-work-log-stream.module.css";

export type WorkLogEntryType = "internal_note" | "customer_reply" | "system_audit" | "status_change";

export interface WorkLogEntry {
  id: string;
  type: WorkLogEntryType;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  createdAt: string;
  content: string;
  attachments?: Array<{ name: string; sizeBytes?: number }>;
}

export interface ActivityWorkLogStreamProps {
  /** Log entries in chronological or reverse-chronological order */
  entries: WorkLogEntry[];
  /** Callback fired when a new log entry is submitted */
  onSubmitEntry?: (entry: { type: "internal_note" | "customer_reply"; content: string }) => void;
  /** Current logged in user name */
  currentUser?: { name: string; avatar?: string };
  /** Default mode for composer */
  defaultComposerType?: "internal_note" | "customer_reply";
  /** Density */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const ActivityWorkLogStream: React.FC<ActivityWorkLogStreamProps> = ({
  entries,
  onSubmitEntry,
  currentUser = { name: "System Admin" },
  defaultComposerType = "internal_note",
  density = "compact",
  className,
}) => {
  const streamId = useId();
  const [filter, setFilter] = useState<"all" | WorkLogEntryType>("all");
  const [composerType, setComposerType] = useState<"internal_note" | "customer_reply">(defaultComposerType);
  const [draftContent, setDraftContent] = useState("");

  const filteredEntries = entries.filter((e) => {
    if (filter === "all") return true;
    return e.type === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftContent.trim()) return;
    onSubmitEntry?.({
      type: composerType,
      content: draftContent.trim(),
    });
    setDraftContent("");
  };

  const isInternal = composerType === "internal_note";

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${streamId}-title`}
    >
      {/* Stream Header & Filter Tabs */}
      <div className={styles.header}>
        <h3 id={`${streamId}-title`} className={styles.streamTitle}>
          Activity &amp; Work Log
        </h3>
        <div className={styles.filterTabs} role="tablist" aria-label="Filter work log entries">
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            className={`${styles.filterTab} ${filter === "all" ? styles.filterTabActive : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({entries.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "internal_note"}
            className={`${styles.filterTab} ${filter === "internal_note" ? styles.filterTabActive : ""}`}
            onClick={() => setFilter("internal_note")}
          >
            Internal Notes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "customer_reply"}
            className={`${styles.filterTab} ${filter === "customer_reply" ? styles.filterTabActive : ""}`}
            onClick={() => setFilter("customer_reply")}
          >
            Customer Visible
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "system_audit"}
            className={`${styles.filterTab} ${filter === "system_audit" ? styles.filterTabActive : ""}`}
            onClick={() => setFilter("system_audit")}
          >
            Audit Events
          </button>
        </div>
      </div>

      {/* Interactive Dual-Track Composer */}
      {onSubmitEntry && (
        <form onSubmit={handleSubmit} className={`${styles.composer} ${isInternal ? styles.composerInternal : styles.composerCustomer}`}>
          <div className={styles.composerTypeBar} role="group" aria-label="Compose visibility mode">
            <button
              type="button"
              className={`${styles.modeBtn} ${isInternal ? styles.modeBtnInternalActive : ""}`}
              onClick={() => setComposerType("internal_note")}
              aria-pressed={isInternal}
            >
              <span className={styles.modeIcon} aria-hidden="true">🔒</span>
              <span>Internal Work Note (Private)</span>
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${!isInternal ? styles.modeBtnCustomerActive : ""}`}
              onClick={() => setComposerType("customer_reply")}
              aria-pressed={!isInternal}
            >
              <span className={styles.modeIcon} aria-hidden="true">🌐</span>
              <span>Customer Visible Reply (Public)</span>
            </button>
          </div>

          <div className={styles.composerNotice}>
            {isInternal ? (
              <span>🔒 <strong>Internal Note:</strong> Only visible to internal staff and operators. Hidden from customer.</span>
            ) : (
              <span>🌐 <strong>Public Reply:</strong> This response will be dispatched to the customer portal and emailed.</span>
            )}
          </div>

          <div className={styles.composerBody}>
            <label htmlFor={`${streamId}-composer-text`} className={styles.srOnly}>
              {isInternal ? "Internal work note content" : "Customer reply content"}
            </label>
            <textarea
              id={`${streamId}-composer-text`}
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder={isInternal ? "Add internal note for tier-2/3 team or auditors..." : "Type response to send to customer contact..."}
              rows={3}
              className={styles.textarea}
            />
            <div className={styles.composerFooter}>
              <span className={styles.currentUserBadge}>
                Posting as <strong>{currentUser.name}</strong>
              </span>
              <button
                type="submit"
                disabled={!draftContent.trim()}
                className={`${styles.submitBtn} ${isInternal ? styles.submitBtnInternal : styles.submitBtnCustomer}`}
              >
                {isInternal ? "Post Work Note" : "Send Customer Reply"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Activity Timeline List */}
      <div className={styles.timelineList} role="feed" aria-label="Activity entries">
        {filteredEntries.length === 0 ? (
          <div className={styles.emptyFeed}>No entries matching selected filter.</div>
        ) : (
          filteredEntries.map((entry) => {
            const entryIsInternal = entry.type === "internal_note";
            const entryIsCustomer = entry.type === "customer_reply";
            const entryIsAudit = entry.type === "system_audit";

            return (
              <article
                key={entry.id}
                className={`${styles.timelineEntry} ${
                  entryIsInternal
                    ? styles.entryInternal
                    : entryIsCustomer
                    ? styles.entryCustomer
                    : styles.entryAudit
                }`}
              >
                {/* Avatar / Icon Badge */}
                <div className={styles.entryAvatar}>
                  {entry.authorAvatar ? (
                    <img src={entry.authorAvatar} alt="" className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {entryIsAudit ? "⚙" : entry.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Entry Content Card */}
                <div className={styles.entryCard}>
                  <div className={styles.entryMeta}>
                    <div className={styles.entryAuthor}>
                      <span className={styles.authorName}>{entry.authorName}</span>
                      {entry.authorRole && (
                        <span className={styles.authorRole}>• {entry.authorRole}</span>
                      )}
                    </div>

                    <div className={styles.entryTags}>
                      {entryIsInternal && (
                        <span className={styles.badgeInternal}>
                          <span aria-hidden="true">🔒</span> Internal Note
                        </span>
                      )}
                      {entryIsCustomer && (
                        <span className={styles.badgeCustomer}>
                          <span aria-hidden="true">🌐</span> Customer Reply
                        </span>
                      )}
                      {entryIsAudit && (
                        <span className={styles.badgeAudit}>Audit Event</span>
                      )}
                      <time className={styles.entryTimestamp}>{entry.createdAt}</time>
                    </div>
                  </div>

                  <div className={styles.entryBodyText}>{entry.content}</div>

                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className={styles.attachmentsRow} aria-label="Attached files">
                      {entry.attachments.map((att, idx) => (
                        <span key={idx} className={styles.attachmentChip}>
                          <span aria-hidden="true">📎</span>
                          <span>{att.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
