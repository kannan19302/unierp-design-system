"use client";

import { useState, forwardRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import styles from "./tag-input.module.css";

export interface TagInputProps {
  id?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * TagInput component enabling tokenized keyword entry, backspace removal, and keyboard navigation.
 *
 * @maturity stable
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(({
  id,
  tags = [],
  onChange,
  placeholder = "Type tag and press enter...",
  disabled = false,
  className = "",
}, ref) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return;
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      if (lastTag) removeTag(lastTag);
    }
  };

  return (
    <div
      className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}
    >
      {tags.map((tag) => (
        <span key={tag} className={styles.tagChip}>
          <span className={styles.tagLabel}>{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className={styles.removeBtn}
            >
              <X size={10} aria-hidden="true" />
            </button>
          )}
        </span>
      ))}
      <input
        ref={ref}
        id={id}
        type="text"
        value={input}
        disabled={disabled}
        aria-label={placeholder || "Add tag"}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className={styles.inputField}
      />
    </div>
  );
});

TagInput.displayName = "TagInput";
