"use client";

import { forwardRef, useState, useId, type TextareaHTMLAttributes } from "react";
import { FileText, Eye, Edit3 } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./code-editor.module.css";

export type MarkdownEditorDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface MarkdownEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: string;
  onChange?: (val: string) => void;
  density?: MarkdownEditorDensity;
  label?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  (
    {
      id,
      value = "",
      onChange,
      placeholder = "# Markdown content...",
      disabled = false,
      density = "standard",
      label,
      description,
      error,
      invalid = false,
      required = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

    const errorId = error ? `${inputId}-error` : undefined;
    const descId = description ? `${inputId}-desc` : undefined;
    const combinedDescribedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn(styles.wrapper, className)} data-density={density}>
        {label && (
          <div className={styles.labelRow}>
            <label htmlFor={inputId} className={styles.label}>
              {label}
              {required && <span className={styles.requiredIndicator} aria-hidden="true"> *</span>}
            </label>
          </div>
        )}

        {description && (
          <div id={descId} className={styles.description}>
            {description}
          </div>
        )}

        <div
          className={cn(
            styles.container,
            disabled && styles.disabled,
            (invalid || error) && styles.containerError,
          )}
        >
          <div className={styles.header}>
            <div className={styles.langSection}>
              <FileText size={13} className={styles.codeIcon} aria-hidden="true" />
              <span className={styles.langTag}>markdown</span>
            </div>

            <div className={styles.viewToggleGroup}>
              <button
                type="button"
                className={cn(styles.toggleBtn, viewMode === "edit" && styles.toggleActive)}
                onClick={() => setViewMode("edit")}
                aria-pressed={viewMode === "edit"}
              >
                <Edit3 size={12} aria-hidden="true" />
                <span>Write</span>
              </button>
              <button
                type="button"
                className={cn(styles.toggleBtn, viewMode === "preview" && styles.toggleActive)}
                onClick={() => setViewMode("preview")}
                aria-pressed={viewMode === "preview"}
              >
                <Eye size={12} aria-hidden="true" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          <div className={styles.editorBody}>
            {viewMode === "edit" ? (
              <textarea
                ref={ref}
                id={inputId}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                aria-invalid={invalid || Boolean(error) ? "true" : undefined}
                aria-describedby={combinedDescribedBy}
                aria-label={label ? undefined : "Markdown editor"}
                className={styles.textarea}
                {...props}
              />
            ) : (
              <div className={styles.markdownPreview} tabIndex={0} aria-label="Markdown preview">
                {value ? (
                  <pre className={styles.previewPre}>{value}</pre>
                ) : (
                  <span className={styles.emptyPreview}>Nothing to preview</span>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";
