import {
  forwardRef,
  type InputHTMLAttributes,
  type ChangeEvent,
  type ReactNode,
  useState,
  useEffect,
  useId,
} from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./number-field.module.css";

export const numberFieldVariants = cva(styles.input, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"],
      compact: styles.compact,
      standard: styles.standard,
      comfortable: styles.comfortable,
    },
    invalid: {
      true: styles.invalid,
      false: "",
    },
  },
  defaultVariants: {
    density: "standard",
    invalid: false,
  },
});

/**
 * @maturity stable
 * @since 1.0.0
 * Strata V1 NumberInput primitive — high-precision numerical field with tabular-nums
 * alignment, 4-tier density scaling, automatic min/max clamping, and prefix/suffix slotting.
 * Standardized with cva, data-slot, and W3C APG spinbutton/textbox pattern.
 */
export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "prefix">,
    VariantProps<typeof numberFieldVariants> {
  id?: string;
  value?: number | string;
  onChange?: (val: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  invalid?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  "aria-label"?: string;
  className?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      id,
      value,
      onChange,
      min,
      max,
      step = 1,
      disabled = false,
      readOnly = false,
      placeholder,
      invalid = false,
      prefix,
      suffix,
      density = "standard",
      "aria-label": ariaLabel = "Number input",
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [displayVal, setDisplayVal] = useState<string>(
      value !== undefined && value !== null && value !== "" ? String(value) : ""
    );

    useEffect(() => {
      if (value !== undefined && value !== null && value !== "") {
        setDisplayVal(String(value));
      } else {
        setDisplayVal("");
      }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      const raw = e.target.value;
      setDisplayVal(raw);

      if (raw === "") {
        onChange?.(undefined);
        return;
      }

      const num = parseFloat(raw);
      if (!isNaN(num)) {
        onChange?.(num);
      }
    };

    const handleBlur = () => {
      if (displayVal !== "" && !readOnly) {
        const num = parseFloat(displayVal);
        if (!isNaN(num)) {
          const clamped = min !== undefined && num < min ? min : max !== undefined && num > max ? max : num;
          setDisplayVal(String(clamped));
          onChange?.(clamped);
        }
      }
    };

    const inputClasses = `${numberFieldVariants({ density, invalid })} ${className}`.trim();

    if (prefix || suffix) {
      return (
        <div
          data-slot="number-field"
          data-density={density}
          data-disabled={disabled ? "true" : undefined}
          data-invalid={invalid ? "true" : undefined}
          className={[styles.wrapper, density ? styles[density] : "", disabled ? styles.wrapperDisabled : ""].filter(Boolean).join(" ")}
        >
          {prefix && <span data-slot="number-field-prefix" className={styles.prefixSlot}>{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            type="number"
            step={step}
            min={min}
            max={max}
            value={displayVal}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-invalid={invalid ? "true" : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            data-slot="number-field-input"
            className={inputClasses}
            {...props}
          />
          {suffix && <span data-slot="number-field-suffix" className={styles.suffixSlot}>{suffix}</span>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        id={inputId}
        type="number"
        step={step}
        min={min}
        max={max}
        value={displayVal}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid ? "true" : undefined}
        data-slot="number-field"
        data-density={density}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid ? "true" : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputClasses}
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

/**
 * `<NumberField>` — Canonical PascalCase alias for NumberInput.
 */
export const NumberField = NumberInput;
