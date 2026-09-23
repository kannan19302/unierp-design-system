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
