"use client";

import { useRef, type FC, type ChangeEvent } from "react";
import { Image as ImageIcon } from "lucide-react";
import styles from "./image-upload.module.css";

export interface ImageUploadProps {
  id?: string;
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange?.(url);
    }
  };

  const containerClass = [
    styles.box,
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
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
        id={id}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
      {value ? (
        <img
          src={value}
          alt="Uploaded preview"
          className={styles.previewImage}
        />
      ) : (
        <div className={styles.placeholder}>
          <ImageIcon size={20} className={styles.icon} aria-hidden="true" />
          <span className={styles.label}>Upload image</span>
        </div>
      )}
    </div>
  );
};
