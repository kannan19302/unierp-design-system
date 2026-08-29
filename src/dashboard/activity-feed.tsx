"use client";

import { useState, type FC, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Activity } from "lucide-react";
import { Badge } from "../components/badge";
import styles from "./activity-feed.module.css";

export type AuditActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "POST"
  | "EXPORT";

export interface FieldDiff {
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
}

export interface ActivityItem {
  id: string;
  actor: {
    id: string;
    name: string;
    avatarUrl?: string;
    initials?: string;
    role?: string;
  };
  action: AuditActionType;
  entityType: string;
  entityId: string;
  summary: ReactNode;
  timestamp: string;
  diffs?: FieldDiff[];
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  headerActions?: ReactNode;
  maxItems?: number;
  emptyMessage?: string;
}

const actionVariantMap: Record<AuditActionType, "default" | "success" | "danger" | "warning" | "info" | "primary"> = {
  CREATE: "success",
  UPDATE: "default",
  DELETE: "danger",
  APPROVE: "success",
  REJECT: "danger",
  POST: "primary",
  EXPORT: "info",
};

/**
 * `<ActivityFeed>` — Enterprise Temporal Audit & Activity Log.
 *
 * Capabilities:
 * - High-density audit trail with actor identity chips
 * - Action taxonomies (`CREATE`, `UPDATE`, `DELETE`, `APPROVE`, `POST`, `EXPORT`)
 * - Tabular timestamp numerals
 * - Expandable before/after field diff comparisons
 */
export const ActivityFeed: FC<ActivityFeedProps> = ({
  items,
  title = "Audit & Activity Log",
  headerActions,
  maxItems,
  emptyMessage = "No recent activity records.",
}) => {
  const [expandedDiffs, setExpandedDiffs] = useState<Set<string>>(new Set());

  const toggleDiff = (id: string) => {
    setExpandedDiffs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Activity size={16} style={{ color: "var(--platform-accent, var(--color-primary))" }} />
          <h4 className={styles.title}>{title}</h4>
        </div>
        {headerActions}
      </div>

      {displayItems.length === 0 ? (
        <p style={{ fontSize: "var(--type-label, var(--text-xs))", color: "var(--color-text-muted)", margin: "var(--space-4) 0" }}>
          {emptyMessage}
        </p>
      ) : (
        <div className={styles.list}>
          {displayItems.map((item) => {
            const hasDiffs = item.diffs && item.diffs.length > 0;
            const isDiffOpen = expandedDiffs.has(item.id);
            const initials = item.actor.initials || item.actor.name.slice(0, 2).toUpperCase();

            return (
              <div key={item.id} className={styles.item}>
                <div className={styles.avatar_wrap}>{initials}</div>

                <div className={styles.content}>
                  <div className={styles.meta_row}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span className={styles.actor_name}>{item.actor.name}</span>
                      <Badge variant={actionVariantMap[item.action] || "secondary"} size="sm">
                        {item.action}
                      </Badge>
                    </div>
                    <span className={styles.timestamp}>{item.timestamp}</span>
                  </div>

                  <p className={styles.summary}>{item.summary}</p>

                  {hasDiffs && (
                    <>
                      <button
                        type="button"
                        className={styles.diff_toggle}
                        onClick={() => toggleDiff(item.id)}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
                          {isDiffOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <span>{isDiffOpen ? "Hide changes" : `View ${item.diffs!.length} field change(s)`}</span>
                        </span>
                      </button>

                      {isDiffOpen && (
                        <div className={styles.diff_panel}>
                          {item.diffs!.map((diff, dIdx) => (
                            <div key={`diff-${dIdx}`} className={styles.diff_row}>
                              <span className={styles.diff_key}>{diff.field}:</span>
                              <span className={styles.diff_old}>{String(diff.oldValue ?? "none")}</span>
                              <span>→</span>
                              <span className={styles.diff_new}>{String(diff.newValue ?? "none")}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
