"use client";

import { useState, useRef, forwardRef, useImperativeHandle, type DragEvent } from "react";
import { Upload } from "lucide-react";
import styles from "./file-upload.module.css";

export interface FileUploadProps {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * FileUpload component providing an accessible dropzone area with keyboard activation,
 * drag-and-drop feedback, and hidden input triggers.
 *
 * @maturity stable
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(({
  onFileSelect,
  accept,
  multiple = false,
  disabled = false,
  className = "",
}, ref) => {
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

  const containerClass = [
    styles.dropzone,
    dragOver ? styles.dragOver : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload files dropzone"
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
      className={containerClass}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => onFileSelect?.(e.target.files)}
        className={styles.hiddenInput}
      />
      <Upload size={24} className={styles.uploadIcon} aria-hidden="true" />
      <div className={styles.primaryText}>Click or drag files here to upload</div>
      <div className={styles.subText}>Supports chunked resumable upload</div>
    </div>
  );
});

FileUpload.displayName = "FileUpload";
