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

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "320px" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Default & Required
        </h4>
        <Label required>Billing Account ID</Label>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Optional
        </h4>
        <Label optional>Tax Exemption Certificate Number</Label>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          3. Invalid / Error State
        </h4>
        <Label error>Fiscal Period (Closed)</Label>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          4. Disabled
        </h4>
        <Label disabled>Read-only System Key</Label>
      </div>
    </div>
  ),
};
