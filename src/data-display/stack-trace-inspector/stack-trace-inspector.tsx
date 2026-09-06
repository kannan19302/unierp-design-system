"use client";

import {
  useState,
  useMemo,
  type FC,
} from "react";
import {
  AlertOctagon,
  GitCommit,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  Code2,
} from "lucide-react";
import styles from "./stack-trace-inspector.module.css";

export type TraceDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface StackContextLine {
  line: number;
  code: string;
  isTarget?: boolean;
}

export interface StackFrame {
  id: string;
  fileName: string;
  functionName: string;
  lineNumber: number;
  columnNumber?: number;
  isInApp: boolean;
  contextLines?: StackContextLine[];
}

export interface SuspectCommitInfo {
  sha: string;
  author: string;
  message: string;
}

export interface StackTraceInspectorProps {
  /** Error/exception classification (e.g. InvariantViolationError) */
  exceptionName: string;
  /** Primary error message explanation */
  exceptionMessage: string;
  /** Parsed stack trace frames */
  frames: StackFrame[];
  /** Optional suspect commit identified by blame engine */
  suspectCommit?: SuspectCommitInfo;
  /** Whether to filter out vendor frames by default */
  defaultInAppOnly?: boolean;
  /** Density scale */
  density?: TraceDensity;
  className?: string;
}

/**
 * `<StackTraceInspector>` — Production exception & call-stack inspection inspector.
 * Benchmarked against Sentry Error Tracking (#96), Datadog APM (#53), and GitHub Primer (#9).
 */
export const StackTraceInspector: FC<StackTraceInspectorProps> = ({
  exceptionName,
  exceptionMessage,
  frames,
  suspectCommit,
  defaultInAppOnly = true,
  density = "compact",
  className = "",
}) => {
  const [inAppOnly, setInAppOnly] = useState(defaultInAppOnly);
  const [expandedFrameIds, setExpandedFrameIds] = useState<Set<string>>(() => {
    // Expand first in-app frame by default
    const firstInApp = frames.find((f) => f.isInApp) || frames[0];
    return firstInApp ? new Set([firstInApp.id]) : new Set();
  });
  const [copied, setCopied] = useState(false);

  const displayedFrames = useMemo(() => {
    if (!inAppOnly) return frames;
    return frames.filter((f) => f.isInApp);
  }, [frames, inAppOnly]);

  const toggleFrame = (id: string) => {
    setExpandedFrameIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyTrace = () => {
    const rawLines = [
      `${exceptionName}: ${exceptionMessage}`,
      ...frames.map(
        (f) => `  at ${f.functionName} (${f.fileName}:${f.lineNumber}${f.columnNumber ? `:${f.columnNumber}` : ""})`
      ),
    ].join("\n");

    navigator.clipboard?.writeText(rawLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Stack Trace Inspector"
    >
      {/* ── Exception Header Banner ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <AlertOctagon size={18} className={styles.errorIcon} aria-hidden="true" />
          <div className={styles.exceptionDetails}>
            <span className={styles.exceptionType}>{exceptionName}</span>
            <h3 className={styles.exceptionMsg}>{exceptionMessage}</h3>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopyTrace}
            title="Copy raw stack trace"
            aria-label="Copy raw stack trace"
          >
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            <span>{copied ? "Copied" : "Copy Trace"}</span>
          </button>
        </div>
      </div>

      {/* ── Suspect Commit Banner (Optional) ── */}
      {suspectCommit && (
        <div className={styles.suspectBanner}>
          <GitCommit size={14} className={styles.commitIcon} aria-hidden="true" />
          <span className={styles.suspectLabel}>Suspect Commit:</span>
          <code className={styles.commitSha}>{suspectCommit.sha.slice(0, 7)}</code>
          <span className={styles.commitAuthor}>by {suspectCommit.author}</span>
          <span className={styles.commitMsg}>— "{suspectCommit.message}"</span>
        </div>
      )}

      {/* ── Frame Filter Strip ── */}
      <div className={styles.filterStrip}>
        <div className={styles.filterLeft}>
          <Code2 size={13} className={styles.codeIcon} aria-hidden="true" />
          <span className={styles.frameCount}>
            {displayedFrames.length} of {frames.length} frames displayed
          </span>
        </div>

        <div className={styles.filterRight}>
          <button
            type="button"
            className={`${styles.filterBtn} ${inAppOnly ? styles.filterBtnActive : ""}`}
            onClick={() => setInAppOnly((prev) => !prev)}
            aria-pressed={inAppOnly}
          >
            <Filter size={12} aria-hidden="true" />
            <span>In-App Only</span>
          </button>
        </div>
      </div>

      {/* ── Frames List ── */}
      <div className={styles.framesList}>
        {displayedFrames.map((frame, index) => {
          const isExpanded = expandedFrameIds.has(frame.id);

          return (
            <div
              key={frame.id}
              className={`${styles.frameItem} ${!frame.isInApp ? styles.vendorFrame : ""}`}
            >
              <div
                className={styles.frameHeader}
                onClick={() => toggleFrame(frame.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFrame(frame.id);
                  }
                }}
              >
                <span className={styles.expandIcon}>
                  {isExpanded ? <ChevronDown size={13} aria-hidden="true" /> : <ChevronRight size={13} aria-hidden="true" />}
                </span>

                <span className={styles.frameIndex}>#{index + 1}</span>

                <span className={styles.functionName}>{frame.functionName}</span>

                <span className={styles.locationWrap}>
                  <span className={styles.fileName}>{frame.fileName}</span>
                  <span className={styles.lineIndicator}>:{frame.lineNumber}</span>
                </span>

                <span
                  className={`${styles.scopeTag} ${
                    frame.isInApp ? styles.tagInApp : styles.tagVendor
                  }`}
                >
                  {frame.isInApp ? "app" : "vendor"}
                </span>
              </div>

              {/* Context Code Block */}
              {isExpanded && frame.contextLines && frame.contextLines.length > 0 && (
                <div className={styles.codeBlockWrap}>
                  <pre className={styles.codeBlock}>
                    {frame.contextLines.map((line) => (
                      <div
                        key={`code-${line.line}`}
                        className={`${styles.codeLine} ${
                          line.isTarget ? styles.targetLine : ""
                        }`}
                      >
                        <span className={styles.codeLineNum}>{line.line}</span>
                        <span className={styles.codeContent}>{line.code}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
