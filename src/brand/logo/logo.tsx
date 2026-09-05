import React from "react";
import styles from "./logo.module.css";

export type LogoVariant = "horizontal" | "stacked" | "glyph" | "wordmark";
export type LogoTheme = "light" | "dark" | "monochrome";
export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout lockup variant */
  variant?: LogoVariant;
  /** Color theme presentation */
  theme?: LogoTheme;
  /** Presets for responsive sizing */
  size?: LogoSize;
  /** Whether to render the 'ENTERPRISE SAAS BUSINESS PLATFORM' tagline badge */
  showTagline?: boolean;
  /** Accessible label for screen readers */
  "aria-label"?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "horizontal",
  theme = "light",
  size = "md",
  showTagline = true,
  className = "",
  "aria-label": ariaLabel = "UniERP — Enterprise SAAS Business Platform",
  ...props
}) => {
  const containerClasses = [
    styles.root,
    styles[`variant-${variant}`],
    styles[`theme-${theme}`],
    styles[`size-${size}`],
    className
  ]
    .filter(Boolean)
    .join(" ");

  // Color tokens based on theme
  const brandCobalt = theme === "monochrome" ? "currentColor" : "var(--color-brand, #0052cc)";
  const uStrokeColor = theme === "monochrome" ? "var(--color-bg, #ffffff)" : "#ffffff";
  const accentPrismColor = theme === "monochrome" ? "currentColor" : "var(--color-brand-cyan, #38bdf8)";
  const wordmarkColor = theme === "dark" ? "#ffffff" : theme === "monochrome" ? "currentColor" : "var(--color-text-primary, #0f172a)";
  const taglineTextColor = theme === "dark" ? "var(--color-brand-cyan, #38bdf8)" : theme === "monochrome" ? "currentColor" : "var(--color-brand, #0052cc)";

  const renderGlyph = (glyphSize: number) => (
    <svg
      className={styles.glyph}
      width={glyphSize}
      height={glyphSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="30" fill={brandCobalt} />
      <path
        d="M36 32V58C36 66.284 42.716 73 51 73C59.284 73 66 66.284 66 58V50"
        stroke={uStrokeColor}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="66" cy="33" r="8" fill={accentPrismColor} />
    </svg>
  );

  if (variant === "glyph") {
    return (
      <div
        className={containerClasses}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        {renderGlyph(36)}
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div
        className={containerClasses}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        <span className={styles.wordmark} style={{ color: wordmarkColor }}>
          UniERP
        </span>
        {showTagline && (
          <span className={styles.tagline} style={{ color: taglineTextColor }}>
            ENTERPRISE SAAS BUSINESS PLATFORM
          </span>
        )}
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div
        className={containerClasses}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        {renderGlyph(48)}
        <div className={styles.textStack}>
          <span className={styles.wordmark} style={{ color: wordmarkColor }}>
            UniERP
          </span>
          {showTagline && (
            <span className={styles.tagline} style={{ color: taglineTextColor }}>
              ENTERPRISE SAAS BUSINESS PLATFORM
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal lockup
  return (
    <div
      className={containerClasses}
      role="img"
      aria-label={ariaLabel}
      {...props}
    >
      {renderGlyph(36)}
      <div className={styles.horizontalStack}>
        <span className={styles.wordmark} style={{ color: wordmarkColor }}>
          UniERP
        </span>
        {showTagline && (
          <span className={styles.tagline} style={{ color: taglineTextColor }}>
            ENTERPRISE SAAS BUSINESS PLATFORM
          </span>
        )}
      </div>
    </div>
  );
};
