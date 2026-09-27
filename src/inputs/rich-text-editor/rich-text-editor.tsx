"use client";

import { useRef, forwardRef, useImperativeHandle, useId } from "react";
import { Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered, Quote } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import styles from "./rich-text-editor.module.css";

export type RichTextEditorDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const richTextEditorVariants = cva(styles.wrapper, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"] || "",
      compact: styles.compact || "",
      standard: styles.standard || "",
      comfortable: styles.comfortable || "",
    },
    disabled: {
      true: styles.disabled,
      false: "",
    },
  },
  defaultVariants: {
    density: "standard",
    disabled: false,
  },
});

export interface RichTextEditorProps extends VariantProps<typeof richTextEditorVariants> {
  id?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  density?: RichTextEditorDensity;
  label?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * RichTextEditor provides a streamlined formatting toolbar and text canvas for markdown/rich annotations,
 * supporting 4-tier density, selection-aware formatting, and WCAG AA accessibility.
 * Standardized with cva, data-slot, and accessible toolbar/textbox pattern.
 *
 * @maturity stable
 */
export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(({
  id,
  value = "",
  onChange,
  placeholder = "Rich text content...",
  disabled = false,
  density = "standard",
  label,
  description,
  error,
  invalid = false,
  required = false,
  className = "",
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  const applyFormat = (prefix: string, suffix: string) => {
    if (!textareaRef.current || disabled) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const updated = value.slice(0, start) + `${prefix}${selected}${suffix}` + value.slice(end);
    onChange?.(updated);

    // Reset selection back around original text
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const combinedDescribedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      data-slot="rich-text-editor"
      data-density={density}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={invalid || Boolean(error) ? "true" : undefined}
      className={cn(richTextEditorVariants({ density, disabled: !!disabled }), className)}
    >
      {label && (
        <div data-slot="rich-text-editor-label-row" className={styles.labelRow}>
          <label htmlFor={inputId} data-slot="rich-text-editor-label" className={styles.label}>
            {label}
            {required && <span className={styles.requiredIndicator} aria-hidden="true"> *</span>}
          </label>
        </div>
      )}

      {description && (
        <div id={descId} data-slot="rich-text-editor-description" className={styles.description}>
          {description}
        </div>
      )}

      <div
        data-slot="rich-text-editor-container"
        className={cn(
          styles.container,
          disabled && styles.disabled,
          (invalid || error) && styles.containerError,
        )}
      >
        <div data-slot="rich-text-editor-toolbar" className={styles.toolbar} role="toolbar" aria-label="Text formatting tools">
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("**", "**")}
            disabled={disabled}
            title="Bold (**text**)"
            aria-label="Bold text formatting"
            className={styles.toolBtn}
          >
            <Bold size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("*", "*")}
            disabled={disabled}
            title="Italic (*text*)"
            aria-label="Italic text formatting"
            className={styles.toolBtn}
          >
            <Italic size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("<u>", "</u>")}
            disabled={disabled}
            title="Underline"
            aria-label="Underline text formatting"
            className={styles.toolBtn}
          >
            <Underline size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("~~", "~~")}
            disabled={disabled}
            title="Strikethrough (~~text~~)"
            aria-label="Strikethrough text formatting"
            className={styles.toolBtn}
          >
            <Strikethrough size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("`", "`")}
            disabled={disabled}
            title="Inline Code (`code`)"
            aria-label="Inline code formatting"
            className={styles.toolBtn}
          >
            <Code size={13} aria-hidden="true" />
          </button>

          <span data-slot="rich-text-editor-divider" className={styles.divider} aria-hidden="true" />

          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("\n- ", "")}
            disabled={disabled}
            title="Bullet List (- item)"
            aria-label="Insert bullet list"
            className={styles.toolBtn}
          >
            <List size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("\n1. ", "")}
            disabled={disabled}
            title="Numbered List (1. item)"
            aria-label="Insert numbered list"
            className={styles.toolBtn}
          >
            <ListOrdered size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            data-slot="rich-text-editor-tool-btn"
            onClick={() => applyFormat("\n> ", "")}
            disabled={disabled}
            title="Quote block (> quote)"
            aria-label="Insert blockquote"
            className={styles.toolBtn}
          >
            <Quote size={13} aria-hidden="true" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          id={inputId}
          data-slot="rich-text-editor-textarea"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={label ? undefined : "Rich text editor area"}
          aria-invalid={invalid || Boolean(error) ? "true" : undefined}
          aria-describedby={combinedDescribedBy}
          className={styles.textarea}
        />
      </div>

      {error && (
        <span id={errorId} data-slot="rich-text-editor-error" className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

