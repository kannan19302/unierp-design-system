import type { Meta, StoryObj } from "@storybook/react";
import { Search, Mail } from "lucide-react";
import { Input } from "./text-field";

const meta: Meta<typeof Input> = {
  title: "Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Enter text",
    "aria-label": "Example input",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(320px, calc(100vw - 32px))" }}>
      <Input {...args} fullWidth />
    </div>
  ),
};

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

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "Posted invoice reference",
    "aria-label": "Posted invoice reference",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "280px" }}>
      <Input inputSize="sm" placeholder="Small" aria-label="Small input" />
      <Input inputSize="md" placeholder="Medium" aria-label="Medium input" />
      <Input inputSize="lg" placeholder="Large" aria-label="Large input" />
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "var(--space-4)", width: "min(640px, calc(100vw - 2rem))", backgroundColor: "var(--color-bg)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
          1. Default / Empty
        </h4>
        <Input placeholder="Enter username..." aria-label="Username" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
          2. With Left Search Icon
        </h4>
        <Input leftIcon={<Search size={14} />} placeholder="Search ledger accounts..." aria-label="Search ledger accounts" fullWidth />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
          3. Invalid / Error State
        </h4>
        <Input error defaultValue="invalid.entry@domain" aria-label="Email address" aria-describedby="input-error-example" />
        <span id="input-error-example" role="alert" style={{ color: "var(--color-danger)" }}>Enter a valid email address.</span>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
          4. Disabled State
        </h4>
        <Input disabled defaultValue="Locked fiscal identifier" aria-label="Fiscal identifier" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
          5. Read-only State
        </h4>
        <Input readOnly defaultValue="INV-2026-024" aria-label="Posted invoice reference" />
      </div>
    </div>
  ),
};
