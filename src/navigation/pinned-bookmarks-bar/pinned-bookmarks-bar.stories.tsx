import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PinnedBookmarksBar } from "./pinned-bookmarks-bar";

const meta: Meta<typeof PinnedBookmarksBar> = {
  title: "Navigation/PinnedBookmarksBar",
  component: PinnedBookmarksBar,
  parameters: {
    layout: "padded",
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
    onSelect: (b) => alert(`Selected bookmark: ${b.label}`),
    onRemove: (id) => alert(`Removed: ${id}`),
    onAddCurrent: () => alert("Pin current page clicked"),
  },
};

export const Compact: Story = {
  args: {
    bookmarks: sampleBookmarks,
    density: "compact",
  },
};
