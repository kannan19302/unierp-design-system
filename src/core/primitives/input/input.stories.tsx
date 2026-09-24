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

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)", width: "640px" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Default / Empty
        </h4>
        <Input placeholder="Enter username..." />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. With Left Search Icon
        </h4>
        <Input leftIcon={<Search size={14} />} placeholder="Search ledger accounts..." />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          3. Invalid / Error State
        </h4>
        <Input error defaultValue="invalid.entry@domain" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          4. Disabled State
        </h4>
        <Input disabled defaultValue="Locked fiscal identifier" />
      </div>
    </div>
  ),
};
