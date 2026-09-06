import React, { useId, useState, useRef, useEffect } from "react";
import styles from "./container-exec-terminal-console.module.css";

export type ContainerState = "running" | "terminating" | "waiting" | "crash_loop";

export interface TerminalSessionTab {
  id: string;
  containerName: string; // "api-worker-0"
  podName: string; // "unierp-api-7b89f-2m19a"
  state: ContainerState;
  restartCount: number;
}

export interface TerminalLogLine {
  id: string;
  timestamp: string; // "10:24:18.042"
  stream: "stdout" | "stderr" | "stdin";
  text: string;
}

export interface ContainerExecTerminalConsoleProps {
  clusterName?: string; // "aws-eks-prod-us-east-1"
  namespace?: string; // "production"
  sessions: TerminalSessionTab[];
  initialLogs?: Record<string, TerminalLogLine[]>;
  onExecuteCommand?: (sessionId: string, command: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const defaultMockLogs: Record<string, TerminalLogLine[]> = {
  "sess-1": [
    { id: "l-1", timestamp: "10:24:01.102", stream: "stdout", text: "Connected to container api-worker-0 via containerd /bin/sh" },
    { id: "l-2", timestamp: "10:24:01.140", stream: "stdout", text: "UniERP Enterprise Kernel v2.14.0 initializing..." },
    { id: "l-3", timestamp: "10:24:01.210", stream: "stdout", text: "PostgreSQL multi-tenant connection pool established (40 connections active)" },
    { id: "l-4", timestamp: "10:24:02.040", stream: "stdout", text: "Kafka consumer group partition assigned [topics: erp.orders, partitions: 0-7]" },
  ],
};

export const ContainerExecTerminalConsole: React.FC<ContainerExecTerminalConsoleProps> = ({
  clusterName = "aws-eks-prod-us-east-1",
  namespace = "production",
  sessions,
  initialLogs = defaultMockLogs,
  onExecuteCommand,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const inputId = useId();
  const [activeSessionId, setActiveSessionId] = useState<string>(
    sessions[0]?.id ?? ""
  );
  const [logs, setLogs] = useState<Record<string, TerminalLogLine[]>>(initialLogs);
  const [commandInput, setCommandInput] = useState<string>("");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const bufferEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0] ?? null;
  const currentLogs = (activeSession ? logs[activeSession.id] : []) ?? [];

  useEffect(() => {
    if (!isPaused && bufferEndRef.current && typeof bufferEndRef.current.scrollIntoView === "function") {
      bufferEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentLogs, isPaused]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || !activeSession) return;

    const newLog: TerminalLogLine = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 23),
      stream: "stdin",
      text: `$ ${commandInput}`,
    };

    setLogs((prev) => ({
      ...prev,
      [activeSession.id]: [...(prev[activeSession.id] ?? []), newLog],
    }));

    onExecuteCommand?.(activeSession.id, commandInput);
    setCommandInput("");
  };

  const handleClearBuffer = () => {
    if (!activeSession) return;
    setLogs((prev) => ({
      ...prev,
      [activeSession.id]: [],
    }));
  };

  const getStatusBadge = (state: ContainerState) => {
    switch (state) {
      case "running":
        return <span className={`${styles.statePill} ${styles.stateRunning}`}>Running</span>;
      case "crash_loop":
        return <span className={`${styles.statePill} ${styles.stateCrash}`}>CrashLoop</span>;
      case "terminating":
        return <span className={`${styles.statePill} ${styles.stateTerminating}`}>Terminating</span>;
      default:
        return <span className={`${styles.statePill} ${styles.stateWaiting}`}>{state}</span>;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.metaRow}>
          <div className={styles.clusterGroup}>
            <span className={styles.clusterBadge}>K8S CLUSTER</span>
            <span className={styles.clusterText}>{clusterName}</span>
            <span className={styles.nsText}>ns:{namespace}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Container Interactive Exec Terminal & TTY Console
          </h2>
        </div>

        <div className={styles.headerControls}>
          <button
            type="button"
            className={`${styles.controlBtn} ${isPaused ? styles.controlBtnActive : ""}`}
            onClick={() => setIsPaused(!isPaused)}
            aria-pressed={isPaused}
            aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
          >
            {isPaused ? "▶ Resume Stream" : "⏸ Pause Stream"}
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleClearBuffer}
            aria-label="Clear terminal buffer"
          >
            Clear Buffer
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabBar} role="tablist" aria-label="Active Container Sessions">
        {sessions.map((sess) => {
          const isActive = activeSession?.id === sess.id;
          return (
            <button
              key={sess.id}
              role="tab"
              id={`tab-${sess.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${sess.id}`}
              className={`${styles.tabBtn} ${isActive ? styles.tabActive : ""}`}
              onClick={() => setActiveSessionId(sess.id)}
            >
              <span className={styles.containerName}>{sess.containerName}</span>
              {getStatusBadge(sess.state)}
            </button>
          );
        })}
      </div>

      {/* Terminal Viewport */}
      <div
        id={activeSession ? `panel-${activeSession.id}` : undefined}
        role="tabpanel"
        aria-labelledby={activeSession ? `tab-${activeSession.id}` : undefined}
        className={styles.viewport}
        tabIndex={0}
      >
        <div className={styles.logStream} role="log" aria-live="polite">
          {currentLogs.map((log) => (
            <div
              key={log.id}
              className={`${styles.logRow} ${
                log.stream === "stdin"
                  ? styles.streamStdin
                  : log.stream === "stderr"
                  ? styles.streamStderr
                  : styles.streamStdout
              }`}
            >
              <span className={styles.logTimestamp}>{log.timestamp}</span>
              <span className={styles.logText}>{log.text}</span>
            </div>
          ))}
          <div ref={bufferEndRef} />
        </div>

        {/* Command input prompt */}
        <form onSubmit={handleCommandSubmit} className={styles.promptBar}>
          <label htmlFor={inputId} className={styles.promptLabel}>
            <span className={styles.promptArrow}>❯</span>
            <span className={styles.srOnly}>Execute Container Shell Command</span>
          </label>
          <input
            id={inputId}
            type="text"
            className={styles.promptInput}
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type bash or shell command (e.g., top, df -h, ps aux)..."
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className={styles.sendBtn} aria-label="Send command to container">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};
