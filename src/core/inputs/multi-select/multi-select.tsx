"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
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
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  "aria-label"?: string;
  className?: string;
}

/**
 * MultiSelect component allowing users to select multiple options from a searchable or tag-based dropdown.
 * Supports full W3C APG keyboard navigation (Arrow keys, Home, End, Enter, Space, Escape) and focus restoration.
 *
 * @maturity stable
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(({
  id: customId,
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  disabled = false,
  invalid = false,
  required = false,
  label,
  error,
  density,
  "aria-label": ariaLabel,
  className = "",
}, ref) => {
  const generatedId = useId();
  const triggerId = customId || `multi-select-${generatedId}`;
  const listboxId = `${triggerId}-listbox`;
  const labelId = label ? `${triggerId}-label` : undefined;
  const errorId = error ? `${triggerId}-error` : undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNextEnabledIndex = (currentIndex: number, step: 1 | -1) => {
    const len = options.length;
    if (len === 0) return -1;
    let idx = currentIndex;
    for (let i = 0; i < len; i++) {
      idx = (idx + step + len) % len;
      if (!options[idx]?.disabled) return idx;
    }
    return -1;
  };

  const getFirstEnabledIndex = () => {
    return options.findIndex((opt) => !opt.disabled);
  };

  const getLastEnabledIndex = () => {
    for (let i = options.length - 1; i >= 0; i--) {
      if (!options[i]?.disabled) return i;
    }
    return -1;
  };

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeEl && typeof activeEl.scrollIntoView === "function") {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, isOpen]);

  const toggleOption = (val: string) => {
    if (disabled) return;
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (e: ReactMouseEvent, val: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(getFirstEnabledIndex());
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => getNextEnabledIndex(prev, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => getNextEnabledIndex(prev, -1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(getFirstEnabledIndex());
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(getLastEnabledIndex());
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex] && !options[activeIndex]?.disabled) {
          toggleOption(options[activeIndex]!.value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const triggerClass = [
    styles.trigger,
    density ? styles[density] : "",
    invalid || !!error ? styles.invalid : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const activeOptionId =
    isOpen && activeIndex >= 0 && options[activeIndex]
      ? `${triggerId}-opt-${activeIndex}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`${styles.rootContainer} ${className}`.trim()}
      data-density={density}
    >
      {label && (
        <label id={labelId} htmlFor={triggerId} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={styles.container}>
        <div
          ref={triggerRef}
          id={triggerId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-invalid={invalid || !!error || undefined}
          aria-describedby={errorId}
          aria-labelledby={labelId}
          aria-label={label ? undefined : (ariaLabel || placeholder || "Multi select")}
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (disabled) return;
            setIsOpen((prev) => {
              const next = !prev;
              if (next) setActiveIndex(getFirstEnabledIndex());
              return next;
            });
          }}
          onKeyDown={handleKeyDown}
          className={triggerClass}
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
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-label={label || ariaLabel || "Options"}
            className={styles.dropdown}
          >
            {options.map((opt, idx) => {
              const isSelected = value.includes(opt.value);
              const isFocused = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  id={`${triggerId}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onClick={() => {
                    if (!opt.disabled) {
                      toggleOption(opt.value);
                      setActiveIndex(idx);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!opt.disabled) setActiveIndex(idx);
                  }}
                  className={`${styles.option} ${isSelected ? styles.selectedOption : ""} ${
                    opt.disabled ? styles.disabledOption : ""
                  } ${isFocused ? styles.optionFocused : ""}`}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {isSelected && <Check size={14} className={styles.checkIcon} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";
