import { forwardRef, useId, type InputHTMLAttributes, type ChangeEvent } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./slider.module.css";

export const sliderVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"],
      compact: styles.compact,
      standard: styles.standard,
      comfortable: styles.comfortable,
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

/**
 * @maturity stable
 * @since 1.0.0
 * Strata V1 Slider primitive — accessible continuous or discrete numerical range input
 * with 4-tier density scaling, tabular numeric indicators, and custom value formatting.
 * Standardized with cva, data-slot, and W3C APG slider pattern.
 */
export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">,
    VariantProps<typeof sliderVariants> {
  id?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  valueFormatter?: (val: number) => string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  "aria-label"?: string;
  className?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      id,
      value = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      disabled = false,
      showValue = false,
      valueFormatter,
      density = "standard",
      "aria-label": ariaLabel = "Slider control",
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    const formattedValue = valueFormatter ? valueFormatter(value) : value;
    const containerClasses = `${sliderVariants({ density, disabled })} ${className}`.trim();

    return (
      <div
        data-slot="slider"
        data-density={density}
        data-disabled={disabled ? "true" : undefined}
        className={containerClasses}
      >
        <input
          ref={ref}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onChange={handleChange}
          data-slot="slider-input"
          className={styles.rangeInput}
          {...props}
        />
        {showValue && (
          <span data-slot="slider-value" className={styles.valueDisplay} aria-hidden="true">
            {formattedValue}
          </span>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";
