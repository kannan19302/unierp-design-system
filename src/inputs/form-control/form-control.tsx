"use client";

import {
  useState,
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  type FC,
} from "react";
import { AlertCircle } from "lucide-react";
import styles from "./form-control.module.css";

export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string | null;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  className = "",
  children,
}) => (
  <div className={`${styles.fieldContainer} ${className}`.trim()}>
    {label && (
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.requiredStar}> *</span>}
      </label>
    )}
    {children}
    {error ? (
      <span className={styles.errorMsg} role="alert">
        <AlertCircle size={12} aria-hidden="true" />
        <span>{error}</span>
      </span>
    ) : hint ? (
      <span className={styles.hintMsg}>{hint}</span>
    ) : null}
  </div>
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, prefixIcon, suffixIcon, className = "", ...props }, ref) => {
    const inputClass = [styles.control, invalid && styles.invalid, className]
      .filter(Boolean)
      .join(" ");

    if (prefixIcon || suffixIcon) {
      return (
        <div className={styles.inputWrapper}>
          {prefixIcon && <span className={styles.prefixSlot}>{prefixIcon}</span>}
          <input
            ref={ref}
            aria-invalid={invalid || undefined}
            className={inputClass}
            {...props}
          />
          {suffixIcon && <span className={styles.suffixSlot}>{suffixIcon}</span>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={inputClass}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, className = "", ...props }, ref) => {
    const textareaClass = [
      styles.control,
      styles.textarea,
      invalid && styles.invalid,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={textareaClass}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid, className = "", children, ...props }, ref) => {
    const selectClass = [
      styles.control,
      styles.select,
      invalid && styles.invalid,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.selectWrapper}>
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={selectClass}
          {...props}
        >
          {children}
        </select>
        <span className={styles.selectArrow} aria-hidden="true" />
      </div>
    );
  }
);
Select.displayName = "Select";

export interface TextFieldProps extends InputProps {
  label: ReactNode;
  error?: string | null;
  hint?: ReactNode;
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, required, id: customId, ...inputProps }, ref) => {
    const generatedId = useId();
    const id = customId ?? generatedId;

    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        error={error}
        hint={hint}
      >
        <Input ref={ref} id={id} invalid={!!error} {...inputProps} />
      </FormField>
    );
  }
);
TextField.displayName = "TextField";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export const FormSection: FC<FormSectionProps> = ({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  className = "",
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.section} ${className}`.trim()}>
      <div
        className={`${styles.sectionHeader} ${collapsible ? styles.sectionHeaderClickable : ""}`}
        onClick={() => collapsible && setOpen((o) => !o)}
      >
        <div>
          <h3 className={styles.sectionTitle}>{title}</h3>
          {description && <p className={styles.sectionDesc}>{description}</p>}
        </div>
        {collapsible && (
          <span
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          >
            ▾
          </span>
        )}
      </div>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
};

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  className?: string;
}

export const AutosaveIndicator: FC<AutosaveIndicatorProps> = ({
  status,
  className = "",
}) => {
  if (status === "idle") return null;

  const config = {
    saving: { label: "Saving changes...", color: "var(--color-text-secondary)" },
    saved: { label: "All changes saved", color: "var(--color-success)" },
    error: { label: "Failed to save", color: "var(--color-danger)" },
  }[status];

  return (
    <span
      className={`${styles.autosave} ${className}`.trim()}
      style={{ color: config.color }}
      aria-live="polite"
    >
      {config.label}
    </span>
  );
};
