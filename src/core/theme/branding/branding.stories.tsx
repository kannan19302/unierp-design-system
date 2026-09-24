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
  title: "Core/Theme/Branding",
  component: BrandingDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Validates tenant brand color contrast against background surfaces to enforce WCAG AA/AAA compliance.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <BrandingDemo />,
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 500 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Passing Brand Accent (WCAG AA &ge; 4.5:1)
        </h4>
        <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-default)", background: "#ffffff" }}>
          <span style={{ color: "#2563eb", fontWeight: 600 }}>Brand Accent #2563eb on White &mdash; 4.56:1 (Pass)</span>
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Failing Contrast (Low Contrast Warning)
        </h4>
        <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-danger, #ef4444)", background: "#ffffff" }}>
          <span style={{ color: "#93c5fd", fontWeight: 600 }}>Brand Accent #93c5fd on White &mdash; 1.62:1 (Fail)</span>
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          3. High-Contrast Enterprise Grade (AAA &ge; 7:1)
        </h4>
        <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-default)", background: "#ffffff" }}>
          <span style={{ color: "#1e3a8a", fontWeight: 600 }}>Brand Accent #1e3a8a on White &mdash; 9.48:1 (AAA Pass)</span>
        </div>
      </div>
    </div>
  ),
};
