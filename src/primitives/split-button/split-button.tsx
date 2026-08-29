"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./split-button.module.css";

export interface SplitButtonItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  items: SplitButtonItem[];
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function SplitButton({
  label,
  onClick,
  items,
  icon,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(styles.container, styles[variant], styles[size], disabled && styles.disabled, className)}
    >
      <button
        type="button"
        className={cn(styles.mainButton)}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </button>

      <button
        type="button"
        className={cn(styles.toggleButton, isOpen && styles.toggleActive)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`More options for ${label}`}
      >
        <ChevronDown size={14} className={cn(styles.chevron, isOpen && styles.chevronOpen)} />
      </button>

      {isOpen && (
        <div role="menu" className={styles.menu}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cn(
                styles.menuItem,
                item.danger && styles.menuItemDanger,
                item.disabled && styles.menuItemDisabled,
              )}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
