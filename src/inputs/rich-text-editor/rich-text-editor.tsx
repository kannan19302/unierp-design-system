"use client";

import { useRef, type FC } from "react";
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

export const RichTextEditor: FC<RichTextEditorProps> = ({
  id,
  value = "",
  onChange,
  placeholder = "Rich text content...",
  disabled = false,
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          className={styles.toolBtn}
        >
          <Bold size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("*", "*")}
          disabled={disabled}
          title="Italic"
          className={styles.toolBtn}
        >
          <Italic size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("<u>", "</u>")}
          disabled={disabled}
          title="Underline"
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
          className={styles.toolBtn}
        >
          <List size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat("\n1. ", "")}
          disabled={disabled}
          title="Numbered List"
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
        className={styles.textarea}
      />
    </div>
  );
};
