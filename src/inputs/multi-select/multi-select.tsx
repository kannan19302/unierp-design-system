"use client";

import { useState, useRef, useEffect, type FC } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import styles from "./multi-select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  id?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export const MultiSelect: FC<MultiSelectProps> = ({
  id,
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  disabled = false,
  "aria-label": ariaLabel,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (disabled) return;
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}
    >
      <div
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel || placeholder || "Multi select"}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) setIsOpen((prev) => !prev);
          }
        }}
        className={styles.trigger}
      >
        <div className={styles.tagList}>
          {value.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span key={val} className={styles.tag}>
                  <span>{opt ? opt.label : val}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeValue(e, val)}
                      aria-label={`Remove ${opt ? opt.label : val}`}
                      className={styles.removeBtn}
                    >
                      <X size={10} aria-hidden="true" />
                    </button>
                  )}
                </span>
              );
            })
          )}
        </div>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.openChevron : ""}`} />
      </div>

      {isOpen && (
        <ul role="listbox" aria-multiselectable="true" className={styles.dropdown}>
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onClick={() => !opt.disabled && toggleOption(opt.value)}
                className={`${styles.option} ${isSelected ? styles.selectedOption : ""} ${
                  opt.disabled ? styles.disabledOption : ""
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className={styles.checkIcon} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
