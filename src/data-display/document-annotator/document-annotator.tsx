"use client";

import { useState, type ReactNode, type FC } from "react";
import { MessageSquare, ShieldCheck } from "lucide-react";
import styles from "./document-annotator.module.css";


export type DocumentStampType = "APPROVED" | "REJECTED" | "POSTED" | "AUDITED";

export interface DocumentStamp {
  id: string;
  type: DocumentStampType;
  signee: string;
  timestamp: string;
  x: number;
  y: number;
}

export interface DocumentAnnotation {
  id: string;
  author: string;
  text: string;
  x: number;
  y: number;
}

export interface DocumentAnnotatorProps {
  title: string;
  documentNumber?: string;
  children: ReactNode;
  stamps?: DocumentStamp[];
  annotations?: DocumentAnnotation[];
  onAddStamp?: (type: DocumentStampType) => void;
  onAddAnnotation?: (text: string) => void;
  className?: string;
}

export const DocumentAnnotator: FC<DocumentAnnotatorProps> = ({
  title,
  documentNumber,
  children,
  stamps = [],
  annotations = [],
  onAddStamp,
  onAddAnnotation,
  className = "",
}) => {
  const [annotationText, setAnnotationText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleCreateNote = () => {
    if (!annotationText.trim()) return;
    onAddAnnotation?.(annotationText);
    setAnnotationText("");
    setIsAddingNote(false);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.toolbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <ShieldCheck size={16} style={{ color: "var(--color-brand)" }} />
          <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{title}</span>
          {documentNumber && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono, monospace)" }}>
              [{documentNumber}]
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {onAddStamp && (
            <>
              <button
                type="button"
                style={{
                  height: 28,
                  padding: "0 8px",
                  fontSize: "var(--text-xs)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid #059669",
                  background: "#ecfdf5",
                  color: "#059669",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => onAddStamp("APPROVED")}
              >
                + Approve Stamp
              </button>
              <button
                type="button"
                style={{
                  height: 28,
                  padding: "0 8px",
                  fontSize: "var(--text-xs)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid #2563eb",
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => onAddStamp("AUDITED")}
              >
                + Audit Stamp
              </button>
            </>
          )}

          {onAddAnnotation && (
            <button
              type="button"
              style={{
                height: 28,
                padding: "0 8px",
                fontSize: "var(--text-xs)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              onClick={() => setIsAddingNote(!isAddingNote)}
            >
              <MessageSquare size={12} /> Add Note
            </button>
          )}
        </div>
      </div>

      {isAddingNote && (
        <div style={{ padding: "var(--space-3)", background: "#fef9c3", borderBottom: "1px solid #fde047", display: "flex", gap: "var(--space-2)" }}>
          <input
            type="text"
            placeholder="Type reviewer annotation..."
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            style={{ flex: 1, padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid #ca8a04", fontSize: "var(--text-xs)" }}
          />
          <button
            type="button"
            onClick={handleCreateNote}
            style={{ padding: "4px 12px", background: "#ca8a04", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}
          >
            Post Note
          </button>
        </div>
      )}

      <div className={styles.docCanvas}>
        <div className={styles.paper}>
          {/* Document Content */}
          {children}

          {/* Stamps */}
          {stamps.map((stamp) => {
            const stampClass =
              stamp.type === "APPROVED"
                ? styles.stampApproved
                : stamp.type === "REJECTED"
                ? styles.stampRejected
                : styles.stampAudit;

            return (
              <div
                key={stamp.id}
                className={`${styles.stamp} ${stampClass}`}
                style={{ top: stamp.y, left: stamp.x }}
              >
                <div>✓ {stamp.type}</div>
                <div style={{ fontSize: 9, fontWeight: 500, opacity: 0.85 }}>
                  {stamp.signee} · {stamp.timestamp}
                </div>
              </div>
            );
          })}

          {/* Annotations */}
          {annotations.map((ann) => (
            <div
              key={ann.id}
              className={styles.annotation}
              style={{ top: ann.y, left: ann.x }}
            >
              <strong>{ann.author}:</strong>
              <div>{ann.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
