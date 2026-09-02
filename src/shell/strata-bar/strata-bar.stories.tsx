import type { Meta, StoryObj } from "@storybook/react";
import { StrataBar } from "./strata-bar";

const meta: Meta<typeof StrataBar> = {
  title: "Shell/StrataBar",
  component: StrataBar,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof StrataBar>;

export const Default: Story = {
  args: {
    segments: ["acme", "finance", "invoices", "INV-2043"],
    state: { kind: "warning", label: "Awaiting approval" },
    action: <button style={{ padding: "4px 12px", background: "var(--color-primary)", color: "var(--on-primary)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>Approve</button>,
  },
};

export const WithLifecycle: Story = {
  args: {
    segments: ["acme", "sales", "orders", "SO-9921"],
    lifecycle: [
      { id: "draft", label: "Draft" },
      { id: "review", label: "In Review", active: true },
      { id: "approved", label: "Approved" },
      { id: "posted", label: "Posted" },
    ],
    activeUsers: ["JD", "AS"],
    state: { kind: "info", label: "Under Review" },
    action: <button style={{ padding: "4px 12px", background: "var(--color-primary)", color: "var(--on-primary)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>Submit</button>,
  },
};
