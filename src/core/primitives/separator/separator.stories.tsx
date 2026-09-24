import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Core/Primitives/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "14px", fontWeight: 600 }}>Accounting Periods</div>
      <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
        Manage active fiscal calendars and closure locks.
      </div>
      <Separator orientation="horizontal" style={{ margin: "8px 0" }} />
      <div style={{ fontSize: "12px" }}>FY 2026 Q1: Open</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "32px" }}>
      <span>Ledger</span>
      <Separator orientation="vertical" />
      <span>Sub-Accounts</span>
      <Separator orientation="vertical" />
      <span>Reconciliation</span>
    </div>
  ),
};

export const Semantic: Story = {
  args: {
    decorative: false,
    orientation: "horizontal",
  },
  render: (args) => (
    <div style={{ width: "280px" }}>
      <div>Section 1</div>
      <Separator {...args} style={{ margin: "12px 0" }} />
      <div>Section 2 (accessible separator)</div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: "360px" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Horizontal Separator
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div>General Ledger Summary</div>
          <Separator orientation="horizontal" style={{ margin: "8px 0" }} />
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Fiscal Year 2026 Active</div>
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Vertical Separator
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "28px" }}>
          <span style={{ fontSize: "var(--text-xs)" }}>Entity A</span>
          <Separator orientation="vertical" />
          <span style={{ fontSize: "var(--text-xs)" }}>Entity B</span>
          <Separator orientation="vertical" />
          <span style={{ fontSize: "var(--text-xs)" }}>Consolidated</span>
        </div>
      </div>
    </div>
  ),
};
