import type { Meta, StoryObj } from "@storybook/react";
import { Search, Mail } from "lucide-react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Core/Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Enter value...",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLeftIcon: Story = {
  args: {
    placeholder: "Search transactions...",
    leftIcon: <Search size={14} />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "user@unierp.com",
    rightIcon: <Mail size={14} />,
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    defaultValue: "invalid-email-address",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Read-only system account",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "280px" }}>
      <Input inputSize="sm" placeholder="Small (28px)" />
      <Input inputSize="md" placeholder="Medium (32px)" />
      <Input inputSize="lg" placeholder="Large (40px)" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: "padded",
  },
  args: {
    fullWidth: true,
    placeholder: "Full width invoice line description...",
  },
};
