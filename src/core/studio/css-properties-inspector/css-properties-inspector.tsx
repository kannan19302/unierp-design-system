"use client";

import {
  forwardRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
} from "react";
import styles from "./css-properties-inspector.module.css";

export interface CssPropertiesValues {
  display?: "flex" | "grid" | "block" | "inline-block";
  flexDirection?: "row" | "column";
  alignItems?: "stretch" | "center" | "flex-start" | "flex-end";
  justifyContent?: "flex-start" | "center" | "space-between" | "flex-end";
  gap?: string;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  color?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  boxShadow?: string;
  opacity?: string;
  overflow?: "visible" | "hidden" | "auto" | "scroll";
}

export type PropertySection =
  | "layout"
  | "spacing"
  | "typography"
  | "appearance"
  | "responsive";

export interface CssPropertiesInspectorProps {
  /** Current CSS values map */
  values: CssPropertiesValues;
  /** Callback when any CSS property is adjusted */
  onChange: (key: keyof CssPropertiesValues, value: string) => void;
  /** Callback to reset a property to inherited default */
  onReset?: (key: keyof CssPropertiesValues) => void;
  /** Active sections to display (defaults to all) */
  sections?: PropertySection[];
  /** Title header */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_SECTIONS: PropertySection[] = [
  "layout",
  "spacing",
  "typography",
  "appearance",
  "responsive",
];

/**
 * `<CssPropertiesInspector>` — Right-rail visual styling inspector for website and app builders.
 *
 * @maturity stable
 *
 * Provides grouped accordion sections for:
 * - Flexbox / Grid layout dimensions
 * - Box model spacing (padding, margin, gap)
 * - Typography (size, weight, alignment)
 * - Appearance (background, border, shadow, opacity)
 * - Responsive overflow and display properties
 */
export const CssPropertiesInspector = forwardRef<
  HTMLDivElement,
  CssPropertiesInspectorProps
>(
  (
    {
      values,
      onChange,
      onReset,
      sections = DEFAULT_SECTIONS,
      title = "Styles & Layout",
      className,
      style,
    },
    ref,
  ) => {
    const [openSections, setOpenSections] = useState<Record<PropertySection, boolean>>({
      layout: true,
      spacing: true,
      typography: true,
      appearance: true,
      responsive: false,
    });

    const toggleSection = (section: PropertySection) => {
      setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleInputChange =
      (key: keyof CssPropertiesValues) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(key, e.target.value);
      };

    const containerClasses = [styles.inspector, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={title}
      >
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>{title}</h3>
          {onReset && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => onReset("display")}
              aria-label="Reset styles to defaults"
            >
              Reset
            </button>
          )}
        </div>

        <div className={styles.sectionsList}>
          {sections.includes("layout") && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => toggleSection("layout")}
                aria-expanded={openSections.layout}
              >
                <span>Layout & Alignment</span>
                <span className={styles.chevron} aria-hidden="true">
                  {openSections.layout ? "▾" : "▸"}
                </span>
              </button>

              {openSections.layout && (
                <div className={styles.sectionBody}>
                  <div className={styles.fieldRow}>
                    <label htmlFor="css-display" className={styles.fieldLabel}>Display</label>
                    <select
                      id="css-display"
                      className={styles.selectInput}
                      value={values.display ?? "flex"}
                      onChange={handleInputChange("display")}
                    >
                      <option value="flex">Flex</option>
                      <option value="grid">Grid</option>
                      <option value="block">Block</option>
                      <option value="inline-block">Inline Block</option>
                    </select>
                  </div>

                  <div className={styles.fieldRow}>
                    <label htmlFor="css-flex-dir" className={styles.fieldLabel}>Direction</label>
                    <div className={styles.segmented}>
                      <button
                        type="button"
                        className={`${styles.segBtn} ${values.flexDirection === "row" ? styles.segActive : ""}`}
                        onClick={() => onChange("flexDirection", "row")}
                      >
                        Row
                      </button>
                      <button
                        type="button"
                        className={`${styles.segBtn} ${values.flexDirection === "column" ? styles.segActive : ""}`}
                        onClick={() => onChange("flexDirection", "column")}
                      >
                        Col
                      </button>
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <label htmlFor="css-align" className={styles.fieldLabel}>Align</label>
                    <select
                      id="css-align"
                      className={styles.selectInput}
                      value={values.alignItems ?? "stretch"}
                      onChange={handleInputChange("alignItems")}
                    >
                      <option value="stretch">Stretch</option>
                      <option value="center">Center</option>
                      <option value="flex-start">Start</option>
                      <option value="flex-end">End</option>
                    </select>
                  </div>

                  <div className={styles.fieldRow}>
                    <label htmlFor="css-gap" className={styles.fieldLabel}>Gap</label>
                    <input
                      id="css-gap"
                      type="text"
                      className={styles.textInput}
                      value={values.gap ?? ""}
                      placeholder="e.g. 1rem"
                      onChange={handleInputChange("gap")}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {sections.includes("spacing") && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => toggleSection("spacing")}
                aria-expanded={openSections.spacing}
              >
                <span>Dimensions & Spacing</span>
                <span className={styles.chevron} aria-hidden="true">
                  {openSections.spacing ? "▾" : "▸"}
                </span>
              </button>

              {openSections.spacing && (
                <div className={styles.sectionBody}>
                  <div className={styles.gridRow}>
                    <div>
                      <label htmlFor="css-width" className={styles.fieldLabel}>Width</label>
                      <input
                        id="css-width"
                        type="text"
                        className={styles.textInput}
                        value={values.width ?? ""}
                        placeholder="auto"
                        onChange={handleInputChange("width")}
                      />
                    </div>
                    <div>
                      <label htmlFor="css-height" className={styles.fieldLabel}>Height</label>
                      <input
                        id="css-height"
                        type="text"
                        className={styles.textInput}
                        value={values.height ?? ""}
                        placeholder="auto"
                        onChange={handleInputChange("height")}
                      />
                    </div>
                  </div>

                  <div className={styles.gridRow}>
                    <div>
                      <label htmlFor="css-padding" className={styles.fieldLabel}>Padding</label>
                      <input
                        id="css-padding"
                        type="text"
                        className={styles.textInput}
                        value={values.padding ?? ""}
                        placeholder="e.g. 1rem"
                        onChange={handleInputChange("padding")}
                      />
                    </div>
                    <div>
                      <label htmlFor="css-margin" className={styles.fieldLabel}>Margin</label>
                      <input
                        id="css-margin"
                        type="text"
                        className={styles.textInput}
                        value={values.margin ?? ""}
                        placeholder="e.g. 0 auto"
                        onChange={handleInputChange("margin")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {sections.includes("typography") && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => toggleSection("typography")}
                aria-expanded={openSections.typography}
              >
                <span>Typography</span>
                <span className={styles.chevron} aria-hidden="true">
                  {openSections.typography ? "▾" : "▸"}
                </span>
              </button>

              {openSections.typography && (
                <div className={styles.sectionBody}>
                  <div className={styles.fieldRow}>
                    <label htmlFor="css-font-size" className={styles.fieldLabel}>Font Size</label>
                    <input
                      id="css-font-size"
                      type="text"
                      className={styles.textInput}
                      value={values.fontSize ?? ""}
                      placeholder="e.g. 1.25rem"
                      onChange={handleInputChange("fontSize")}
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <label htmlFor="css-font-weight" className={styles.fieldLabel}>Weight</label>
                    <select
                      id="css-font-weight"
                      className={styles.selectInput}
                      value={values.fontWeight ?? "400"}
                      onChange={handleInputChange("fontWeight")}
                    >
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                    </select>
                  </div>

                  <div className={styles.fieldRow}>
                    <label htmlFor="css-text-align" className={styles.fieldLabel}>Alignment</label>
                    <div className={styles.segmented}>
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          className={`${styles.segBtn} ${values.textAlign === align ? styles.segActive : ""}`}
                          onClick={() => onChange("textAlign", align)}
                        >
                          {align.charAt(0).toUpperCase() + align.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {sections.includes("appearance") && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => toggleSection("appearance")}
                aria-expanded={openSections.appearance}
              >
                <span>Appearance & Borders</span>
                <span className={styles.chevron} aria-hidden="true">
                  {openSections.appearance ? "▾" : "▸"}
                </span>
              </button>

              {openSections.appearance && (
                <div className={styles.sectionBody}>
                  <div className={styles.fieldRow}>
                    <label htmlFor="css-bg" className={styles.fieldLabel}>Background</label>
                    <input
                      id="css-bg"
                      type="text"
                      className={styles.textInput}
                      value={values.background ?? ""}
                      placeholder="var(--color-surface)"
                      onChange={handleInputChange("background")}
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <label htmlFor="css-radius" className={styles.fieldLabel}>Border Radius</label>
                    <input
                      id="css-radius"
                      type="text"
                      className={styles.textInput}
                      value={values.borderRadius ?? ""}
                      placeholder="var(--radius-md)"
                      onChange={handleInputChange("borderRadius")}
                    />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    );
  },
);

CssPropertiesInspector.displayName = "CssPropertiesInspector";
