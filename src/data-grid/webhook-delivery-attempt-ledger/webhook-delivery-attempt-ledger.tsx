import React, { useId, useState, useMemo } from "react";
import styles from "./webhook-delivery-attempt-ledger.module.css";

export type WebhookDeliveryStatus = "DELIVERED" | "RETRYING" | "FAILED" | "TIMED_OUT";

export interface WebhookDeliveryAttempt {
  id: string; // "att_90184a"
  eventId: string; // "evt_inv_8829"
  eventType: string; // "invoice.payment_succeeded"
  endpointUrl: string; // "https://api.client.com/webhooks/unierp"
  httpStatus: number; // 200, 502, 504, 408
  latencyMs: number; // 142
  attemptNumber: number; // 1
  maxAttempts: number; // 5
  status: WebhookDeliveryStatus;
  timestamp: string; // "2026-09-06T08:14:22Z"
  requestPayload: string; // JSON string
  responseBody: string; // Response text or JSON
}

export interface WebhookDeliveryAttemptLedgerProps {
  attempts: WebhookDeliveryAttempt[];
  onReplayAttempt?: (attemptId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const WebhookDeliveryAttemptLedger: React.FC<WebhookDeliveryAttemptLedgerProps> = ({
  attempts,
  onReplayAttempt,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const filterSelectId = useId();
  const searchInputId = useId();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inspectedAttemptId, setInspectedAttemptId] = useState<string | null>(null);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      const matchesStatus = statusFilter === "ALL" || att.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        att.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.endpointUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [attempts, statusFilter, searchQuery]);

  const activeAttempt = attempts.find((a) => a.id === inspectedAttemptId) ?? null;

  const getStatusBadgeClass = (status: WebhookDeliveryStatus) => {
    switch (status) {
      case "DELIVERED":
        return styles.badgeDelivered;
      case "RETRYING":
        return styles.badgeRetrying;
      case "FAILED":
        return styles.badgeFailed;
      case "TIMED_OUT":
        return styles.badgeTimedOut;
      default:
        return "";
    }
  };

  const getHttpCodeClass = (code: number) => {
    if (code >= 200 && code < 300) return styles.http2xx;
    if (code >= 400 && code < 500) return styles.http4xx;
    return styles.http5xx;
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.categoryBadge}>DEVELOPER PLATFORM & INTEGRATIONS</span>
          <span className={styles.countBadge}>{filteredAttempts.length} ATTEMPTS</span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Outbound Webhook Delivery & Retry Attempt Ledger
          </h2>
          <div className={styles.filterToolbar}>
            <div className={styles.searchGroup}>
              <label htmlFor={searchInputId} className={styles.srOnly}>
                Search Event or Endpoint
              </label>
              <input
                id={searchInputId}
                type="search"
                placeholder="Search event type or endpoint URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.selectGroup}>
              <label htmlFor={filterSelectId} className={styles.srOnly}>
                Filter by Status
              </label>
              <select
                id={filterSelectId}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.statusSelect}
              >
                <option value="ALL">All Delivery Statuses</option>
                <option value="DELIVERED">Delivered (2xx)</option>
                <option value="RETRYING">Retrying Backoff</option>
                <option value="FAILED">Failed (5xx / 4xx)</option>
                <option value="TIMED_OUT">Timed Out (&gt;15s)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Ledger Data Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Webhook delivery attempt records">
          <thead>
            <tr>
              <th scope="col">Delivery ID</th>
              <th scope="col">Event Type</th>
              <th scope="col">Destination Endpoint</th>
              <th scope="col">HTTP Status</th>
              <th scope="col">Latency</th>
              <th scope="col">Attempt</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttempts.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyCell}>
                  No webhook delivery attempts match your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredAttempts.map((item) => (
                <tr
                  key={item.id}
                  className={item.id === inspectedAttemptId ? styles.selectedRow : ""}
                >
                  <td className={styles.monoCell}>{item.id}</td>
                  <td>
                    <span className={styles.eventPill}>{item.eventType}</span>
                  </td>
                  <td className={styles.endpointCell} title={item.endpointUrl}>
                    {item.endpointUrl}
                  </td>
                  <td>
                    <span className={`${styles.httpBadge} ${getHttpCodeClass(item.httpStatus)}`}>
                      {item.httpStatus}
                    </span>
                  </td>
                  <td className={styles.monoCell}>{item.latencyMs}ms</td>
                  <td className={styles.monoCell}>
                    {item.attemptNumber}/{item.maxAttempts}
                  </td>
                  <td>
                    <span className={`${styles.statusPill} ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.inspectBtn}
                        onClick={() =>
                          setInspectedAttemptId(
                            item.id === inspectedAttemptId ? null : item.id
                          )
                        }
                        aria-label={`Inspect payload for attempt ${item.id}`}
                      >
                        {item.id === inspectedAttemptId ? "Close" : "Inspect"}
                      </button>
                      <button
                        type="button"
                        className={styles.replayBtn}
                        onClick={() => onReplayAttempt?.(item.id)}
                        aria-label={`Replay webhook event for attempt ${item.id}`}
                      >
                        Replay
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expandable Payload & Response Inspector */}
      {activeAttempt && (
        <div className={styles.inspectorDrawer} role="region" aria-label="Webhook payload detail inspector">
          <div className={styles.inspectorHeader}>
            <span className={styles.inspectorTitle}>
              Payload &amp; Response Inspector: <code>{activeAttempt.id}</code> ({activeAttempt.eventType})
            </span>
            <button
              type="button"
              className={styles.closeDrawerBtn}
              onClick={() => setInspectedAttemptId(null)}
              aria-label="Close inspector drawer"
            >
              ✕
            </button>
          </div>
          <div className={styles.inspectorBody}>
            <div className={styles.pane}>
              <h4 className={styles.paneTitle}>HTTP Request Payload</h4>
              <pre className={styles.codeBlock}>
                <code>{activeAttempt.requestPayload}</code>
              </pre>
            </div>
            <div className={styles.pane}>
              <h4 className={styles.paneTitle}>Destination Server Response</h4>
              <pre className={styles.codeBlock}>
                <code>{activeAttempt.responseBody}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
