import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PinnedBookmarksBar } from "./pinned-bookmarks-bar";

const meta: Meta<typeof PinnedBookmarksBar> = {
  title: "Core/Navigation/PinnedBookmarksBar",
  component: PinnedBookmarksBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof PinnedBookmarksBar>;

const sampleBookmarks = [
  { id: "b1", label: "Open Invoices Q3", hotkeyNumber: 1, isActive: true },
  { id: "b2", label: "Pending Wire Approvals", hotkeyNumber: 2 },
  { id: "b3", label: "Warehouse Inventory Wave 04", hotkeyNumber: 3 },
  { id: "b4", label: "General Ledger Reconciliation", hotkeyNumber: 4 },
  { id: "b5", label: "Top 20 ARR Accounts", hotkeyNumber: 5 },
];

export const Default: Story = {
  args: {
    bookmarks: sampleBookmarks,
    density: "standard",
    onSelect: (b) => console.log(`Selected: ${b.label}`),
    onRemove: (id) => console.log(`Removed: ${id}`),
    onAddCurrent: () => console.log("Pin view"),
  },
};

export const Compact: Story = {
  args: {
    bookmarks: sampleBookmarks,
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Bookmarks Bar with Add Pin</p>
        <PinnedBookmarksBar
          bookmarks={sampleBookmarks}
          onSelect={() => {}}
          onRemove={() => {}}
          onAddCurrent={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Bookmarks Bar (Read Only)</p>
        <PinnedBookmarksBar
          bookmarks={sampleBookmarks.slice(0, 3)}
          density="compact"
          onSelect={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <PinnedBookmarksBar bookmarks={sampleBookmarks} density="ultra-compact" />
      <PinnedBookmarksBar bookmarks={sampleBookmarks} density="compact" />
      <PinnedBookmarksBar bookmarks={sampleBookmarks} density="standard" />
      <PinnedBookmarksBar bookmarks={sampleBookmarks} density="comfortable" />
    </div>
  ),
};
