import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RecordAnchorNavigationStrip } from "./record-anchor-navigation-strip";

const meta: Meta<typeof RecordAnchorNavigationStrip> = {
  title: "Navigation/RecordAnchorNavigationStrip",
  component: RecordAnchorNavigationStrip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof RecordAnchorNavigationStrip>;

const sampleSections = [
  { id: "general", label: "General Header", status: "completed" as const },
  { id: "lines", label: "Invoice Lines", count: 12, status: "completed" as const },
  { id: "tax", label: "Tax Calculation", status: "warning" as const },
  { id: "compliance", label: "Compliance & VAT", status: "error" as const },
  { id: "documents", label: "Attachments", count: 3, status: "pending" as const },
  { id: "history", label: "Audit Log" },
];

export const Vertical: Story = {
  args: {
    items: sampleSections,
    activeId: "lines",
    title: "Invoice Sections",
    orientation: "vertical",
    density: "standard",
  },
};

export const Horizontal: Story = {
  args: {
    items: sampleSections,
    activeId: "tax",
    title: "Sections",
    orientation: "horizontal",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Vertical Section Strip</p>
        <RecordAnchorNavigationStrip
          items={sampleSections}
          activeId="lines"
          title="Invoice Sections"
          orientation="vertical"
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Horizontal Section Strip</p>
        <RecordAnchorNavigationStrip
          items={sampleSections.slice(0, 4)}
          activeId="tax"
          orientation="horizontal"
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <RecordAnchorNavigationStrip items={sampleSections} activeId="general" density="ultra-compact" />
      <RecordAnchorNavigationStrip items={sampleSections} activeId="lines" density="compact" />
      <RecordAnchorNavigationStrip items={sampleSections} activeId="tax" density="standard" />
      <RecordAnchorNavigationStrip items={sampleSections} activeId="compliance" density="comfortable" />
    </div>
  ),
};
