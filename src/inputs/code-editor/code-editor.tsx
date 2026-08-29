"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import styles from "./code-editor.module.css";

export interface CodeEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: string;
  onChange?: (val: string) => void;
  language?: string;
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      id,
      value = "",
      onChange,
      placeholder = "// Code editor...",
      disabled = false,
      language = "typescript",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}>
        <div className={styles.header}>
          <span className={styles.langTag}>{language}</span>
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className={styles.textarea}
          {...props}
        />
      </div>
    );
  }
);
CodeEditor.displayName = "CodeEditor";
