import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SignaturePad } from "./signature-pad";

/**
 * `SignaturePad` captures high-resolution electronic signatures on an HTML5 canvas.
 * Includes clear button, base-line signing guidance, 4-tier density scaling, touch drawing, and data URL export.
 *
 * ### Architectural Features
 * - **Theme-Aware Stroke**: Canvas dynamically adopts `--color-text-primary` token for contrast in light/dark themes.
 * - **Export Format**: Emits standard PNG Data URL via `onSave`.
 * - **4-Tier Density**: Ultra-compact (240x72), Compact (280x96), Standard (340x120), Comfortable (420x160).
 * - **Touch & Stylus Support**: Native touch event listeners with coordinate normalization.
 */
const meta: Meta<typeof SignaturePad> = {
  title: "Core/Inputs/SignaturePad",
  component: SignaturePad,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise electronic signature capture component with canvas rendering and instant clear/export capabilities.",
      },
    },
  },
  argTypes: {
    width: {
      control: "number",
      description: "Canvas width in pixels",
    },
    height: {
      control: "number",
      description: "Canvas height in pixels",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
    disabled: {
      control: "boolean",
      description: "Disables canvas drawing interactions",
    },
    onSave: {
      action: "signatureSaved",
      description: "Callback invoked with data URL on mouse up / touch end",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = {
  args: {
    label: "Authorized Representative Signature",
    description: "Draw your signature using mouse, stylus, or touch.",
    density: "standard",
    disabled: false,
  },
};

export const DensityTiers: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SignaturePad density="ultra-compact" label="Ultra-compact (240x72)" />
      <SignaturePad density="compact" label="Compact (280x96)" />
      <SignaturePad density="standard" label="Standard (340x120)" />
      <SignaturePad density="comfortable" label="Comfortable (420x160)" />
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Default Idle</h4>
        <SignaturePad label="Buyer Signature" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Required & Error</h4>
        <SignaturePad label="Officer Signature" required invalid error="Signature is legally required before contract execution" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Disabled Pad</h4>
        <SignaturePad label="Locked Signature" disabled />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => {
    const [dataUrl, setDataUrl] = useState<string>("");

    return (
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 520 }}>
        <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Purchase Order Sign-off</h3>
          <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            Document ID: PO-2026-98124 | Total: $148,250.00
          </p>
        </div>
        <SignaturePad
          label="Authorized Financial Controller"
          description="By signing, you confirm release of escrow funds to vendor."
          required
          onSave={setDataUrl}
        />
        {dataUrl && (
          <div style={{ marginTop: "var(--space-2)", fontSize: "var(--font-size-xs)", color: "var(--color-success)" }}>
            ✓ Signature captured ({dataUrl.length} bytes encoded)
          </div>
        )}
      </div>
    );
  },
};
