"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ChevronDown, Check, X, Search, Loader2 } from "lucide-react";
import styles from "./combobox.module.css";

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  group?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

/**
 * @maturity stable
 * @since 1.0.0
 * Strata V1 ComboBox — enterprise searchable selection control with W3C APG 1.2
 * combobox semantics, 4-tier density scaling, single/multi-selection tag pills,
 * clear action, keyboard velocity, and accessible states.
 */
export interface ComboBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  id?: string;
  options: ComboBoxOption[];
  value?: string | string[];
  onChange?: (value: string | string[] | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  loading?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

export const ComboBox = forwardRef<HTMLDivElement, ComboBoxProps>(
  (
    {
      id: customId,
      options,
      value,
      onChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search options...",
      disabled = false,
      readOnly = false,
      invalid = false,
      loading = false,
      multiple = false,
      clearable = true,
      density,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || `combobox-${generatedId}`;
    const listboxId = `${id}-listbox`;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLDivElement>(null);

    // Close on outside click
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

    // Focus search on open; reset on close
    useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      if (isOpen) {
        timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 30);
      } else {
        setSearch("");
        setHighlightedIndex(0);
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [isOpen]);

    const selectedValues = Array.isArray(value)
      ? value
      : typeof value === "string" && value.length > 0
        ? [value]
        : [];

    const selectedOptions = options.filter((opt) =>
      selectedValues.includes(opt.value)
    );

    const filteredOptions = options.filter((opt) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
      );
    });

    // Ensure highlighted index remains in bounds when filtering
    useEffect(() => {
      if (highlightedIndex >= filteredOptions.length) {
        setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
      }
    }, [filteredOptions.length, highlightedIndex]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (isOpen && optionsListRef.current) {
        const highlightedEl = optionsListRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedEl && typeof highlightedEl.scrollIntoView === "function") {
          highlightedEl.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex, isOpen]);

    const handleToggle = () => {
      if (disabled || readOnly) return;
      setIsOpen((prev) => !prev);
    };

    const handleSelect = (optionValue: string) => {
      if (disabled || readOnly) return;
      if (multiple) {
        const nextValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(nextValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleRemoveTag = (e: ReactMouseEvent | KeyboardEvent, optionValue: string) => {
      e.stopPropagation();
      if (disabled || readOnly) return;
      const nextValues = selectedValues.filter((v) => v !== optionValue);
      onChange?.(nextValues);
    };

    const handleClear = (e: ReactMouseEvent | KeyboardEvent) => {
      e.stopPropagation();
      if (disabled || readOnly) return;
      onChange?.(multiple ? [] : null);
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const handleTriggerKeyDown = (e: KeyboardEvent) => {
      if (disabled || readOnly) return;

      if (!isOpen) {
        if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " " || e.key === "ArrowUp") {
          e.preventDefault();
          setIsOpen(true);
        } else if (e.key === "Backspace" && multiple && selectedValues.length > 0) {
          e.preventDefault();
          const next = selectedValues.slice(0, -1);
          onChange?.(next);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleDropdownKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredOptions.length === 0) {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        } else if (e.key === "Backspace" && search === "" && multiple && selectedValues.length > 0) {
          e.preventDefault();
          const next = selectedValues.slice(0, -1);
          onChange?.(next);
        }
        return;
      }

      switch (e.key) {
        case "Backspace":
          if (search === "" && multiple && selectedValues.length > 0) {
            e.preventDefault();
            const next = selectedValues.slice(0, -1);
            onChange?.(next);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Home":
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
        case "PageDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(filteredOptions.length - 1, prev + 5)
          );
          break;
        case "PageUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(0, prev - 5));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex]?.disabled) {
            handleSelect(filteredOptions[highlightedIndex]!.value);
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

    const densityClass = density ? styles[density] : "";
    const activeOptionId =
      isOpen && filteredOptions[highlightedIndex]
        ? `${id}-opt-${highlightedIndex}`
        : undefined;

    return (
      <div
        ref={(node) => {
          (containerRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={[
          styles.container,
          densityClass,
          disabled ? styles.disabled : "",
          readOnly ? styles.readOnly : "",
          invalid ? styles.invalid : "",
          isOpen ? styles.open : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-density={density}
        {...props}
      >
        <div
          ref={triggerRef}
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-label={ariaLabel || placeholder || "Select option"}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid ? "true" : undefined}
          aria-busy={loading ? "true" : undefined}
          aria-disabled={disabled ? "true" : undefined}
          aria-readonly={readOnly ? "true" : undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
          className={styles.trigger}
        >
          <div className={styles.valueContainer}>
            {selectedOptions.length === 0 ? (
              <span className={styles.placeholder}>{placeholder}</span>
            ) : multiple ? (
              <div className={styles.multiTags}>
                {selectedOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <span key={opt.value} className={styles.tag}>
                      {Icon && <Icon size={12} className={styles.tagIcon} />}
                      <span className={styles.tagLabel}>{opt.label}</span>
                      {!disabled && !readOnly && (
                        <button
                          type="button"
                          className={styles.tagRemoveBtn}
                          onClick={(e) => handleRemoveTag(e, opt.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRemoveTag(e, opt.value);
                            }
                          }}
                          aria-label={`Remove ${opt.label}`}
                          tabIndex={0}
                        >
                          <X size={10} aria-hidden="true" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className={styles.singleValue}>
                {selectedOptions[0]?.icon && (
                  <span className={styles.singleIcon}>
                    {(() => {
                      const Icon = selectedOptions[0]!.icon!;
                      return <Icon size={14} />;
                    })()}
                  </span>
                )}
                {selectedOptions[0]?.label}
              </span>
            )}
          </div>

          <div className={styles.actions}>
            {loading ? (
              <Loader2 size={14} className={styles.spinner} aria-label="Loading options" />
            ) : (
              <>
                {clearable && selectedOptions.length > 0 && !disabled && !readOnly && (
                  <button
                    type="button"
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClear(e);
                      }
                    }}
                    aria-label="Clear selection"
                    className={styles.clearBtn}
                    tabIndex={0}
                  >
                    <X size={13} aria-hidden="true" />
                  </button>
                )}
                <ChevronDown
                  size={15}
                  className={[styles.arrow, isOpen ? styles.arrowOpen : ""].filter(Boolean).join(" ")}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </div>

        {isOpen && (
          <div
            className={styles.dropdown}
            onKeyDown={handleDropdownKeyDown}
          >
            <div className={styles.searchWrapper}>
              <Search size={14} className={styles.searchIcon} aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                role="searchbox"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={activeOptionId}
                className={styles.searchInput}
                onClick={(e) => e.stopPropagation()}
              />
              {search.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search query"
                  className={styles.searchClearBtn}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              ref={optionsListRef}
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel || placeholder || "Options"}
              aria-multiselectable={multiple}
              className={styles.optionsList}
            >
              {filteredOptions.length === 0 ? (
                <div className={styles.noOptions} role="status">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = selectedValues.includes(opt.value);
                  const isHighlighted = idx === highlightedIndex;
                  const Icon = opt.icon;

                  return (
                    <div
                      key={opt.value}
                      id={`${id}-opt-${idx}`}
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
                      <div className={styles.optionContent}>
                        {Icon && <Icon size={14} className={styles.optionIcon} />}
                        <div className={styles.optionTextContainer}>
                          <span className={styles.optionLabel}>{opt.label}</span>
                          {opt.description && (
                            <span className={styles.optionDescription}>
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>
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
  }
);

ComboBox.displayName = "ComboBox";
