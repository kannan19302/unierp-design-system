"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Check, Palette } from "lucide-react";
import { cn } from "../../utils/cn";
import { DEFAULT_COLOR_PRESETS } from "../../tokens/color-presets";
import styles from "./color-picker.module.css";

export interface ColorPickerProps {
  value: string; // Hex color string, e.g. "#0e6b75"
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
  showContrastPreview?: boolean;
  disabled?: boolean;
  className?: string;
}

function isValidHex(hex: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

function getLuminance(hex: string): number {
  if (!isValidHex(hex)) return 0.5;
  const clean = hex.replace("#", "");
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

function getContrastRatio(hex: string, backgroundHex = "#ffffff"): number {
  const l1 = getLuminance(hex);
  const l2 = getLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(1));
}

export function ColorPicker({
  value,
  onChange,
  label,
  presetColors = DEFAULT_COLOR_PRESETS,
  showContrastPreview = true,
  disabled = false,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftHex, setDraftHex] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

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
    let raw = e.target.value;
    if (!raw.startsWith("#") && raw.length > 0) {
      raw = "#" + raw;
    }
    setDraftHex(raw);
    if (isValidHex(raw)) {
      onChange(raw);
    }
  };

  const contrastWhite = getContrastRatio(draftHex, "var(--color-surface, #ffffff)");
  const isAA = contrastWhite >= 4.5;
  const isAAA = contrastWhite >= 7.0;

  return (
    <div ref={containerRef} className={cn(styles.wrapper, disabled && styles.disabled, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
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
            <label className={styles.inputLabel} htmlFor="color-picker-hex">
              Hex
            </label>
            <input
              id="color-picker-hex"
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
              value={isValidHex(value) ? value : (DEFAULT_COLOR_PRESETS[0] ?? "")}
              onChange={(e) => {
                onChange(e.target.value);
                setDraftHex(e.target.value);
              }}
              aria-label="Native color palette selector"
            />
          </div>

          {showContrastPreview && isValidHex(draftHex) && (
            <div className={styles.contrastSection}>
              <span className={styles.contrastTitle}>WCAG Contrast (on White):</span>
              <span className={styles.contrastValue}>{contrastWhite}:1</span>
              <span
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
}
