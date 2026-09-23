"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle, useId, type ChangeEvent } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./image-upload.module.css";

export type ImageUploadDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface ImageUploadProps {
  id?: string;
  value?: string;
  onChange?: (url: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  density?: ImageUploadDensity;
  label?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * ImageUpload provides a focused single-image picker with instant object-URL preview,
 * keyboard triggering, 4-tier density scaling, and WCAG accessible labeling.
 *
 * @maturity stable
 */
export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(({
  id,
  value,
  onChange,
  onClear,
  disabled = false,
  density = "standard",
  label,
  description,
  error,
  invalid = false,
  required = false,
  className = "",
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const createdUrlsRef = useRef<Set<string>>(new Set());

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  // Revoke all created URLs on unmount
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore error if environment lacks revokeObjectURL
        }
      });
      createdUrlsRef.current.clear();
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // If previous value was created internally, revoke it upon replacement
      if (value && createdUrlsRef.current.has(value)) {
        try {
          URL.revokeObjectURL(value);
        } catch {
          // ignore
        }
        createdUrlsRef.current.delete(value);
      }
      const url = URL.createObjectURL(file);
      createdUrlsRef.current.add(url);
      onChange?.(url);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    // Revoke internally created URL on clear
    if (value && createdUrlsRef.current.has(value)) {
      try {
        URL.revokeObjectURL(value);
      } catch {
        // ignore
      }
      createdUrlsRef.current.delete(value);
    }
    if (onClear) {
      onClear();
    } else {
      onChange?.("");
    }
  };

  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const labelId = label ? `${inputId}-label` : undefined;
  const combinedDescribedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn(styles.wrapper, className)} data-density={density}>
      {label && (
        <div className={styles.labelRow}>
          <label id={labelId} htmlFor={inputId} className={styles.label}>
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
        ref={containerRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-label={label ? undefined : "Upload image trigger"}
        aria-disabled={disabled}
        aria-invalid={invalid || Boolean(error) ? "true" : undefined}
        aria-describedby={combinedDescribedBy}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          styles.box,
          disabled && styles.disabled,
          (invalid || error) && styles.boxError,
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
        {value ? (
          <div className={styles.previewContainer}>
            <img
              src={value}
              alt="Uploaded preview"
              className={styles.previewImage}
            />
            {!disabled && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClear}
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          <div className={styles.placeholder}>
            <ImageIcon className={styles.icon} aria-hidden="true" />
            <span className={styles.placeholderText}>Upload image</span>
          </div>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

ImageUpload.displayName = "ImageUpload";
