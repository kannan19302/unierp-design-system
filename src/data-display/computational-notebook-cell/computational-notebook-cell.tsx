import React, { useId, useState } from "react";
import styles from "./computational-notebook-cell.module.css";

export type NotebookCellStatus = "IDLE" | "RUNNING" | "SUCCESS" | "ERROR";

export interface CellExecutionMetrics {
  executionTimeMs: number;
  memoryUsedMb: number;
  rowsAffected?: number;
}

export interface ComputationalNotebookCellProps {
  cellId: string; // "cell_04"
  language?: "sql" | "python";
  initialCode: string;
  metrics?: CellExecutionMetrics;
  outputData?: {
    columns: string[];
    rows: (string | number | boolean | null)[][];
  };
  errorMessage?: string;
  onExecute?: (code: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ComputationalNotebookCell: React.FC<ComputationalNotebookCellProps> = ({
  cellId,
  language = "sql",
  initialCode,
  metrics,
  outputData,
  errorMessage,
  onExecute,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const codeEditorId = useId();
  const [code, setCode] = useState<string>(initialCode);
  const [status, setStatus] = useState<NotebookCellStatus>(
    errorMessage ? "ERROR" : outputData ? "SUCCESS" : "IDLE"
  );
  const [isOutputVisible, setIsOutputVisible] = useState<boolean>(true);

  const handleRun = () => {
    setStatus("RUNNING");
    onExecute?.(code);
    setTimeout(() => {
      setStatus(errorMessage ? "ERROR" : "SUCCESS");
    }, 300);
  };

  const getStatusClass = (st: NotebookCellStatus) => {
    switch (st) {
      case "RUNNING":
        return styles.statusRunning;
      case "SUCCESS":
        return styles.statusSuccess;
      case "ERROR":
        return styles.statusError;
      default:
        return styles.statusIdle;
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
          <span className={styles.cellBadge}>
            [{cellId}] {language.toUpperCase()}
          </span>
          <span className={`${styles.statusPill} ${getStatusClass(status)}`}>
            {status === "RUNNING"
              ? "● EXECUTING..."
              : status === "SUCCESS"
              ? "✓ SUCCESS"
              : status === "ERROR"
              ? "✕ EXECUTION FAILED"
              : "○ READY"}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Notebook Computational Cell
          </h2>
          {metrics && (
            <div className={styles.metricsStrip}>
              <span className={styles.metricItem}>
                Time: <strong>{metrics.executionTimeMs}ms</strong>
              </span>
              <span className={styles.metricItem}>
                Memory: <strong>{metrics.memoryUsedMb}MB</strong>
              </span>
              {typeof metrics.rowsAffected === "number" && (
                <span className={styles.metricItem}>
                  Rows: <strong>{metrics.rowsAffected.toLocaleString()}</strong>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Code Editor Block */}
      <div className={styles.editorWrapper}>
        <label htmlFor={codeEditorId} className={styles.srOnly}>
          Code input for notebook cell {cellId}
        </label>
        <div className={styles.editorLayout}>
          <div className={styles.lineNumbers} aria-hidden="true">
            {code.split("\n").map((_, i) => (
              <span key={i} className={styles.lineNumber}>
                {i + 1}
              </span>
            ))}
          </div>
          <textarea
            id={codeEditorId}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.codeTextarea}
            rows={Math.max(4, code.split("\n").length)}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Cell Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.leftTools}>
          <button
            type="button"
            className={styles.runBtn}
            onClick={handleRun}
            disabled={status === "RUNNING"}
            aria-label={`Run cell ${cellId}`}
          >
            ▶ Run Cell (Ctrl+Enter)
          </button>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setCode("")}
            disabled={status === "RUNNING"}
            aria-label="Clear cell code"
          >
            Clear Code
          </button>
        </div>
        <div className={styles.rightTools}>
          <button
            type="button"
            className={styles.toggleOutputBtn}
            onClick={() => setIsOutputVisible(!isOutputVisible)}
            aria-label={isOutputVisible ? "Hide output pane" : "Show output pane"}
          >
            {isOutputVisible ? "Hide Output ▼" : "Show Output ▲"}
          </button>
        </div>
      </div>

      {/* Output / Results Pane */}
      {isOutputVisible && (
        <div className={styles.outputPane} role="region" aria-label="Cell output results">
          {status === "ERROR" && errorMessage && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorTitle}>Traceback Error:</span>
              <pre className={styles.errorPre}>
                <code>{errorMessage}</code>
              </pre>
            </div>
          )}

          {outputData && outputData.rows.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.outputTable} aria-label="Query result dataset">
                <thead>
                  <tr>
                    {outputData.columns.map((col, idx) => (
                      <th key={idx} scope="col">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {outputData.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className={styles.cellVal}>
                          {val === null ? <span className={styles.nullPill}>NULL</span> : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {status === "IDLE" && !outputData && !errorMessage && (
            <div className={styles.emptyNotice}>
              Cell output will render here after execution.
            </div>
          )}
        </div>
      )}
    </section>
  );
};
