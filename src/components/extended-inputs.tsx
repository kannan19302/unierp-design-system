"use client";

import { useState, type FC, type ReactNode, type ChangeEvent } from "react";

// ── Switch ────────────────────────────────────────────
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
}

export const Switch: FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id,
}) => {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = controlledChecked !== undefined ? controlledChecked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (onChange) onChange(next);
    else setInternal(next);
  };

  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontSize: "var(--text-sm)",
      }}
    >
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        }}
        style={{
          width: "36px",
          height: "20px",
          borderRadius: "var(--radius-full, 9999px)",
          background: checked ? "var(--color-primary)" : "var(--color-bg-sunken)",
          border: "1px solid var(--color-border)",
          position: "relative",
          transition: "background var(--duration-fast) var(--ease-default)",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#ffffff",
            position: "absolute",
            top: "1px",
            left: checked ? "17px" : "1px",
            boxShadow: "var(--shadow-sm)",
            transition: "left var(--duration-fast) var(--ease-default)",
          }}
        />
      </div>
      {label}
    </label>
  );
};

// ── Checkbox ──────────────────────────────────────────
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id,
}) => {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = controlledChecked !== undefined ? controlledChecked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (onChange) onChange(next);
    else setInternal(next);
  };

  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontSize: "var(--text-sm)",
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={toggle}
        style={{ width: "16px", height: "16px", cursor: disabled ? "not-allowed" : "pointer" }}
      />
      {label}
    </label>
  );
};

// ── RadioGroup ────────────────────────────────────────
export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

export const RadioGroup: FC<RadioGroupProps> = ({ options, value, onChange, name, disabled }) => {
  return (
    <div role="radiogroup" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            cursor: opt.disabled || disabled ? "not-allowed" : "pointer",
            opacity: opt.disabled || disabled ? 0.6 : 1,
            fontSize: "var(--text-sm)",
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled || disabled}
            onChange={() => onChange?.(opt.value)}
            style={{ width: "16px", height: "16px" }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

// ── Slider ────────────────────────────────────────────
export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
}

export const Slider: FC<SliderProps> = ({ value = 0, min = 0, max = 100, step = 1, onChange, disabled }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(Number(e.target.value))}
      style={{ width: "100%", cursor: disabled ? "not-allowed" : "pointer" }}
    />
  );
};

// ── NumberInput, CurrencyInput, PercentInput ──────────
export interface NumericInputProps {
  value?: number;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
}

export const NumberInput: FC<NumericInputProps> = ({ value, onChange, min, max, step = 1, disabled, placeholder }) => {
  return (
    <input
      type="number"
      value={value !== undefined ? value : ""}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange?.(Number(e.target.value))}
      style={{
        padding: "var(--space-2) var(--space-3)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg)",
        fontSize: "var(--text-sm)",
        color: "var(--color-text)",
      }}
    />
  );
};

export interface CurrencyInputProps extends NumericInputProps {
  currencySymbol?: string;
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  value,
  onChange,
  currencySymbol = "$",
  disabled,
  placeholder,
}) => {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span
        style={{
          position: "absolute",
          left: "var(--space-3)",
          color: "var(--color-text-muted)",
          fontSize: "var(--text-sm)",
        }}
      >
        {currencySymbol}
      </span>
      <input
        type="number"
        step="0.01"
        value={value !== undefined ? value : ""}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          const val = Math.round(Number(e.target.value) * 100) / 100;
          onChange?.(val);
        }}
        style={{
          paddingLeft: "var(--space-7)",
          paddingRight: "var(--space-3)",
          paddingTop: "var(--space-2)",
          paddingBottom: "var(--space-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text)",
        }}
      />
    </div>
  );
};

export const PercentInput: FC<NumericInputProps> = ({ value, onChange, disabled, placeholder }) => {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <input
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={value !== undefined ? value : ""}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{
          paddingRight: "var(--space-7)",
          paddingLeft: "var(--space-3)",
          paddingTop: "var(--space-2)",
          paddingBottom: "var(--space-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text)",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: "var(--space-3)",
          color: "var(--color-text-muted)",
          fontSize: "var(--text-sm)",
        }}
      >
        %
      </span>
    </div>
  );
};

// ── MultiSelect & TagInput ────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: FC<MultiSelectProps> = ({ options, value, onChange, placeholder = "Select items..." }) => {
  const toggle = (val: string) => {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-1)",
        padding: "var(--space-1-5) var(--space-2)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg)",
        minHeight: "38px",
        alignItems: "center",
      }}
    >
      {value.map((v) => {
        const opt = options.find((o) => o.value === v);
        return (
          <span
            key={v}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              background: "var(--color-bg-sunken)",
              padding: "2px var(--space-2)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-xs)",
            }}
          >
            {opt?.label || v}
            <button
              onClick={() => toggle(v)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", padding: 0 }}
            >
              ×
            </button>
          </span>
        );
      })}
      <select
        value=""
        onChange={(e) => {
          if (e.target.value) toggle(e.target.value);
        }}
        style={{ border: "none", background: "none", outline: "none", fontSize: "var(--text-sm)", cursor: "pointer" }}
      >
        <option value="" disabled>
          {value.length === 0 ? placeholder : "+ Add..."}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={value.includes(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: FC<TagInputProps> = ({ tags, onChange, placeholder = "Type tag and press enter..." }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-1)",
        padding: "var(--space-1-5) var(--space-2)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg)",
        minHeight: "38px",
        alignItems: "center",
      }}
    >
      {tags.map((t) => (
        <span
          key={t}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-1)",
            background: "var(--color-primary-light, rgba(59, 130, 246, 0.1))",
            color: "var(--color-primary)",
            padding: "2px var(--space-2)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)",
          }}
        >
          {t}
          <button
            onClick={() => onChange(tags.filter((tag) => tag !== t))}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", padding: 0, color: "var(--color-primary)" }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        style={{ border: "none", background: "none", outline: "none", fontSize: "var(--text-sm)", flex: 1, minWidth: "120px" }}
      />
    </div>
  );
};
