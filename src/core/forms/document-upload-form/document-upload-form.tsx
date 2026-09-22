"use client";

import {
  useState,
  useRef,
  forwardRef,
  type HTMLAttributes,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import styles from "./document-upload-form.module.css";

export interface DocumentUploadFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onUpload"> {
  acceptedTypes?: string[];
  maxFiles?: number;
  initialFileNames?: string[];
  onUpload?: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * `<DocumentUploadForm>` handles multi-file asset attachment and document ingest
 * for compliance verification, vendor invoices, and identity records.
 *
 * @maturity stable
 */
export const DocumentUploadForm = forwardRef<
  HTMLDivElement,
  DocumentUploadFormProps
>(
  (
    {
      acceptedTypes = ["PDF", "PNG", "JPG"],
      maxFiles = 10,
      initialFileNames = [],
      onUpload,
      title = "Upload Documents",
      subtitle,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileList, setFileList] = useState<string[]>(initialFileNames);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        const names = filesArray.map((f) => f.name);
        setFileList((prev) => [...prev, ...names].slice(0, maxFiles));
        onUpload?.(filesArray);
      }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        const names = filesArray.map((f) => f.name);
        setFileList((prev) => [...prev, ...names].slice(0, maxFiles));
        onUpload?.(filesArray);
      }
    };

    const handleRemoveFile = (index: number) => {
      setFileList((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="region"
        aria-label={title}
        {...restProps}
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <div className={styles.content}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            aria-label="Upload file input"
          />

          <div
            className={`${styles.dropzone} ${
              isDragging ? styles.dropzoneActive : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            role="button"
            aria-label="Upload files dropzone"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className={styles.dropzoneIcon}>
              <UploadCloud size={32} style={{ color: "var(--color-brand)" }} aria-hidden="true" />
            </div>
            <div className={styles.dropzoneText}>
              Drag and drop files here, or click to browse
            </div>
            <div className={styles.dropzoneMeta}>
              Accepted: {acceptedTypes.join(", ")} • Max {maxFiles} files
            </div>
          </div>

          {fileList.length > 0 && (
            <div className={styles.filesList} role="list" aria-label="Uploaded files">
              {fileList.map((filename, idx) => (
                <div key={idx} className={styles.fileItem} role="listitem">
                  <div className={styles.fileMeta}>
                    <FileText size={16} aria-hidden="true" />
                    <span>{filename}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveFile(idx)}
                    aria-label={`Remove ${filename}`}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

DocumentUploadForm.displayName = "DocumentUploadForm";
