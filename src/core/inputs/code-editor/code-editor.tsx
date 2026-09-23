"use client";

import { forwardRef, useState, useId, type TextareaHTMLAttributes } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./code-editor.module.css";

export type CodeEditorDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface CodeEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: string;
  onChange?: (val: string) => void;
  language?: string;
  density?: CodeEditorDensity;
  label?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
}

/**
 * CodeEditor provides an enterprise mono-font editing area with syntax badge,
 * line numbers, copy button, 4-tier density scaling, and disabled spellcheck.
 *
 * @maturity stable
 */
export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      id,
      value = "",
      onChange,
      placeholder = "// Code editor...",
      disabled = false,
      language = "typescript",
      density = "standard",
      label,
      description,
      error,
      invalid = false,
      required = false,
      showLineNumbers = false,
      showCopyButton = true,
      className = "",
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard access denied or unsupported
      }
    };

    const lineCount = value.split("\n").length;
    const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

    const generatedId = useId();
    const inputId = id || generatedId;
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
              <Code2 size={13} className={styles.codeIcon} aria-hidden="true" />
              <span className={styles.langTag}>{language}</span>
            </div>

            {showCopyButton && (
              <button
                type="button"
                onClick={handleCopy}
                disabled={disabled || !value}
                className={styles.copyBtn}
                aria-label={copied ? "Copied to clipboard" : "Copy code"}
                title="Copy code"
              >
                {copied ? <Check size={12} className={styles.checkIcon} /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>

          <div className={styles.editorBody}>
            {showLineNumbers && (
              <div className={styles.lineNumbers} aria-hidden="true">
                {lineNumbers.map((num) => (
                  <span key={num} className={styles.lineNumber}>
                    {num}
                  </span>
                ))}
              </div>
            )}
            <textarea
              ref={ref}
              id={inputId}
              value={value}
              disabled={disabled}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
              aria-invalid={invalid || Boolean(error) ? "true" : undefined}
              aria-describedby={combinedDescribedBy}
              aria-label={label ? undefined : `${language} code editor`}
              className={styles.textarea}
              {...props}
            />
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

CodeEditor.displayName = "CodeEditor";
