"use client";

import {
  useState,
  useRef,
  useEffect,
  type FC,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ChevronDown, Check, X } from "lucide-react";
import styles from "./combobox.module.css";

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  id?: string;
  options: ComboBoxOption[];
  value?: string | string[];
  onChange?: (value: string | string[] | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  "aria-label"?: string;
  className?: string;
}

export const ComboBox: FC<ComboBoxProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  multiple = false,
  "aria-label": ariaLabel,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  const selectedValues = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const nextValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(nextValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]!.value);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}
      onKeyDown={handleKeyDown}
    >
      <div
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel || placeholder || "Select option"}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        className={styles.trigger}
      >
        <div className={styles.valueContainer}>
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : multiple ? (
            <div className={styles.multiTags}>
              {selectedOptions.map((opt) => (
                <span key={opt.value} className={styles.tag}>
                  {opt.label}
                </span>
              ))}
            </div>
          ) : (
            <span className={styles.singleValue}>
              {selectedOptions[0]?.label}
            </span>
          )}
        </div>

        <div className={styles.actions}>
          {selectedOptions.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className={styles.clearBtn}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.searchWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className={styles.searchInput}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className={styles.optionsList}>
            {filteredOptions.length === 0 ? (
              <div className={styles.noOptions}>No options found</div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = selectedValues.includes(opt.value);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={[
                      styles.option,
                      isSelected ? styles.optionSelected : "",
                      isHighlighted ? styles.optionHighlighted : "",
                      opt.disabled ? styles.optionDisabled : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className={styles.optionLabel}>{opt.label}</span>
                    {isSelected && (
                      <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
