import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "Core/Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Email Address",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Optional: Story = {
  args: {
    optional: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    children: "Invalid Input Field",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Label size="sm">Small Label (12px)</Label>
      <Label size="md">Medium Label (13px)</Label>
      <Label size="lg">Large Label (14px)</Label>
    </div>
  ),
};
