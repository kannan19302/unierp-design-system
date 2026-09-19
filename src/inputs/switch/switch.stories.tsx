import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

/**
 * ## Switch Primitive
 *
 * Accessible binary toggle switch engineered for instant boolean feature flags,
 * notifications preferences, operational live mode switchers, and system settings.
 *
 * ### Key Capabilities
 * - **W3C ARIA Switch**: Implements `role="switch"` with `aria-checked` and accessible label association.
 * - **Tactile Spring Micro-Interactions**: Smooth thumb translation across the track without UI drag.
 * - **Keyboard Velocity**: Full Space/Enter toggle handling and visible focus outlines.
 */
const meta: Meta<typeof Switch> = {
  title: "Inputs/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise binary toggle switch conforming to W3C ARIA switch patterns with spring transitions and density scaling.",
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state boolean.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Uncontrolled initial checked state boolean.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and applies muted opacity styling.",
    },
    label: {
      control: "text",
      description: "Accessible text label displayed alongside the switch track.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Enable Multi-Factor Authentication (MFA)",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Automatic Ledger Integrity Verification (Mandatory Policy)",
    checked: true,
    disabled: true,
  },
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
    <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Tenant Security Preferences
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Switch label="Strict IP Range Geofencing" defaultChecked />
        <Switch label="Enforce SAML 2.0 Single Sign-On" defaultChecked />
        <Switch label="Capture Detailed Audit Telemetry" defaultChecked />
        <Switch label="Allow Cross-Tenant Guest Access (Policy Blocked)" disabled />
      </div>
    </div>
  </div>
);

/**
 * All States Gallery rendering all lifecycle, selection, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Core Toggle States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <Switch label="Switch Off (Default)" defaultChecked={false} />
        <Switch label="Switch On (Checked)" defaultChecked={true} />
        <Switch label="Disabled Off" defaultChecked={false} disabled />
        <Switch label="Disabled On" defaultChecked={true} disabled />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Switch label="Ultra-Compact (24px) Quick Toggle" defaultChecked />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Switch label="Compact (28px) Operational Row Toggle" defaultChecked />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Switch label="Standard (32px) Default Settings Switch" defaultChecked />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Switch label="Comfortable (40px) Touch / POS Switch" defaultChecked />
        </div>
      </div>
    </div>
  </div>
);
