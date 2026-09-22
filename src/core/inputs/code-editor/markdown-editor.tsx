"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import styles from "./code-editor.module.css";

export interface MarkdownEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: string;
  onChange?: (val: string) => void;
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  (
    {
      id,
      value = "",
      onChange,
      placeholder = "# Markdown content...",
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}>
        <div className={styles.header}>
          <span className={styles.langTag}>markdown</span>
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={styles.textarea}
          {...props}
        />
      </div>
    );
  }
);
MarkdownEditor.displayName = "MarkdownEditor";
