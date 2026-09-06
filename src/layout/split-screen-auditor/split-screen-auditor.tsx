"use client";

import {
  useState,
  useRef,
  type FC,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent,
} from "react";
import { FileText, CheckCircle2, GripVertical } from "lucide-react";
import styles from "./split-screen-auditor.module.css";

export type AuditorDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface SplitScreenAuditorProps {
  /** Left pane content: Document canvas, invoice PDF, medical chart, or drawing sheet */
  documentViewer: ReactNode;
  /** Right pane content: Extracted fields, ledger distribution, or audit checklist form */
  auditForm: ReactNode;
  /** Title for document pane */
  documentTitle?: string;
  /** Title for audit form pane */
  formTitle?: string;
  /** Toolbar controls for document viewer (zoom, rotate, fit) */
  documentControls?: ReactNode;
  /** Action buttons for audit form (approve, reject, flag) */
  formActions?: ReactNode;
  /** Initial left pane split ratio percentage (20 to 80, default 50) */
  defaultSplitRatio?: number;
  /** Minimum left pane ratio percentage */
  minRatio?: number;
  /** Maximum left pane ratio percentage */
  maxRatio?: number;
  /** Callback when user resizes split ratio */
  onSplitChange?: (ratio: number) => void;
  /** Density scale */
  density?: AuditorDensity;
  className?: string;
}

/**
 * `<SplitScreenAuditor>` — Anatomy inspired by Bill.com (#41), Canvas SpeedGrader (#103), and Cerner eMAR (#102).
 * Dual-pane split-screen workspace pairing document/PDF source preview on the left with OCR extraction / audit form on the right.
 */
export const SplitScreenAuditor: FC<SplitScreenAuditorProps> = ({
  documentViewer,
  auditForm,
  documentTitle = "Source Document Evidence",
  formTitle = "Audit & Ledger Distribution",
  documentControls,
  formActions,
  defaultSplitRatio = 50,
  minRatio = 25,
  maxRatio = 75,
  onSplitChange,
  density = "compact",
  className = "",
}) => {
  const [splitRatio, setSplitRatio] = useState(defaultSplitRatio);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawRatio = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const clampedRatio = Math.max(minRatio, Math.min(maxRatio, rawRatio));
      setSplitRatio(clampedRatio);
      onSplitChange?.(clampedRatio);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let nextRatio = splitRatio;
    if (e.key === "ArrowLeft") {
      nextRatio = Math.max(minRatio, splitRatio - 2);
    } else if (e.key === "ArrowRight") {
      nextRatio = Math.min(maxRatio, splitRatio + 2);
    } else if (e.key === "Home") {
      nextRatio = minRatio;
    } else if (e.key === "End") {
      nextRatio = maxRatio;
    } else {
      return;
    }

    e.preventDefault();
    setSplitRatio(nextRatio);
    onSplitChange?.(nextRatio);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.root} ${className}`.trim()}
      data-density={density}
      data-floorplan="split-screen-auditor"
    >
      {/* ── Left Pane: Document Viewer ── */}
      <section
        className={styles.pane}
        style={{ flex: `0 0 ${splitRatio}%` }}
        aria-label={documentTitle}
      >
        <div className={styles.paneHeader}>
          <div className={styles.headerTitleGroup}>
            <FileText size={15} className={styles.paneIcon} aria-hidden="true" />
            <h3 className={styles.paneTitle}>{documentTitle}</h3>
          </div>
          {documentControls && <div className={styles.paneControls}>{documentControls}</div>}
        </div>
        <div className={styles.paneBody}>{documentViewer}</div>
      </section>

      {/* ── Resizable Splitter Handle ── */}
      <div
        className={styles.splitter}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(splitRatio)}
        aria-valuemin={minRatio}
        aria-valuemax={maxRatio}
        aria-label="Resize split ratio between document and audit form"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.gripHandle}>
          <GripVertical size={14} aria-hidden="true" />
        </div>
      </div>

      {/* ── Right Pane: Form & Extraction Ledger ── */}
      <section
        className={`${styles.pane} ${styles.formPane}`}
        style={{ flex: `0 0 ${100 - splitRatio}%` }}
        aria-label={formTitle}
      >
        <div className={styles.paneHeader}>
          <div className={styles.headerTitleGroup}>
            <CheckCircle2 size={15} className={styles.paneIcon} aria-hidden="true" />
            <h3 className={styles.paneTitle}>{formTitle}</h3>
          </div>
          {formActions && <div className={styles.paneActions}>{formActions}</div>}
        </div>
        <div className={styles.paneBody}>{auditForm}</div>
      </section>
    </div>
  );
};
