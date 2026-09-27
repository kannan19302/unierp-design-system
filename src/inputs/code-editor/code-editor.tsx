"use client";

import { forwardRef, useState, useId, type TextareaHTMLAttributes } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import { MarkdownEditor } from "./markdown-editor";
import styles from "./code-editor.module.css";

export type CodeEditorDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const codeEditorVariants = cva(styles.wrapper, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"] || "",
      compact: styles.compact || "",
      standard: styles.standard || "",
      comfortable: styles.comfortable || "",
    },
    invalid: {
      true: styles.hasError || "",
      false: "",
    },
    disabled: {
      true: styles.disabled || "",
      false: "",
    },
  },
  defaultVariants: {
    density: "standard",
    invalid: false,
    disabled: false,
  },
});

export interface CodeEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "disabled">,
    VariantProps<typeof codeEditorVariants> {
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
 * Standardized with cva, data-slot, and W3C APG textbox pattern.
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
      <div
        data-slot="code-editor"
        data-density={density}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid || Boolean(error) ? "true" : undefined}
        className={cn(
          codeEditorVariants({ density, invalid: invalid || Boolean(error), disabled: !!disabled }),
          className,
        )}
      >
        {label && (
          <div data-slot="code-editor-label-row" className={styles.labelRow}>
            <label htmlFor={inputId} data-slot="code-editor-label" className={styles.label}>
              {label}
              {required && <span className={styles.requiredIndicator} aria-hidden="true"> *</span>}
            </label>
          </div>
        )}

        {description && (
          <div id={descId} data-slot="code-editor-description" className={styles.description}>
            {description}
          </div>
        )}

        <div
          data-slot="code-editor-container"
          className={cn(
            styles.container,
            disabled && styles.disabled,
            (invalid || error) && styles.containerError,
          )}
        >
          <div data-slot="code-editor-header" className={styles.header}>
            <div data-slot="code-editor-lang" className={styles.langSection}>
              <Code2 size={13} className={styles.codeIcon} aria-hidden="true" />
              <span className={styles.langTag}>{language}</span>
            </div>

            {showCopyButton && (
              <button
                type="button"
                data-slot="code-editor-copy"
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

          <div data-slot="code-editor-body" className={styles.editorBody}>
            {showLineNumbers && (
              <div data-slot="code-editor-line-numbers" className={styles.lineNumbers} aria-hidden="true">
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
              data-slot="code-editor-textarea"
              value={value}
              disabled={disabled || undefined}
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
          <span id={errorId} data-slot="code-editor-error" className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

(CodeEditor as any).Markdown = MarkdownEditor;
CodeEditor.displayName = "CodeEditor";

