"use client";

import {
  useState,
  useMemo,
  Fragment,
  type FC,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  FileCode,
  Columns,
  List,
} from "lucide-react";
import styles from "./redline-diff-viewer.module.css";

export type DiffViewMode = "split" | "unified";
export type RedlineDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export type DiffType = "unchanged" | "added" | "removed" | "modified";

export interface DiffLine {
  id: string;
  type: DiffType;
  origLineNumber?: number;
  revLineNumber?: number;
  origContent?: string;
  revContent?: string;
}

export interface RedlineDiffViewerProps {
  /** Original base document or contract clause text */
  originalText: string;
  /** Revised text containing proposed redlines */
  revisedText: string;
  /** Default view mode: split side-by-side or unified stacked */
  defaultViewMode?: DiffViewMode;
  /** Document or contract clause title */
  documentTitle?: string;
  /** Callback when a modification chunk is accepted */
  onAcceptChange?: (changeId: string) => void;
  /** Callback when a modification chunk is rejected */
  onRejectChange?: (changeId: string) => void;
  /** Density scale */
  density?: RedlineDensity;
  className?: string;
}

/**
 * `<RedlineDiffViewer>` — High-precision contract redline and text revision inspector.
 * Benchmarked against Ironclad CLM (#114), GitHub Primer (#9), and GitLab Pajamas (#10).
 */
export const RedlineDiffViewer: FC<RedlineDiffViewerProps> = ({
  originalText,
  revisedText,
  defaultViewMode = "split",
  documentTitle = "Document Revision Comparison",
  onAcceptChange,
  onRejectChange,
  density = "compact",
  className = "",
}) => {
  const [viewMode, setViewMode] = useState<DiffViewMode>(defaultViewMode);
  const [activeDiffIndex, setActiveDiffIndex] = useState(0);

  // Compute line-by-line diffs
  const diffLines = useMemo<DiffLine[]>(() => {
    const origLines = originalText.split("\n");
    const revLines = revisedText.split("\n");
    const maxLen = Math.max(origLines.length, revLines.length);
    const result: DiffLine[] = [];

    let origIdx = 0;
    let revIdx = 0;

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[origIdx];
      const rev = revLines[revIdx];

      if (orig !== undefined && rev !== undefined) {
        if (orig === rev) {
          result.push({
            id: `diff-${i}`,
            type: "unchanged",
            origLineNumber: origIdx + 1,
            revLineNumber: revIdx + 1,
            origContent: orig,
            revContent: rev,
          });
          origIdx++;
          revIdx++;
        } else {
          result.push({
            id: `diff-${i}`,
            type: "modified",
            origLineNumber: origIdx + 1,
            revLineNumber: revIdx + 1,
            origContent: orig,
            revContent: rev,
          });
          origIdx++;
          revIdx++;
        }
      } else if (orig !== undefined) {
        result.push({
          id: `diff-${i}`,
          type: "removed",
          origLineNumber: origIdx + 1,
          origContent: orig,
        });
        origIdx++;
      } else if (rev !== undefined) {
        result.push({
          id: `diff-${i}`,
          type: "added",
          revLineNumber: revIdx + 1,
          revContent: rev,
        });
        revIdx++;
      }
    }

    return result;
  }, [originalText, revisedText]);

  const changedLines = useMemo(() => {
    return diffLines.filter((d) => d.type !== "unchanged");
  }, [diffLines]);

  const handleNextDiff = () => {
    if (changedLines.length === 0) return;
    setActiveDiffIndex((prev) => (prev + 1) % changedLines.length);
  };

  const handlePrevDiff = () => {
    if (changedLines.length === 0) return;
    setActiveDiffIndex((prev) => (prev - 1 + changedLines.length) % changedLines.length);
  };

  const activeChange = changedLines[activeDiffIndex];

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Redline Diff Viewer"
    >
      {/* ── Header Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.titleGroup}>
          <FileCode size={15} className={styles.titleIcon} aria-hidden="true" />
          <h3 className={styles.title}>{documentTitle}</h3>
          <span className={styles.changeBadge}>
            {changedLines.length} {changedLines.length === 1 ? "change" : "changes"}
          </span>
        </div>

        <div className={styles.navGroup}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handlePrevDiff}
            disabled={changedLines.length === 0}
            title="Previous modification"
            aria-label="Previous difference"
          >
            <ChevronLeft size={14} aria-hidden="true" />
          </button>
          <span className={styles.counterText}>
            {changedLines.length > 0
              ? `Change ${activeDiffIndex + 1} of ${changedLines.length}`
              : "No differences"}
          </span>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleNextDiff}
            disabled={changedLines.length === 0}
            title="Next modification"
            aria-label="Next difference"
          >
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.actionsGroup}>
          <div className={styles.modeToggleGroup}>
            <button
              type="button"
              className={`${styles.modeBtn} ${viewMode === "split" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("split")}
              aria-pressed={viewMode === "split"}
              title="Side-by-side split view"
            >
              <Columns size={13} aria-hidden="true" />
              <span>Split</span>
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${viewMode === "unified" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("unified")}
              aria-pressed={viewMode === "unified"}
              title="Unified stacked view"
            >
              <List size={13} aria-hidden="true" />
              <span>Unified</span>
            </button>
          </div>

          {activeChange && (
            <div className={styles.decisionActions}>
              <button
                type="button"
                className={styles.acceptBtn}
                onClick={() => onAcceptChange?.(activeChange.id)}
                title="Accept change"
              >
                <Check size={13} aria-hidden="true" />
                <span>Accept</span>
              </button>
              <button
                type="button"
                className={styles.rejectBtn}
                onClick={() => onRejectChange?.(activeChange.id)}
                title="Reject change"
              >
                <X size={13} aria-hidden="true" />
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Diff Canvas ── */}
      {viewMode === "split" ? (
        <div className={styles.splitGrid}>
          {/* Left: Original */}
          <div className={styles.pane}>
            <div className={styles.paneHeader}>Original Document</div>
            <div className={styles.diffTableWrap}>
              <table className={styles.diffTable}>
                <tbody>
                  {diffLines.map((line, idx) => {
                    const isFocus = activeChange && activeChange.id === line.id;
                    const isRemoved = line.type === "removed" || line.type === "modified";

                    return (
                      <tr
                        key={`orig-${line.id}-${idx}`}
                        className={`${styles.lineRow} ${isRemoved ? styles.rowRemoved : ""} ${
                          isFocus ? styles.rowActive : ""
                        }`}
                      >
                        <td className={styles.lineNum}>{line.origLineNumber ?? ""}</td>
                        <td className={styles.diffSign}>
                          {isRemoved ? "-" : " "}
                        </td>
                        <td className={styles.lineContent}>
                          <span className={isRemoved ? styles.delText : undefined}>
                            {line.origContent ?? " "}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Revised */}
          <div className={styles.pane}>
            <div className={styles.paneHeader}>Revised with Redlines</div>
            <div className={styles.diffTableWrap}>
              <table className={styles.diffTable}>
                <tbody>
                  {diffLines.map((line, idx) => {
                    const isFocus = activeChange && activeChange.id === line.id;
                    const isAdded = line.type === "added" || line.type === "modified";

                    return (
                      <tr
                        key={`rev-${line.id}-${idx}`}
                        className={`${styles.lineRow} ${isAdded ? styles.rowAdded : ""} ${
                          isFocus ? styles.rowActive : ""
                        }`}
                      >
                        <td className={styles.lineNum}>{line.revLineNumber ?? ""}</td>
                        <td className={styles.diffSign}>
                          {isAdded ? "+" : " "}
                        </td>
                        <td className={styles.lineContent}>
                          <span className={isAdded ? styles.insText : undefined}>
                            {line.revContent ?? " "}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className={styles.unifiedTableWrap}>
          <table className={styles.diffTable}>
            <tbody>
              {diffLines.map((line, idx) => {
                const isFocus = activeChange && activeChange.id === line.id;

                if (line.type === "unchanged") {
                  return (
                    <tr
                      key={`uni-${line.id}-${idx}`}
                      className={`${styles.lineRow} ${isFocus ? styles.rowActive : ""}`}
                    >
                      <td className={styles.lineNum}>{line.origLineNumber}</td>
                      <td className={styles.lineNum}>{line.revLineNumber}</td>
                      <td className={styles.diffSign}> </td>
                      <td className={styles.lineContent}>{line.origContent}</td>
                    </tr>
                  );
                }

                if (line.type === "modified") {
                  return (
                    <Fragment key={`uni-mod-${line.id}-${idx}`}>
                      <tr
                        key={`uni-mod-del-${line.id}-${idx}`}
                        className={`${styles.lineRow} ${styles.rowRemoved} ${
                          isFocus ? styles.rowActive : ""
                        }`}
                      >
                        <td className={styles.lineNum}>{line.origLineNumber}</td>
                        <td className={styles.lineNum}> </td>
                        <td className={styles.diffSign}>-</td>
                        <td className={styles.lineContent}>
                          <span className={styles.delText}>{line.origContent}</span>
                        </td>
                      </tr>
                      <tr
                        key={`uni-mod-ins-${line.id}-${idx}`}
                        className={`${styles.lineRow} ${styles.rowAdded} ${
                          isFocus ? styles.rowActive : ""
                        }`}
                      >
                        <td className={styles.lineNum}> </td>
                        <td className={styles.lineNum}>{line.revLineNumber}</td>
                        <td className={styles.diffSign}>+</td>
                        <td className={styles.lineContent}>
                          <span className={styles.insText}>{line.revContent}</span>
                        </td>
                      </tr>
                    </Fragment>
                  );
                }

                if (line.type === "removed") {
                  return (
                    <tr
                      key={`uni-del-${line.id}-${idx}`}
                      className={`${styles.lineRow} ${styles.rowRemoved} ${
                        isFocus ? styles.rowActive : ""
                      }`}
                    >
                      <td className={styles.lineNum}>{line.origLineNumber}</td>
                      <td className={styles.lineNum}> </td>
                      <td className={styles.diffSign}>-</td>
                      <td className={styles.lineContent}>
                        <span className={styles.delText}>{line.origContent}</span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={`uni-ins-${line.id}-${idx}`}
                    className={`${styles.lineRow} ${styles.rowAdded} ${
                      isFocus ? styles.rowActive : ""
                    }`}
                  >
                    <td className={styles.lineNum}> </td>
                    <td className={styles.lineNum}>{line.revLineNumber}</td>
                    <td className={styles.diffSign}>+</td>
                    <td className={styles.lineContent}>
                      <span className={styles.insText}>{line.revContent}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
