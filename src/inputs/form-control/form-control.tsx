import {
  useState,
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type FC,
} from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./form-control.module.css";

export const formControlVariants = cva(styles.control, {
  variants: {
    invalid: {
      true: styles.invalid,
      false: "",
    },
  },
  defaultVariants: {
    invalid: false,
  },
});

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL FormField container — accessible label, required asterisk, hint text, and error binding.
 * Standardized with cva, data-slot, and W3C APG form group pattern.
 */
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string | null;
  hint?: ReactNode;
  messageId?: string;
  className?: string;
  children: ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  label,
  htmlFor,
  required,
  error,
  hint,
  messageId,
  className = "",
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    data-slot="form-field"
    data-invalid={error ? "true" : undefined}
    className={`${styles.fieldContainer} ${className}`.trim()}
    {...props}
  >
    {label && (
      <label htmlFor={htmlFor} data-slot="form-label" className={styles.label}>
        {label}
        {required && <span data-slot="form-required" className={styles.requiredStar}> *</span>}
      </label>
    )}
    {children}
    {error ? (
      <span id={messageId} data-slot="form-message" className={styles.errorMsg} role="alert">
        <AlertCircle size={12} aria-hidden="true" />
        <span>{error}</span>
      </span>
    ) : hint ? (
      <span id={messageId} data-slot="form-hint" className={styles.hintMsg}>{hint}</span>
    ) : null}
  </div>
));
FormField.displayName = "FormField";

/**
 * `<FormControl>` — Canonical alias for FormField.
 */
export const FormControl = FormField;

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof formControlVariants> {
  invalid?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, prefixIcon, suffixIcon, className = "", ...props }, ref) => {
    const inputClass = `${formControlVariants({ invalid })} ${className}`.trim();

    if (prefixIcon || suffixIcon) {
      return (
        <div data-slot="form-control-wrapper" className={styles.inputWrapper}>
          {prefixIcon && <span data-slot="form-control-prefix" className={styles.prefixSlot}>{prefixIcon}</span>}
          <input
            ref={ref}
            aria-invalid={invalid || undefined}
            data-slot="form-control"
            className={inputClass}
            {...props}
          />
          {suffixIcon && <span data-slot="form-control-suffix" className={styles.suffixSlot}>{suffixIcon}</span>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        data-slot="form-control"
        className={inputClass}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof formControlVariants> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, className = "", ...props }, ref) => {
    const textareaClass = [
      formControlVariants({ invalid }),
      styles.textarea,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        data-slot="form-control"
        className={textareaClass}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof formControlVariants> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid, className = "", children, ...props }, ref) => {
    const selectClass = [
      formControlVariants({ invalid }),
      styles.select,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div data-slot="form-select-wrapper" className={styles.selectWrapper}>
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          data-slot="form-control"
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
    const messageId = error || hint ? `${id}-message` : undefined;
    const describedBy = [inputProps["aria-describedby"], messageId].filter(Boolean).join(" ") || undefined;

    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        error={error}
        hint={hint}
        messageId={messageId}
      >
        <Input ref={ref} id={id} invalid={!!error} {...inputProps} aria-describedby={describedBy} />
      </FormField>
    );
  }
);
TextField.displayName = "TextField";

export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  className = "",
  ...props
}, ref) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      ref={ref}
      data-slot="form-section"
      className={`${styles.section} ${className}`.trim()}
      {...props}
    >
      <div
        className={`${styles.sectionHeader} ${collapsible ? styles.sectionHeaderClickable : ""}`}
        onClick={() => collapsible && setOpen((o) => !o)}
      >
        <div>
          <h3 className={styles.sectionTitle}>{title}</h3>
          {description && <p className={styles.sectionDesc}>{description}</p>}
        </div>
        {collapsible && (
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            aria-hidden="true"
          />
        )}
      </div>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
});
FormSection.displayName = "FormSection";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export interface AutosaveIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status: AutosaveStatus;
  className?: string;
}

export const AutosaveIndicator: FC<AutosaveIndicatorProps> = ({
  status,
  className = "",
  ...props
}) => {
  if (status === "idle") return null;

  const config = {
    saving: { label: "Saving changes...", color: "var(--color-text-secondary, var(--color-text-muted))" },
    saved: { label: "All changes saved", color: "var(--color-text-success, var(--color-success))" },
    error: { label: "Failed to save", color: "var(--color-text-danger, var(--color-danger))" },
  }[status];

  return (
    <span
      data-slot="autosave-indicator"
      className={`${styles.autosave} ${className}`.trim()}
      style={{ color: config.color }}
      aria-live="polite"
      {...props}
    >
      {config.label}
    </span>
  );
};
