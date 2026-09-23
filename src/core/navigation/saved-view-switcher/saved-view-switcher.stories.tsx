import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SavedViewSwitcher } from "./saved-view-switcher";

const meta: Meta<typeof SavedViewSwitcher> = {
  title: "Core/Navigation/SavedViewSwitcher",
  component: SavedViewSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof SavedViewSwitcher>;

const sampleViews = [
  { id: "all", name: "All Vouchers (Default)" },
  { id: "unposted", name: "Unposted Drafts" },
  { id: "overdue", name: "Overdue Receivables" },
  { id: "audit_flagged", name: "Auditor Flagged" },
];

export const Default: Story = {
  args: {
    activeViewId: "unposted",
    views: sampleViews,
    onSelectView: (id: string) => console.log("Selected view:", id),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Grid View Switcher</p>
        <SavedViewSwitcher
          views={sampleViews}
          activeViewId="all"
          onSelectView={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Overdue Invoices Scope</p>
        <SavedViewSwitcher
          views={sampleViews}
          activeViewId="overdue"
          onSelectView={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}>
      <SavedViewSwitcher views={sampleViews} activeViewId="all" onSelectView={() => {}} />
      <SavedViewSwitcher views={sampleViews} activeViewId="unposted" onSelectView={() => {}} />
      <SavedViewSwitcher views={sampleViews} activeViewId="audit_flagged" onSelectView={() => {}} />
    </div>
  ),
};
