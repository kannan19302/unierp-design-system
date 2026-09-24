import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Pin } from "lucide-react";
import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "Core/Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Toggle",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Mode",
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Toggle aria-label="Toggle bold">
        <Bold size={14} />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic size={14} />
      </Toggle>
      <Toggle variant="outline" aria-label="Pin dashboard">
        <Pin size={14} />
      </Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Toggle",
  },
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Default & Pressed State
        </h4>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Toggle aria-label="Default unpressed">Unpressed</Toggle>
          <Toggle defaultPressed aria-label="Default pressed">Pressed</Toggle>
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Outline Variant
        </h4>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Toggle variant="outline" aria-label="Outline unpressed">Outline</Toggle>
          <Toggle variant="outline" defaultPressed aria-label="Outline pressed">Outline Pressed</Toggle>
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          3. Disabled States
        </h4>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Toggle disabled aria-label="Disabled unpressed">Disabled</Toggle>
          <Toggle disabled defaultPressed aria-label="Disabled pressed">Disabled Pressed</Toggle>
        </div>
      </div>
    </div>
  ),
};
