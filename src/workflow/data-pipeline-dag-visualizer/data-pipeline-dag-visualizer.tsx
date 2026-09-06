import React, { useId, useState, useMemo } from "react";
import styles from "./data-pipeline-dag-visualizer.module.css";

export type DagTaskStatus =
  | "success"
  | "running"
  | "failed"
  | "upstream_failed"
  | "queued"
  | "skipped";

export interface DagTaskNode {
  id: string;
  name: string;
  operator: string; // "PostgresOperator", "SparkSubmit", "dbtRun", "PythonSensor"
  status: DagTaskStatus;
  durationSeconds?: number;
  retries?: number;
  maxRetries?: number;
  upstreamIds?: string[];
  downstreamIds?: string[];
  logsPreview?: string[];
}

export interface DataPipelineDagVisualizerProps {
  dagId: string; // "financial_reconciliation_nightly"
  pipelineName: string; // "Global Multi-Tenant Ledger Reconciliation & Settlement"
  scheduleInterval: string; // "0 2 * * *" (Daily at 02:00 UTC)
  executionDate: string; // "2026-09-06T02:00:00Z"
  tasks: DagTaskNode[];
  selectedTaskId?: string;
  onSelectTask?: (taskId: string) => void;
  onTriggerRun?: () => void;
  onRetryTask?: (taskId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DataPipelineDagVisualizer: React.FC<DataPipelineDagVisualizerProps> = ({
  dagId,
  pipelineName,
  scheduleInterval,
  executionDate,
  tasks,
  selectedTaskId: initialSelectedId,
  onSelectTask,
  onTriggerRun,
  onRetryTask,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId ?? (tasks.length > 0 ? (tasks[0]?.id ?? "") : "")
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedId) ?? tasks[0];
  }, [tasks, selectedId]);

  const stats = useMemo(() => {
    const success = tasks.filter((t) => t.status === "success").length;
    const running = tasks.filter((t) => t.status === "running").length;
    const failed = tasks.filter(
      (t) => t.status === "failed" || t.status === "upstream_failed"
    ).length;
    const queued = tasks.filter(
      (t) => t.status === "queued" || t.status === "skipped"
    ).length;
    return { success, running, failed, queued };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return tasks;
    return tasks.filter((t) => t.status === statusFilter);
  }, [tasks, statusFilter]);

  const formatDuration = (sec?: number) => {
    if (!sec) return "0s";
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const getStatusBadgeClass = (status: DagTaskStatus) => {
    switch (status) {
      case "success":
        return styles.statusSuccess;
      case "running":
        return styles.statusRunning;
      case "failed":
        return styles.statusFailed;
      case "upstream_failed":
        return styles.statusUpstreamFailed;
      case "skipped":
        return styles.statusSkipped;
      default:
        return styles.statusQueued;
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedId(taskId);
    onSelectTask?.(taskId);
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.metaRow}>
            <span className={styles.dagBadge}>{dagId}</span>
            <span className={styles.scheduleBadge}>Cron: {scheduleInterval}</span>
            <span className={styles.dateBadge}>Run: {executionDate}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {pipelineName}
          </h2>
        </div>

        {/* Global Pipeline Execution State */}
        <div className={styles.headerRight}>
          <div className={styles.statsSummary}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{stats.success}</span>
              <span className={styles.statLabel}>Success</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{stats.running}</span>
              <span className={styles.statLabel}>Running</span>
            </div>
            <div className={styles.statBox}>
              <span className={stats.failed > 0 ? styles.statNumAlert : styles.statNum}>
                {stats.failed}
              </span>
              <span className={styles.statLabel}>Failed</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{stats.queued}</span>
              <span className={styles.statLabel}>Queued</span>
            </div>
          </div>

          {onTriggerRun && (
            <button
              type="button"
              className={styles.triggerButton}
              onClick={onTriggerRun}
            >
              ▶ Trigger Pipeline Run
            </button>
          )}
        </div>
      </header>

      {/* Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterLeft}>
          <label htmlFor="dag-status-filter" className={styles.filterLabel}>
            Filter Tasks:
          </label>
          <select
            id="dag-status-filter"
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tasks ({tasks.length})</option>
            <option value="success">Success ({stats.success})</option>
            <option value="running">Running ({stats.running})</option>
            <option value="failed">Failed ({stats.failed})</option>
            <option value="queued">Queued ({stats.queued})</option>
          </select>
        </div>
        <span className={styles.totalHint}>
          Showing {filteredTasks.length} of {tasks.length} DAG nodes
        </span>
      </div>

      {/* Main Workspace Layout: Visual Nodes Grid & Inspector Drawer */}
      <div className={styles.mainLayout}>
        {/* DAG Nodes Grid */}
        <div className={styles.dagGridArea} role="list" aria-label="Pipeline DAG Nodes">
          {filteredTasks.length === 0 ? (
            <p className={styles.emptyNotice}>No tasks found matching filter &ldquo;{statusFilter}&rdquo;.</p>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  role="listitem"
                  className={`${styles.dagNodeCard} ${isSelected ? styles.dagNodeSelected : ""}`}
                >
                  <button
                    type="button"
                    className={styles.nodeSelectButton}
                    onClick={() => handleTaskClick(task.id)}
                    aria-pressed={isSelected}
                    aria-label={`Inspect task ${task.name} (${task.status})`}
                  >
                    <div className={styles.nodeHeaderRow}>
                      <span className={styles.operatorTag}>{task.operator}</span>
                      <span className={`${styles.statusPill} ${getStatusBadgeClass(task.status)}`}>
                        {task.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <h3 className={styles.taskTitle}>{task.name}</h3>

                    <div className={styles.nodeFooterRow}>
                      <span className={styles.duration}>
                        ⏱ {formatDuration(task.durationSeconds)}
                      </span>
                      {task.retries !== undefined && task.maxRetries !== undefined && (
                        <span className={styles.retries}>
                          Retry: {task.retries}/{task.maxRetries}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Task Details & Logs Inspector */}
        {selectedTask && (
          <aside className={styles.inspector} aria-label="Task Node Inspector">
            <div className={styles.inspectorHeader}>
              <div>
                <span className={styles.operatorTag}>{selectedTask.operator}</span>
                <h3 className={styles.inspectorTitle}>{selectedTask.name}</h3>
                <span className={styles.taskIdCode}>{selectedTask.id}</span>
              </div>
              <span className={`${styles.statusPill} ${getStatusBadgeClass(selectedTask.status)}`}>
                {selectedTask.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div className={styles.metaBox}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration</span>
                <span className={styles.metaVal}>{formatDuration(selectedTask.durationSeconds)}</span>
              </div>
              {selectedTask.upstreamIds && selectedTask.upstreamIds.length > 0 && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Upstream Dependencies</span>
                  <span className={styles.metaVal}>{selectedTask.upstreamIds.join(", ")}</span>
                </div>
              )}
              {selectedTask.downstreamIds && selectedTask.downstreamIds.length > 0 && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Downstream Dependents</span>
                  <span className={styles.metaVal}>{selectedTask.downstreamIds.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Task Logs Preview */}
            <div className={styles.logsSection}>
              <h4 className={styles.logsHeader}>Task Execution Logs</h4>
              <pre className={styles.logsConsole}>
                {selectedTask.logsPreview && selectedTask.logsPreview.length > 0 ? (
                  selectedTask.logsPreview.map((line, i) => <div key={i}>{line}</div>)
                ) : (
                  <div className={styles.noLogs}>No logs recorded for this task run.</div>
                )}
              </pre>
            </div>

            {(selectedTask.status === "failed" || selectedTask.status === "upstream_failed") && onRetryTask && (
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={() => onRetryTask(selectedTask.id)}
                >
                  ↻ Clear & Retry Task
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
};
