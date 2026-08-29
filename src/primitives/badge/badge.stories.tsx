import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { StatusBadge } from "./status-badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    dot: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Draft",
    variant: "default",
    size: "sm",
    dot: true,
  },
};

export const Success: Story = {
  args: {
    children: "Approved",
    variant: "success",
    size: "sm",
    dot: true,
  },
};

export const Warning: Story = {
  args: {
    children: "Pending Review",
    variant: "warning",
    size: "sm",
    dot: true,
  },
};

export const Danger: Story = {
  args: {
    children: "Rejected",
    variant: "danger",
    size: "sm",
    dot: true,
  },
};

export const StatusMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
    <StatusBadge status="ACTIVE" />
    <StatusBadge status="PENDING" />
    <StatusBadge status="PARTIALLY_PAID" />
    <StatusBadge status="OVERDUE" />
    <StatusBadge status="CANCELLED" />
    <StatusBadge status="DRAFT" />
  </div>
);
