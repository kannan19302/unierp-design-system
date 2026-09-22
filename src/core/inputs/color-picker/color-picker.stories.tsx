import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker, type ColorPickerProps } from "./color-picker";

/**
 * `ColorPicker` provides an accessible, enterprise-grade color selection workflow
 * featuring preset swatches, native HTML color picker integration, raw hex input,
 * and live WCAG AA/AAA contrast ratio validation against white backgrounds.
 *
 * ### Architectural Features
 * - **Live WCAG Contrast Calculation**: Real-time luminance comparison displaying ratio and AA/AAA badges.
 * - **Preset Swatches**: Curated palette with active check indicator.
 * - **Native Eyedropper / System Picker**: Seamless fallback to browser-native color controls.
 */
const meta: Meta<typeof ColorPicker> = {
  title: "Inputs/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise color picker supporting presets, hex inputs, and real-time WCAG accessibility contrast scores.",
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 400 }}>
      <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
        <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
          ANATOMY: COLOR TRIGGER CHIP / POPOVER / PRESET SWATCHES / CONTRAST BADGE
        </div>
        <InteractiveColorPicker label="Accent Color (Click chip to inspect)" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 450 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Default (High Contrast AAA)
        </h4>
        <InteractiveColorPicker value="#0e6b75" label="Primary Teal" />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Warning Shade (Medium Contrast AA)
        </h4>
        <InteractiveColorPicker value="#b45309" label="Warning Amber" />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Disabled
        </h4>
        <InteractiveColorPicker value="#64748b" label="Disabled Picker" disabled />
      </div>
    </div>
  ),
};
