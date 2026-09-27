"use client";

import { useState, useRef, forwardRef, useImperativeHandle, useId, type DragEvent } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import styles from "./file-upload.module.css";

export type FileUploadDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const fileUploadVariants = cva(styles.wrapper, {
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

export interface UploadFileItem {
  id?: string;
  name: string;
  size?: number;
  progress?: number;
  status?: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export interface FileUploadProps extends VariantProps<typeof fileUploadVariants> {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  density?: FileUploadDensity;
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  files?: UploadFileItem[];
  onFileRemove?: (index: number) => void;
  className?: string;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * FileUpload component providing an accessible dropzone area with keyboard activation,
 * drag-and-drop feedback, 4-tier density scaling, and file queue staging indicators.
 * Standardized with cva, data-slot, and accessible drag-and-drop button semantics.
 *
 * @maturity stable
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(({
  onFileSelect,
  accept,
  multiple = false,
  disabled = false,
  density = "standard",
  id,
  label,
  description,
  error,
  invalid = false,
  required = false,
  files,
  onFileRemove,
  className = "",
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [dragOver, setDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    onFileSelect?.(e.dataTransfer.files);
  };

  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const labelId = label ? `${inputId}-label` : undefined;
  const combinedDescribedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      data-slot="file-upload"
      data-density={density}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={invalid || Boolean(error) ? "true" : undefined}
      className={cn(fileUploadVariants({ density, disabled: !!disabled }), className)}
    >
      {label && (
        <div data-slot="file-upload-label-row" className={styles.labelRow}>
          <label id={labelId} htmlFor={inputId} data-slot="file-upload-label" className={styles.label}>
            {label}
            {required && <span className={styles.requiredIndicator} aria-hidden="true"> *</span>}
          </label>
        </div>
      )}

      {description && (
        <div id={descId} data-slot="file-upload-description" className={styles.description}>
          {description}
        </div>
      )}

      <div
        ref={containerRef}
        data-slot="file-upload-dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-invalid={invalid || Boolean(error) ? "true" : undefined}
        aria-describedby={combinedDescribedBy}
        aria-labelledby={labelId}
        aria-label={label ? undefined : "Upload files dropzone"}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          styles.dropzone,
          dragOver && styles.dragOver,
          disabled && styles.disabled,
          (invalid || error) && styles.dropzoneError,
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => onFileSelect?.(e.target.files)}
          className={styles.hiddenInput}
        />
        <Upload size={24} data-slot="file-upload-icon" className={styles.uploadIcon} aria-hidden="true" />
        <div data-slot="file-upload-text" className={styles.primaryText}>Click or drag files here to upload</div>
        <div data-slot="file-upload-subtext" className={styles.subText}>{accept ? `Accepted formats: ${accept}` : "Drag and drop or browse from your device"}</div>
      </div>

      {error && (
        <span id={errorId} data-slot="file-upload-error" className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}

      {files && files.length > 0 && (
        <ul data-slot="file-upload-list" className={styles.fileList} aria-label="Selected file list">
          {files.map((file, idx) => {
            const isUploading = file.status === "uploading";
            const isDone = file.status === "done";
            const isErr = file.status === "error";

            return (
              <li key={file.id || `${file.name}-${idx}`} data-slot="file-upload-item" className={styles.fileItem}>
                <FileText size={16} data-slot="file-upload-file-icon" className={styles.fileIcon} aria-hidden="true" />
                <div className={styles.fileDetails}>
                  <div className={styles.fileNameRow}>
                    <span className={styles.fileName} title={file.name}>
                      {file.name}
                    </span>
                    {file.size !== undefined && (
                      <span className={styles.fileSize}>{formatBytes(file.size)}</span>
                    )}
                  </div>
                  {isUploading && file.progress !== undefined && (
                    <div
                      data-slot="file-upload-progress"
                      className={styles.progressBar}
                      role="progressbar"
                      aria-valuenow={file.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        data-slot="file-upload-progress-fill"
                        className={styles.progressFill}
                        style={{ inlineSize: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.error && <span className={styles.fileErrorText}>{file.error}</span>}
                </div>

                <div className={styles.fileActions}>
                  {isUploading && (
                    <Loader2 size={14} className={styles.spinIcon} aria-label="Uploading" />
                  )}
                  {isDone && (
                    <CheckCircle2 size={14} className={styles.doneIcon} aria-label="Upload complete" />
                  )}
                  {isErr && (
                    <AlertCircle size={14} className={styles.errorIcon} aria-label="Upload error" />
                  )}
                  {onFileRemove && (
                    <button
                      type="button"
                      data-slot="file-upload-remove"
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileRemove(idx);
                      }}
                      aria-label={`Remove file ${file.name}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

FileUpload.displayName = "FileUpload";

