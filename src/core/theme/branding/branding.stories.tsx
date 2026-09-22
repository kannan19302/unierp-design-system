import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { validateTenantBrandContrast } from "./branding";
import styles from "./branding.module.css";

const BrandingDemo = () => {
  const [color, setColor] = useState("#2563eb");
  const validation = validateTenantBrandContrast(color, "#ffffff");

  return (
    <div className={styles.brandingDemo}>
      <h3 style={{ margin: 0 }}>Tenant Brand Color Contrast Validator (B22)</h3>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Ensures tenant brand accents satisfy WCAG AA 4.5:1 minimum contrast.
      </p>

      <div className={styles.colorRow}>
        <label htmlFor="brand-picker" style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
          Brand Accent:
        </label>
        <input
          id="brand-picker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: 44, height: 36, cursor: "pointer", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-sm)" }}
        />
        <code>{color}</code>
      </div>

      <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-default)" }}>
        <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
          Calculated Ratio: <strong>{validation.ratio}:1</strong> —{" "}
          <span className={validation.valid ? styles.badgeSuccess : styles.badgeFailure}>
            {validation.valid ? "✓ Pass (WCAG AA Compliant)" : "✗ Fail (Too Low Contrast)"}
          </span>
        </p>
        {validation.error && (
          <p style={{ margin: "var(--space-2) 0 0 0", color: "var(--color-danger, #ef4444)", fontSize: "var(--text-xs)" }}>
            {validation.error}
          </p>
        )}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Theme/Branding",
  component: BrandingDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <BrandingDemo />,
};
