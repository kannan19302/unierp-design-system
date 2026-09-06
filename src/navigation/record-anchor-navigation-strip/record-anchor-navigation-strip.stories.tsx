import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RecordAnchorNavigationStrip } from "./record-anchor-navigation-strip";

const meta: Meta<typeof RecordAnchorNavigationStrip> = {
  title: "Navigation/RecordAnchorNavigationStrip",
  component: RecordAnchorNavigationStrip,
  parameters: {
    layout: "centered",
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
