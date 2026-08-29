"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Check, X, Pencil } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./inline-edit.module.css";

export interface InlineEditProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number";
  validate?: (val: string) => string | null;
  className?: string;
}

export function InlineEdit({
  value,
  onSave,
  label,
  placeholder = "Click to edit...",
  disabled = false,
  type = "text",
  validate,
  className,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    if (disabled || isSaving) return;
    setDraft(value);
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(value);
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (validate) {
      const err = validate(draft);
      if (err) {
        setError(err);
        return;
      }
    }

    if (draft === value) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSave(draft);
      setError(null);
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn(styles.container, styles.editing, className)}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type={type}
            value={draft}
            disabled={isSaving}
            onChange={(e) => {
              setDraft(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            className={cn(styles.input, error && styles.inputError)}
            aria-label={label ?? placeholder}
            aria-invalid={!!error}
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={cn(styles.actionBtn, styles.saveBtn)}
              onClick={handleSave}
              disabled={isSaving}
              aria-label="Save changes"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              className={cn(styles.actionBtn, styles.cancelBtn)}
              onClick={handleCancel}
              disabled={isSaving}
              aria-label="Cancel editing"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        {error && <span className={styles.errorMessage} role="alert">{error}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(styles.container, styles.display, disabled && styles.disabled, className)}
      onClick={handleStartEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStartEditing();
        }
      }}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={label ? `${label}: ${value || placeholder}` : `Edit: ${value || placeholder}`}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.displayContent}>
        <span className={cn(styles.valueText, !value && styles.placeholder)}>
          {value || placeholder}
        </span>
        {!disabled && <Pencil size={12} className={styles.pencilIcon} aria-hidden="true" />}
      </div>
    </div>
  );
}
