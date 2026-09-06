import React, { useId, useState, useMemo } from "react";
import styles from "./kubernetes-pod-console.module.css";

export type PodLifecycleStatus =
  | "Running"
  | "CrashLoopBackOff"
  | "Pending"
  | "Terminating"
  | "OOMKilled";

export interface PodLogEntry {
  id: string;
  timestamp: string; // ISO or "09:42:15.102"
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

export interface KubernetesPodConsoleProps {
  podName: string;
  namespace?: string;
  containers: string[];
  activeContainer?: string;
  onSelectContainer?: (container: string) => void;
  status: PodLifecycleStatus;
  restartCount?: number;
  nodeName?: string;
  logs: PodLogEntry[];
  onRestartPod?: (podName: string) => void;
  onDownloadLogs?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const KubernetesPodConsole: React.FC<KubernetesPodConsoleProps> = ({
  podName,
  namespace = "default",
  containers,
  activeContainer,
  onSelectContainer,
  status,
  restartCount = 0,
  nodeName = "ip-10-0-14-88.ec2.internal",
  logs,
  onRestartPod,
  onDownloadLogs,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedContainer, setSelectedContainer] = useState<string>(
    activeContainer || (containers.length > 0 && containers[0] ? containers[0] : "app")
  );

  const [filterText, setFilterText] = useState<string>("");
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  const currentContainer = activeContainer !== undefined ? activeContainer : selectedContainer;

  const handleContainerChange = (name: string) => {
    setSelectedContainer(name);
    onSelectContainer?.(name);
  };

  const filteredLogs = useMemo(() => {
    if (!filterText.trim()) return logs;
    return logs.filter((log) =>
      log.message.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [logs, filterText]);

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            ☸️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.nsBadge}>ns: {namespace}</span>
              <span className={styles.nodeBadge}>node: {nodeName}</span>
              <span
                className={`${styles.statusBadge} ${
                  status === "Running"
                    ? styles.statusRunning
                    : status === "CrashLoopBackOff" || status === "OOMKilled"
                    ? styles.statusError
                    : styles.statusWarn
                }`}
              >
                {status}
              </span>
              {restartCount > 0 && (
                <span className={styles.restartBadge}>
                  Restarts: {restartCount}
                </span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>
              Pod: {podName}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.actionGroup}>
          {onDownloadLogs && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onDownloadLogs}
            >
              💾 Export Logs
            </button>
          )}
          {onRestartPod && (
            <button
              type="button"
              className={styles.restartBtn}
              onClick={() => onRestartPod(podName)}
            >
              ↻ Restart Pod
            </button>
          )}
        </div>
      </header>

      {/* Container Selector Tabs & Controls Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.containerTabs} role="tablist" aria-label="Container selector">
          {containers.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={currentContainer === c}
              className={`${styles.containerTab} ${
                currentContainer === c ? styles.activeTab : ""
              }`}
              onClick={() => handleContainerChange(c)}
            >
              📦 {c}
            </button>
          ))}
        </div>

        <div className={styles.streamControls}>
          <div className={styles.searchBox}>
            <label htmlFor={`filter-${headingId}`} className={styles.srOnly}>
              Filter pod logs
            </label>
            <input
              id={`filter-${headingId}`}
              type="text"
              placeholder="Grep logs (filter regex)..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <label className={styles.autoScrollLabel}>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            <span>Auto-scroll</span>
          </label>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className={styles.consoleTerminal} role="region" aria-label="Pod streaming output">
        {filteredLogs.length === 0 ? (
          <div className={styles.emptyLogs}>
            No logs found matching container or filter query.
          </div>
        ) : (
          <div className={styles.logList}>
            {filteredLogs.map((log) => (
              <div key={log.id} className={styles.logLine}>
                <span className={styles.timestamp}>{log.timestamp}</span>
                <span
                  className={`${styles.logLevel} ${
                    styles[`level_${log.level}`] || styles.level_info
                  }`}
                >
                  [{log.level.toUpperCase()}]
                </span>
                <span className={styles.logMessage}>{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Showing {filteredLogs.length} stream lines for container <code>{currentContainer}</code>
        </span>
        <span className={styles.footerLive}>● Live Streaming (WebSocket Attached)</span>
      </footer>
    </section>
  );
};
