import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch, type SwitchProps } from "./switch";

/**
 * ## Strata V1 Switch Primitive
 *
 * Accessible binary toggle switch engineered to the SideNav V1 reference standard:
 * - **W3C ARIA Switch**: Implements `role="switch"` with `aria-checked` and accessible label association.
 * - **4-Tier Density**: `ultra-compact` (26×14px), `compact` (30×16px), `standard` (34×20px), `comfortable` (42×24px).
 * - **Tactile Spring Transitions**: Smooth thumb translation across the track without UI drag.
 * - **Keyboard Velocity**: Full Space/Enter toggle handling and visible focus outlines.
 */
const meta: Meta<typeof Switch> = {
  title: "Core/Inputs/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise binary toggle switch conforming to W3C ARIA switch patterns with spring transitions and density scaling.",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean", description: "Controlled checked state boolean." },
    defaultChecked: { control: "boolean", description: "Uncontrolled initial checked state boolean." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    label: { control: "text", description: "Accessible text label displayed alongside the switch track." },
    description: { control: "text", description: "Secondary assistive description text." },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

function FeatureFlagWorkbench() {
  const [flags, setFlags] = useState({
    mfa: true,
    telemetry: true,
    sandbox: false,
    auditStream: true,
  });
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");

  return (
    <div
      data-density={density}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        maxWidth: "540px",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)" }}>
            Security Governance Matrix
          </h3>
          <p style={{ margin: "var(--space-0-5) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Real-time compliance switchboard
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-1)" }}>
          {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              style={{
                fontSize: "var(--type-micro, 11px)",
                padding: "2px 6px",
                background: density === d ? "var(--color-primary)" : "var(--color-bg-sunken)",
                color: density === d ? "var(--color-bg-elevated)" : "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              {d === "ultra-compact" ? "24px" : d === "compact" ? "28px" : d === "standard" ? "32px" : "40px"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          padding: "var(--space-4)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <Switch
          label="Enforce Hardware Security Keys (FIDO2 / WebAuthn)"
          description="Requires physical security key challenge on critical ledger writes."
          checked={flags.mfa}
          onChange={(c) => setFlags((prev) => ({ ...prev, mfa: c }))}
          density={density}
        />
        <Switch
          label="Continuous SIEM Audit Stream"
          description="Publishes zero-delay RFC-5424 structured syslog events to sovereign ingest."
          checked={flags.auditStream}
          onChange={(c) => setFlags((prev) => ({ ...prev, auditStream: c }))}
          density={density}
        />
        <Switch
          label="Live Production Sandbox Bypasses"
          description="Temporarily routes transactions through test fixtures (Restricted)."
          checked={flags.sandbox}
          onChange={(c) => setFlags((prev) => ({ ...prev, sandbox: c }))}
          density={density}
        />
        <Switch
          label="Zero-Trust Boundary Inspection (Mandatory Security Base)"
          description="Managed by root infrastructure governor; tenant bypass prohibited."
          checked={true}
          disabled
          density={density}
        />
      </div>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 switch reference",
  render: () => <FeatureFlagWorkbench />,
  parameters: { controls: { disable: true } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "var(--space-4, 16px)",
        padding: "var(--space-4, 16px)",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          1. Default (Off)
        </div>
        <Switch label="Enable Real-Time Debug Logs" defaultChecked={false} />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Active (On)
        </div>
        <Switch label="Strict Transport Security (HSTS)" defaultChecked={true} />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          3. Disabled (Off)
        </div>
        <Switch label="Legacy FTP Gateway" defaultChecked={false} disabled />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          4. Disabled (On)
        </div>
        <Switch label="Hardware Tamper Detection" defaultChecked={true} disabled />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          5. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <Switch density="ultra-compact" label="Ultra-Compact (26×14px)" defaultChecked />
          </div>
          <div data-density="compact">
            <Switch density="compact" label="Compact (30×16px)" defaultChecked />
          </div>
          <div data-density="standard">
            <Switch density="standard" label="Standard (34×20px)" defaultChecked />
          </div>
          <div data-density="comfortable">
            <Switch density="comfortable" label="Comfortable (42×24px)" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

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
