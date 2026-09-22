"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import styles from "./rich-text-editor.module.css";

export interface RichTextEditorProps {
  id?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * RichTextEditor provides a streamlined formatting toolbar and text canvas for markdown/rich annotations.
 *
 * @maturity stable
 */
export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(({
  id,
  value = "",
  onChange,
  placeholder = "Rich text content...",
  disabled = false,
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
  };

  return (
    <div
      className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}
    >
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={() => applyFormat("**", "**")}
          disabled={disabled}
          title="Bold"
          aria-label="Bold text formatting"
          className={styles.toolBtn}
        >
          <Bold size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("*", "*")}
          disabled={disabled}
          title="Italic"
          aria-label="Italic text formatting"
          className={styles.toolBtn}
        >
          <Italic size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("<u>", "</u>")}
          disabled={disabled}
          title="Underline"
          aria-label="Underline text formatting"
          className={styles.toolBtn}
        >
          <Underline size={13} aria-hidden="true" />
        </button>
        <span className={styles.divider} />
        <button
          type="button"
          onClick={() => applyFormat("\n- ", "")}
          disabled={disabled}
          title="Bullet List"
          aria-label="Insert bullet list"
          className={styles.toolBtn}
        >
          <List size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("\n1. ", "")}
          disabled={disabled}
          title="Numbered List"
          aria-label="Insert numbered list"
          className={styles.toolBtn}
        >
          <ListOrdered size={13} aria-hidden="true" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Rich text editor area"
        className={styles.textarea}
      />
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";
