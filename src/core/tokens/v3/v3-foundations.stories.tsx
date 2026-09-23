import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import styles from "./v3-foundations.module.css";

/* ══════════════════════════════════════════════════════════════
   Strata DL 3.0 — V3 Foundation Token Catalog
   ══════════════════════════════════════════════════════════════

   Visual catalog of every V3 token scale for design review,
   regression testing, and documentation.

   Switch Theme / Density / Platform in the Storybook toolbar
   to see tokens respond to each context.
   ══════════════════════════════════════════════════════════════ */

const meta: Meta = {
  title: "Core/Foundations/V3 Token Catalog",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

/* ── Helpers ── */
const Swatch = ({ color, label }: { color: string; label: string }) => (
  <div className={styles.swatch}>
    <div className={styles.swatchColor} style={{ background: `var(${color})` }} />
    <span className={styles.swatchLabel}>{label}</span>
  </div>
);

const SemanticRow = ({
  label,
  bg,
  fg,
  border,
}: {
  label: string;
  bg?: string;
  fg?: string;
  border?: string;
}) => (
  <div className={styles.semanticRow}>
    <span className={styles.semanticLabel}>{label}</span>
    <div className={styles.semanticSamples}>
      {bg && (
        <div
          className={styles.semanticChip}
          style={{
            background: `var(${bg})`,
            color: fg ? `var(${fg})` : undefined,
            border: border ? `1px solid var(${border})` : undefined,
          }}
        >
          Sample
        </div>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   1. COLOR PRIMITIVES
   ═══════════════════════════════════════════════════════ */
export const ColorPrimitives: Story = {
  name: "1. Color Primitives",
  render: () => {
    const hues = [
      { name: "Zinc", prefix: "--zinc" },
      { name: "Blue", prefix: "--blue" },
      { name: "Sky", prefix: "--sky" },
      { name: "Green", prefix: "--green" },
      { name: "Emerald", prefix: "--emerald" },
      { name: "Amber", prefix: "--amber" },
      { name: "Red", prefix: "--red" },
      { name: "Orange", prefix: "--orange" },
      { name: "Violet", prefix: "--violet" },
      { name: "Purple", prefix: "--purple" },
      { name: "Pink", prefix: "--pink" },
      { name: "Teal", prefix: "--teal" },
      { name: "Indigo", prefix: "--indigo" },
    ];
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Primitive Color Scales</h2>
        <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
          12 hue ramps × 11 steps + Black/White. These are raw values — components use semantic tokens only.
        </p>
        {hues.map((hue) => (
          <div key={hue.name}>
            <h3 className={styles.subsectionTitle}>{hue.name}</h3>
            <div className={styles.swatchGrid}>
              {steps.map((step) => (
                <Swatch
                  key={step}
                  color={`${hue.prefix}-${step}`}
                  label={`${step}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   2. SEMANTIC COLORS
   ═══════════════════════════════════════════════════════ */
export const SemanticColors: Story = {
  name: "2. Semantic Colors",
  render: () => (
    <div className={styles.catalog}>
      <h2 className={styles.sectionTitle}>Semantic Color Roles</h2>
      <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
        Theme-aware color roles. Switch themes in the toolbar to see values change.
      </p>

      <h3 className={styles.subsectionTitle}>Backgrounds</h3>
      <SemanticRow label="bg-default" bg="--color-bg-default" fg="--color-text-default" />
      <SemanticRow label="bg-subtle" bg="--color-bg-subtle" fg="--color-text-default" />
      <SemanticRow label="bg-muted" bg="--color-bg-muted" fg="--color-text-default" />
      <SemanticRow label="bg-emphasis" bg="--color-bg-emphasis" fg="--color-text-on-emphasis" />
      <SemanticRow label="bg-inverse" bg="--color-bg-inverse" fg="--color-text-inverse" />

      <h3 className={styles.subsectionTitle}>Brand / Primary</h3>
      <SemanticRow label="primary" bg="--color-primary" fg="--color-primary-foreground" />
      <SemanticRow label="primary-hover" bg="--color-primary-hover" fg="--color-primary-foreground" />
      <SemanticRow label="primary-muted" bg="--color-primary-muted" fg="--color-primary" />

      <h3 className={styles.subsectionTitle}>Status</h3>
      <SemanticRow label="success" bg="--color-success" fg="--color-success-foreground" />
      <SemanticRow label="warning" bg="--color-warning" fg="--color-warning-foreground" />
      <SemanticRow label="danger" bg="--color-danger" fg="--color-danger-foreground" />
      <SemanticRow label="info" bg="--color-info" fg="--color-info-foreground" />

      <h3 className={styles.subsectionTitle}>Interactive Surfaces</h3>
      <SemanticRow label="card" bg="--color-card" fg="--color-card-foreground" border="--color-border-default" />
      <SemanticRow label="popover" bg="--color-popover" fg="--color-popover-foreground" />
      <SemanticRow label="sidebar" bg="--color-sidebar" fg="--color-sidebar-foreground" />
      <SemanticRow label="input" bg="--color-input" fg="--color-text-default" border="--color-input-border" />
    </div>
  ),
};

/* ═══════════════════════════════════════════════════════
   3. TYPOGRAPHY
   ═══════════════════════════════════════════════════════ */
export const Typography: Story = {
  name: "3. Typography Scale",
  render: () => {
    const scale = [
      { token: "--type-2xs", label: "2xs", px: "10px" },
      { token: "--type-xs", label: "xs", px: "12px" },
      { token: "--type-sm", label: "sm", px: "13px" },
      { token: "--type-base", label: "base", px: "14px" },
      { token: "--type-md", label: "md", px: "15px" },
      { token: "--type-lg", label: "lg", px: "18px" },
      { token: "--type-xl", label: "xl", px: "20px" },
      { token: "--type-2xl", label: "2xl", px: "22px" },
      { token: "--type-3xl", label: "3xl", px: "24px" },
      { token: "--type-display-xs", label: "display-xs", px: "26px" },
      { token: "--type-display-sm", label: "display-sm", px: "28px" },
      { token: "--type-display-md", label: "display-md", px: "30px" },
      { token: "--type-display-lg", label: "display-lg", px: "32px" },
    ];

    const weights = [
      { token: "--weight-light", label: "light (300)" },
      { token: "--weight-regular", label: "regular (400)" },
      { token: "--weight-medium", label: "medium (500)" },
      { token: "--weight-semibold", label: "semibold (600)" },
      { token: "--weight-bold", label: "bold (700)" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Typography Scale — Inter</h2>

        <h3 className={styles.subsectionTitle}>Size Ramp (13 steps)</h3>
        {scale.map(({ token, label, px }) => (
          <div key={label} className={styles.typeRow}>
            <span className={styles.typeLabel}>{label}</span>
            <span className={styles.typeSize}>{px}</span>
            <span
              className={styles.typeSample}
              style={{ fontSize: `var(${token})` }}
            >
              Accounts Receivable — ₹1,24,850.00
            </span>
          </div>
        ))}

        <h3 className={styles.subsectionTitle}>Font Weights</h3>
        {weights.map(({ token, label }) => (
          <div key={label} className={styles.typeRow}>
            <span className={styles.typeLabel}>{label}</span>
            <span className={styles.typeSize} />
            <span
              className={styles.typeSample}
              style={{
                fontWeight: `var(${token})`,
                fontSize: "var(--type-base)",
              }}
            >
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        ))}

        <h3 className={styles.subsectionTitle}>Tabular Numerics</h3>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>tabular-nums</span>
          <span className={styles.typeSize} />
          <span
            className={styles.typeSample}
            style={{
              fontVariantNumeric: "tabular-nums",
              fontSize: "var(--type-base)",
            }}
          >
            1,234,567.89 &nbsp; 9,876,543.21 &nbsp; 0,000,000.00
          </span>
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   4. SPACING
   ═══════════════════════════════════════════════════════ */
export const Spacing: Story = {
  name: "4. Spacing Scale",
  render: () => {
    const steps = [
      { token: "--space-0", label: "0", px: "0" },
      { token: "--space-px", label: "px", px: "1px" },
      { token: "--space-0-5", label: "0.5", px: "2px" },
      { token: "--space-1", label: "1", px: "4px" },
      { token: "--space-1-5", label: "1.5", px: "6px" },
      { token: "--space-2", label: "2", px: "8px" },
      { token: "--space-2-5", label: "2.5", px: "10px" },
      { token: "--space-3", label: "3", px: "12px" },
      { token: "--space-4", label: "4", px: "16px" },
      { token: "--space-5", label: "5", px: "20px" },
      { token: "--space-6", label: "6", px: "24px" },
      { token: "--space-8", label: "8", px: "32px" },
      { token: "--space-10", label: "10", px: "40px" },
      { token: "--space-12", label: "12", px: "48px" },
      { token: "--space-16", label: "16", px: "64px" },
      { token: "--space-20", label: "20", px: "80px" },
      { token: "--space-24", label: "24", px: "96px" },
      { token: "--space-32", label: "32", px: "128px" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Spacing Scale — 4px Grid</h2>
        {steps.map(({ token, label, px }) => (
          <div key={label} className={styles.spacingRow}>
            <span className={styles.spacingLabel}>{token}</span>
            <span className={styles.spacingValue}>{px}</span>
            <div
              className={styles.spacingBar}
              style={{ width: `var(${token})`, minWidth: px === "0" ? "2px" : undefined }}
            />
          </div>
        ))}
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   5. RADIUS
   ═══════════════════════════════════════════════════════ */
export const Radius: Story = {
  name: "5. Border Radius",
  render: () => {
    const radii = [
      { token: "--radius-none", label: "none (0)" },
      { token: "--radius-xs", label: "xs (2px)" },
      { token: "--radius-sm", label: "sm (4px)" },
      { token: "--radius", label: "default (6px)" },
      { token: "--radius-md", label: "md (8px)" },
      { token: "--radius-lg", label: "lg (12px)" },
      { token: "--radius-xl", label: "xl (16px)" },
      { token: "--radius-2xl", label: "2xl (24px)" },
      { token: "--radius-full", label: "full (9999px)" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Border Radius — Nova 6px Default</h2>
        <div className={styles.radiusGrid}>
          {radii.map(({ token, label }) => (
            <div
              key={token}
              className={styles.radiusSample}
              style={{ borderRadius: `var(${token})` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   6. ELEVATION & SHADOWS
   ═══════════════════════════════════════════════════════ */
export const Elevation: Story = {
  name: "6. Elevation & Shadows",
  render: () => {
    const shadows = [
      { token: "--shadow-none", label: "none" },
      { token: "--shadow-xs", label: "xs" },
      { token: "--shadow-sm", label: "sm" },
      { token: "--shadow-md", label: "md" },
      { token: "--shadow-lg", label: "lg" },
      { token: "--shadow-xl", label: "xl" },
      { token: "--shadow-2xl", label: "2xl" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Elevation & Shadow Scale</h2>
        <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
          High-contrast theme removes all shadows. Switch themes to verify.
        </p>
        <div className={styles.elevationGrid}>
          {shadows.map(({ token, label }) => (
            <div
              key={token}
              className={styles.elevationSample}
              style={{ boxShadow: `var(${token})` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   7. DENSITY
   ═══════════════════════════════════════════════════════ */
export const Density: Story = {
  name: "7. Density Matrix",
  render: () => {
    const tokens = [
      { token: "--density-row-height", label: "Row Height" },
      { token: "--density-control-height", label: "Control Height" },
      { token: "--density-cell-padding-y", label: "Cell Pad Y" },
      { token: "--density-cell-padding-x", label: "Cell Pad X" },
      { token: "--density-card-padding", label: "Card Padding" },
      { token: "--density-page-padding", label: "Page Padding" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>4-Tier Density Matrix</h2>
        <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
          Switch density in the toolbar: ultra-compact → compact → standard → comfortable.
          Each token below responds to the current [data-density] attribute.
        </p>
        {tokens.map(({ token, label }) => (
          <div key={token} className={styles.densityRow}>
            <span className={styles.densityLabel}>{label}</span>
            <div
              className={styles.densityBar}
              style={{ height: `var(${token})`, width: "200px" }}
            />
          </div>
        ))}
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   8. MOTION
   ═══════════════════════════════════════════════════════ */
export const Motion: Story = {
  name: "8. Motion & Easing",
  render: () => {
    const durations = [
      { token: "--duration-instant", label: "instant (50ms)" },
      { token: "--duration-fast", label: "fast (100ms)" },
      { token: "--duration-normal", label: "normal (200ms)" },
      { token: "--duration-slow", label: "slow (300ms)" },
      { token: "--duration-slower", label: "slower (500ms)" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Motion, Easing & Duration</h2>
        <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
          Hover the boxes below to see transitions. Respects prefers-reduced-motion.
        </p>
        <h3 className={styles.subsectionTitle}>Duration Scale</h3>
        <div className={styles.motionGrid}>
          {durations.map(({ token, label }) => (
            <div
              key={token}
              className={styles.motionSample}
              style={{ transitionDuration: `var(${token})` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   9. CHARTS
   ═══════════════════════════════════════════════════════ */
export const Charts: Story = {
  name: "9. Chart Palette",
  render: () => {
    const chartColors = Array.from({ length: 10 }, (_, i) => ({
      token: `--chart-${i + 1}`,
      label: `${i + 1}`,
      height: `${40 + Math.random() * 60}%`,
    }));

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Chart / Data Visualization Palette</h2>
        <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
          10-color neutral categorical palette. Dark theme maps to lighter variants.
        </p>
        <div className={styles.chartGrid}>
          {chartColors.map(({ token, label, height }) => (
            <div
              key={token}
              className={styles.chartBar}
              style={{ background: `var(${token})`, height }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   10. PLATFORM ACCENTS
   ═══════════════════════════════════════════════════════ */
export const PlatformAccents: Story = {
  name: "10. Platform Accents",
  render: () => {
    const platforms = [
      { scope: "pcc", name: "Provider Control Center", color: "violet" },
      { scope: "apps", name: "Business Applications", color: "blue" },
      { scope: "occ", name: "Organization Control", color: "teal" },
      { scope: "developer", name: "Developer Platform", color: "indigo" },
      { scope: "marketplace", name: "Marketplace", color: "purple" },
      { scope: "ops", name: "Operations Platform", color: "orange" },
      { scope: "marketing", name: "Marketing Site", color: "emerald" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Platform Accent Identity System</h2>
        <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
          Each platform scope gets its own accent via [data-platform-scope]. Switch platform in toolbar.
        </p>
        <div className={styles.accentGrid}>
          {platforms.map(({ scope, name, color }) => (
            <div
              key={scope}
              className={styles.accentCard}
              style={{
                borderColor: `var(--accent-${scope}, var(--color-primary))`,
                background: `var(--color-bg-subtle)`,
              }}
            >
              <span className={styles.accentTitle}>{name}</span>
              <span className={styles.accentMeta}>--accent-{scope} ({color})</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   11. Z-INDEX LAYERS
   ═══════════════════════════════════════════════════════ */
export const ZIndex: Story = {
  name: "11. Z-Index Layers",
  render: () => {
    const layers = [
      { token: "--z-base", label: "base (0)" },
      { token: "--z-raised", label: "raised (1)" },
      { token: "--z-dropdown", label: "dropdown (10)" },
      { token: "--z-sticky", label: "sticky (20)" },
      { token: "--z-header", label: "header (30)" },
      { token: "--z-overlay", label: "overlay (40)" },
      { token: "--z-drawer", label: "drawer (50)" },
      { token: "--z-modal", label: "modal (60)" },
      { token: "--z-popover", label: "popover (70)" },
      { token: "--z-toast", label: "toast (80)" },
      { token: "--z-tooltip", label: "tooltip (90)" },
      { token: "--z-max", label: "max (9999)" },
    ];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>Z-Index Managed Stacking</h2>
        <div className={styles.zGrid}>
          {layers.map(({ token, label }) => (
            <div key={token} className={styles.zSample}>
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   12. SURFACES
   ═══════════════════════════════════════════════════════ */
export const Surfaces: Story = {
  name: "12. Surface Hierarchy",
  render: () => {
    const levels = [0, 1, 2, 3, 4];

    return (
      <div className={styles.catalog}>
        <h2 className={styles.sectionTitle}>5-Level Surface Depth Hierarchy</h2>
        <div className={styles.elevationGrid}>
          {levels.map((level) => (
            <div
              key={level}
              className={styles.elevationSample}
              style={{
                background: `var(--surface-${level}-bg)`,
                border: `1px solid var(--surface-${level}-border)`,
                boxShadow: `var(--surface-${level}-shadow, none)`,
                width: 120,
                height: 80,
              }}
            >
              Surface {level}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════
   13. FOCUS RINGS
   ═══════════════════════════════════════════════════════ */
export const FocusRings: Story = {
  name: "13. Focus Ring System",
  render: () => (
    <div className={styles.catalog}>
      <h2 className={styles.sectionTitle}>Focus Ring System</h2>
      <p style={{ fontSize: "var(--type-sm)", color: "var(--color-text-muted)" }}>
        Tab through these elements to see focus rings. High-contrast theme uses 3px ring.
      </p>
      <div className={styles.focusGrid}>
        <button
          className={styles.focusSample}
          style={{
            outlineWidth: "var(--focus-ring-width)",
            outlineOffset: "var(--focus-ring-offset)",
          }}
        >
          Tab to me
        </button>
        <button
          className={styles.focusSample}
          style={{
            outlineWidth: "var(--focus-ring-width)",
            outlineOffset: "var(--focus-ring-offset)",
          }}
        >
          Then me
        </button>
        <button
          className={styles.focusSample}
          style={{
            outlineWidth: "var(--focus-ring-width)",
            outlineOffset: "var(--focus-ring-offset)",
          }}
        >
          And me
        </button>
      </div>
    </div>
  ),
};
