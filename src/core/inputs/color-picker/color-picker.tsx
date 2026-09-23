"use client";

import { useState, useRef, useEffect, useId, forwardRef, useImperativeHandle, type ChangeEvent } from "react";
import { Check, Palette } from "lucide-react";
import { cn } from "../../utils/cn";
import { DEFAULT_COLOR_PRESETS } from "../../tokens/color-presets";
import styles from "./color-picker.module.css";

export type ColorPickerDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface ColorPickerProps {
  value: string; // Hex color string, e.g. "#0e6b75"
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
  showContrastPreview?: boolean;
  contrastBackgroundHex?: string; // Resolved background hex, e.g. "#ffffff"
  disabled?: boolean;
  density?: ColorPickerDensity;
  id?: string;
  required?: boolean;
  invalid?: boolean;
  error?: string;
  "aria-describedby"?: string;
  className?: string;
}

export function isValidHex(hex?: string): boolean {
  if (!hex || typeof hex !== "string") return false;
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex.trim());
}

export function getLuminance(hex: string): number {
  if (!isValidHex(hex)) return 0.5;
  const clean = hex.trim().replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.substring(0, 2), 16) / 255;
  const g = parseInt(full.substring(2, 4), 16) / 255;
  const b = parseInt(full.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  const [rNorm = 0, gNorm = 0, bNorm = 0] = a;
  return rNorm * 0.2126 + gNorm * 0.7152 + bNorm * 0.0722;
}

export function getContrastRatio(hex: string, backgroundHex = "#ffffff"): number {
  const l1 = getLuminance(hex);
  const l2 = getLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(1));
}

/**
 * ColorPicker component supporting preset swatches, native HTML color picker, hex text input,
 * 4-tier density scaling, and live WCAG AA/AAA contrast ratio validation against resolved background.
 *
 * @maturity stable
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(({
  value,
  onChange,
  label,
  presetColors = DEFAULT_COLOR_PRESETS,
  showContrastPreview = true,
  contrastBackgroundHex = "#ffffff",
  disabled = false,
  density = "standard",
  id: customId,
  required = false,
  invalid = false,
  error,
  "aria-describedby": ariaDescribedBy,
  className,
}, ref) => {
  const generatedId = useId();
  const pickerId = customId || `color-picker-${generatedId}`;
  const btnId = `${pickerId}-btn`;
  const errorId = error ? `${pickerId}-error` : undefined;
  const hexInputId = `${pickerId}-hex`;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [draftHex, setDraftHex] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  useEffect(() => {
    setDraftHex(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#") && raw.length > 0) {
      raw = "#" + raw;
    }
    setDraftHex(raw);
    if (isValidHex(raw)) {
      onChange(raw);
    }
  };

  const resolvedBgHex = isValidHex(contrastBackgroundHex) ? contrastBackgroundHex : "#ffffff";
  const contrastRatio = isValidHex(draftHex) ? getContrastRatio(draftHex, resolvedBgHex) : 1;
  const isAA = contrastRatio >= 4.5;
  const isAAA = contrastRatio >= 7.0;

  return (
    <div
      ref={containerRef}
      className={cn(styles.wrapper, disabled && styles.disabled, className)}
      data-density={density}
    >
      {label && (
        <label className={styles.label} htmlFor={btnId}>
          {label}
          {required && <span className={styles.requiredIndicator} aria-hidden="true"> *</span>}
        </label>
      )}

      <button
        id={btnId}
        type="button"
        className={cn(styles.triggerButton, (invalid || error) && styles.invalid)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-invalid={invalid || Boolean(error) ? "true" : undefined}
        aria-describedby={combinedAriaDescribedBy}
        aria-label={label ? `${label}: ${value}` : `Choose color: ${value}`}
      >
        <span
          className={styles.colorSwatch}
          style={{ backgroundColor: isValidHex(value) ? value : "transparent" }}
          aria-hidden="true"
        />
        <span className={styles.hexCode}>{value}</span>
        <Palette size={14} className={styles.paletteIcon} aria-hidden="true" />
      </button>

      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}

      {isOpen && (
        <div role="dialog" aria-label="Color selection panel" className={styles.popover}>
          <div className={styles.presetsGrid}>
            {presetColors.map((color) => {
              const isSelected = color.toLowerCase() === value.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  className={cn(styles.presetBtn, isSelected && styles.presetSelected)}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setDraftHex(color);
                  }}
                  aria-label={`Select color ${color}`}
                >
                  {isSelected && <Check size={12} className={styles.checkIcon} />}
                </button>
              );
            })}
          </div>

          <div className={styles.inputSection}>
            <label className={styles.inputLabel} htmlFor={hexInputId}>
              Hex
            </label>
            <input
              id={hexInputId}
              type="text"
              className={styles.hexInput}
              value={draftHex}
              maxLength={7}
              onChange={handleHexInputChange}
              aria-label="Hex color value"
            />
            <input
              type="color"
              className={styles.nativePicker}
              value={isValidHex(value) ? value : (DEFAULT_COLOR_PRESETS[0] ?? "#000000")}
              onChange={(e) => {
                onChange(e.target.value);
                setDraftHex(e.target.value);
              }}
              aria-label="Native color palette selector"
            />
          </div>

          {showContrastPreview && isValidHex(draftHex) && (
            <div className={styles.contrastSection}>
              <span className={styles.contrastTitle}>WCAG Contrast:</span>
              <span className={styles.contrastValue} data-testid="contrast-ratio">{contrastRatio}:1</span>
              <span
                data-testid="contrast-badge"
                className={cn(
                  styles.badge,
                  isAAA ? styles.badgeAAA : isAA ? styles.badgeAA : styles.badgeFail,
                )}
              >
                {isAAA ? "AAA" : isAA ? "AA" : "Fail"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ColorPicker.displayName = "ColorPicker";
