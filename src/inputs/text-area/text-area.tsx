import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./text-area.module.css";

export const textareaVariants = cva(styles.textarea, {
  variants: {
    textareaSize: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    resize: {
      none: styles.resize_none,
      vertical: styles.resize_vertical,
      horizontal: styles.resize_horizontal,
      both: styles.resize_both,
    },
    fullWidth: {
      true: styles.fullWidth,
      false: "",
    },
    error: {
      true: styles.error,
      false: "",
    },
  },
  defaultVariants: {
    textareaSize: "md",
    resize: "vertical",
    fullWidth: false,
    error: false,
  },
});

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Size variant aligned with control density */
  textareaSize?: "sm" | "md" | "lg";
  /** Visual error state or error message flag */
  error?: boolean;
  /** Resize behavior control */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Full width container stretching */
  fullWidth?: boolean;
}

/**
 * `<Textarea>` — Multiline text input primitive adhering to Strata DL 3.0.
 *
 * Provides density-aware typography, configurable resize direction,
 * focus rings, and disabled/error styling.
 * Standardized with cva, data-slot, and W3C APG multiline textbox pattern.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      textareaSize = "md",
      error = false,
      resize = "vertical",
      fullWidth = false,
      disabled = false,
      rows = 3,
      className = "",
      ...props
    },
    ref
  ) => {
    const rootClasses = `${textareaVariants({ textareaSize, resize, fullWidth, error })} ${className}`.trim();

    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        data-slot="textarea"
        data-size={textareaSize}
        data-error={error ? "true" : undefined}
        data-resize={resize}
        className={rootClasses}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

/**
 * `<TextArea>` — Canonical PascalCase alias for Textarea.
 */
export const TextArea = Textarea;
