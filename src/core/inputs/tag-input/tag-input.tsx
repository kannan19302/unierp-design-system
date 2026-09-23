"use client";

import { useState, forwardRef, useId, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import styles from "./tag-input.module.css";

export interface TagInputProps {
  id?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  maxTags?: number;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
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
  invalid = false,
  required = false,
  label,
  error,
  maxTags,
  density,
  className = "",
}, ref) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      if (maxTags !== undefined && tags.length >= maxTags) return;
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

  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  const containerClass = [
    styles.container,
    density ? styles[density] : "",
    invalid || !!error ? styles.invalid : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.rootContainer} data-density={density}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={containerClass}>
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
          id={inputId}
          type="text"
          value={input}
          disabled={disabled || (maxTags !== undefined && tags.length >= maxTags)}
          aria-label={label ? undefined : (placeholder || "Add tag")}
          aria-invalid={invalid || !!error || undefined}
          aria-describedby={errorId}
          required={required && tags.length === 0}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 || !maxTags || tags.length < maxTags ? placeholder : ""}
          className={styles.inputField}
        />
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

TagInput.displayName = "TagInput";
