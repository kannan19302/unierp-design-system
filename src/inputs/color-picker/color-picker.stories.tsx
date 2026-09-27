import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker, type ColorPickerProps } from "./color-picker";

/**
 * `ColorPicker` provides an accessible, enterprise-grade color selection workflow
 * featuring preset swatches, native HTML color picker integration, raw hex input,
 * 4-tier density scaling, and live WCAG AA/AAA contrast ratio validation against white backgrounds.
 *
 * ### Architectural Features
 * - **Live WCAG Contrast Calculation**: Real-time luminance comparison displaying ratio and AA/AAA badges.
 * - **Preset Swatches**: Curated palette with active check indicator.
 * - **Native Eyedropper / System Picker**: Seamless fallback to browser-native color controls.
 * - **4-Tier Density**: Ultra-compact (24px), Compact (28px), Standard (32px), Comfortable (40px).
 */
const meta: Meta<typeof ColorPicker> = {
  title: "Core/Inputs/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise color picker supporting presets, hex inputs, density scaling, and real-time WCAG accessibility contrast scores.",
      },
    },
  },
  argTypes: {
    value: {
      control: "color",
      description: "Hex string representation of the currently selected color",
    },
    label: {
      control: "text",
      description: "Accessible form label for the color picker",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
    presetColors: {
      control: "object",
      description: "Array of hex color strings displayed as clickable preset swatches",
    },
    showContrastPreview: {
      control: "boolean",
      description: "Toggles the live WCAG contrast calculation section",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction with the picker trigger and popup",
    },
    onChange: {
      action: "changed",
      description: "Callback triggered when a new color is chosen",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

function InteractiveColorPicker(props: Partial<ColorPickerProps>) {
  const [color, setColor] = useState(props.value || "#0e6b75");
  return (
    <div style={{ maxWidth: 360 }}>
      <ColorPicker
        label="Brand Theme Color"
        value={color}
        onChange={setColor}
        {...props}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveColorPicker />,
};

export const CustomPresets: Story = {
  render: () => (
    <InteractiveColorPicker
      presetColors={[
        "#1d4ed8",
        "#047857",
        "#6d28d9",
        "#b45309",
        "#be123c",
        "#0f766e",
      ]}
    />
  ),
};

export const DensityTiers: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 360 }}>
      <InteractiveColorPicker density="ultra-compact" label="Ultra-compact (24px)" value="#0e6b75" />
      <InteractiveColorPicker density="compact" label="Compact (28px)" value="#1d4ed8" />
      <InteractiveColorPicker density="standard" label="Standard (32px)" value="#047857" />
      <InteractiveColorPicker density="comfortable" label="Comfortable (40px)" value="#6d28d9" />
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Default AAA Contrast</h4>
        <InteractiveColorPicker value="#0e6b75" label="Primary Teal" />
      </div>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Medium Contrast AA</h4>
        <InteractiveColorPicker value="#b45309" label="Warning Amber" />
      </div>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Error State</h4>
        <InteractiveColorPicker value="#ef4444" label="Brand Accent" error="Color must meet contrast requirements" invalid />
      </div>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Disabled</h4>
        <InteractiveColorPicker value="#64748b" label="Disabled Color" disabled />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 500 }}>
      <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Workspace Branding Theme</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Customize company theme palette and accent colors.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <InteractiveColorPicker label="Primary Accent" value="#0e6b75" />
        <InteractiveColorPicker label="Navigation Bar Background" value="#1e293b" />
        <InteractiveColorPicker label="Chart Highlight Color" value="#3b82f6" />
      </div>
    </div>
  ),
};
