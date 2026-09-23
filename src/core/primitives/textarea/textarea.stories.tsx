import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Core/Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Enter internal audit notes...",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "320px" }}>
      <Textarea textareaSize="sm" placeholder="Small (28px scale)" rows={2} />
      <Textarea textareaSize="md" placeholder="Medium (32px scale)" rows={3} />
      <Textarea textareaSize="lg" placeholder="Large (40px scale)" rows={4} />
    </div>
  ),
};

export const ResizeOptions: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "320px" }}>
      <Textarea resize="none" placeholder="No resize allowed" />
      <Textarea resize="vertical" placeholder="Vertical resize only (default)" />
      <Textarea resize="both" placeholder="Both directions resizable" />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    error: true,
    defaultValue: "Discrepancy exceeds authorized threshold.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Automated reconciliation comments (read only).",
  },
};
