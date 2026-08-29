"use client";

import { type FC, useState, useEffect, useCallback } from "react";
import styles from "./change-history.module.css";

interface FieldChange {
  field: string;
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ChangeEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  fieldChanges?: FieldChange[];
  createdAt: string;
}

export interface ChangeHistoryProps {
  entityType: string;
  entityId: string;
  apiBase?: string;
  initialEntries?: ChangeEntry[];
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actionLabel(action: string): string {
  switch (action) {
    case "CREATE":
      return "created this record";
    case "UPDATE":
      return "updated this record";
    case "DELETE":
      return "deleted this record";
    case "STATUS_CHANGE":
      return "changed status";
    default:
      return action.toLowerCase();
  }
}

export const ChangeHistory: FC<ChangeHistoryProps> = ({
  entityType,
  entityId,
  apiBase = "/api/v1",
  initialEntries,
}) => {
  const [entries, setEntries] = useState<ChangeEntry[]>(initialEntries || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiBase}/change-history/${entityType}/${entityId}?page=${pageNum}&limit=20`,
          { credentials: "include" },
        );
        if (!res.ok) return;
        const result = await res.json();
        const newEntries = result.data || [];
        setEntries((prev) =>
          pageNum === 1 ? newEntries : [...prev, ...newEntries],
        );
        setHasMore(pageNum < (result.meta?.totalPages || 1));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [apiBase, entityType, entityId],
  );

  useEffect(() => {
    if (entityId && !initialEntries) fetchHistory(1);
  }, [entityId, fetchHistory, initialEntries]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchHistory(next);
  };

  if (entries.length === 0 && !loading) return null;

  return (
    <section aria-label="Change History" className={styles.container}>
      <h4 className={styles.title}>Activity</h4>

      <div className={styles.timeline}>
        <div className={styles.timelineLine} />

        {entries.map((entry) => {
          const dotClass =
            entry.action === "CREATE"
              ? styles.dotCreate
              : entry.action === "DELETE"
                ? styles.dotDelete
                : styles.dotDefault;

          return (
            <div key={entry.id} className={styles.entry}>
              <div className={`${styles.dot} ${dotClass}`} />

              <div className={styles.entryText}>
                <span className={styles.userName}>{entry.userName}</span>{" "}
                {actionLabel(entry.action)}
                <span className={styles.timestamp}>
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              {entry.fieldChanges &&
                entry.fieldChanges.length > 0 &&
                entry.action !== "CREATE" && (
                  <div className={styles.fieldChanges}>
                    {entry.fieldChanges.map((fc, i) => (
                      <div key={i} style={{ marginBottom: "2px" }}>
                        <span style={{ fontWeight: 500 }}>{fc.label}:</span>{" "}
                        <span className={styles.oldVal}>
                          {formatValue(fc.oldValue)}
                        </span>
                        {" → "}
                        <span style={{ fontWeight: 500 }}>
                          {formatValue(fc.newValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-3)", color: "var(--color-text-muted)" }}>
          Loading...
        </div>
      )}

      {hasMore && !loading && !initialEntries && (
        <button type="button" onClick={loadMore} className={styles.loadMoreBtn}>
          Load more
        </button>
      )}
    </section>
  );
};
