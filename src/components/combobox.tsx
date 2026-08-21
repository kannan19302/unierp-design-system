"use client";

import {
  useState,
  useRef,
  useEffect,
  type FC,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Check, X } from "lucide-react";
import styles from "./combobox.module.css";

export interface ComboBoxOption {
  value: string;
  label: string;
}

export interface ComboBoxProps {
  /** Array of selectable option items */
  options: ComboBoxOption[];
  /** Current selected value (string or array of strings for multiple) */
  value?: string | string[];
  /** Callback fired when selection changes */
  onChange?: (value: string | string[] | null) => void;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Disable interaction */
  disabled?: boolean;
  /** Allow selection of multiple items */
  multiple?: boolean;
  /** Additional wrapper CSS class */
  className?: string;
}

export const ComboBox: FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  multiple = false,
  className = "",
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
      setHighlightedIndex(0);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string"
      ? [value]
      : [];

  const selectedOptions = options.filter((opt: any) =>
    selectedValues.includes(opt.value),
  );

  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: ComboBoxOption) => {
    if (multiple) {
      const isAlreadySelected = selectedValues.includes(option.value);
      const nextValue = isAlreadySelected
        ? selectedValues.filter((v: any) => v !== option.value)
        : [...selectedValues, option.value];
      onChange?.(nextValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    if (disabled) return;
    const nextValue = selectedValues.filter((v: any) => v !== val);
    onChange?.(nextValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev: any) =>
          filteredOptions.length === 0
            ? 0
            : (prev + 1) % filteredOptions.length,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev: any) =>
          filteredOptions.length === 0
            ? 0
            : (prev - 1 + filteredOptions.length) % filteredOptions.length,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]!);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`${styles.container} ${className}`}
    >
      <div
        className={`${styles.trigger} ${disabled ? styles.triggerDisabled : ""}`}
      >
        <div className={styles.triggerContent}>
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : multiple ? (
            selectedOptions.map((opt: any) => (
              <span key={opt.value} className={styles.tag}>
                {opt.label}
                <button
                  type="button"
                  onClick={(e: any) => handleRemoveTag(e, opt.value)}
                  className={styles.tagRemoveBtn}
                  aria-label={`Remove ${opt.label}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))
          ) : null}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={styles.toggleButton}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={
            multiple
              ? `${placeholder}; ${selectedOptions.length} selected`
              : selectedOptions[0]?.label ?? placeholder
          }
        >
          {!multiple && selectedOptions.length > 0 && (
            <span>{selectedOptions[0]?.label}</span>
          )}
          <ChevronDown size={16} className={styles.chevron} />
        </button>
      </div>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.searchContainer}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Filter options"
            />
          </div>

          <div className={styles.list} role="listbox">
            {filteredOptions.length === 0 ? (
              <div className={styles.noResults}>No options found</div>
            ) : (
              filteredOptions.map((option: any, index: any) => {
                const isSelected = selectedValues.includes(option.value);
                const isHighlighted = index === highlightedIndex;
                const optionClasses = [
                  styles.option,
                  isHighlighted ? styles.optionHighlighted : "",
                  isSelected ? styles.optionSelected : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    className={optionClasses}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={14} />}
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
