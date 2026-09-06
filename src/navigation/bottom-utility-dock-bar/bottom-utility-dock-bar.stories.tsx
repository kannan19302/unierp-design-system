import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BottomUtilityDockBar } from "./bottom-utility-dock-bar";

const meta: Meta<typeof BottomUtilityDockBar> = {
  title: "Navigation/BottomUtilityDockBar",
  component: BottomUtilityDockBar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BottomUtilityDockBar>;

const sampleTools = [
  {
    id: "history",
    label: "Recent Records",
    icon: <span>🕒</span>,
    badgeCount: 3,
    renderPanel: () => (
      <div>
        <p><strong>Recent Records</strong></p>
        <ul>
          <li>INV-2026-001 (Acme Corp)</li>
          <li>SO-8842 (Global Logistics)</li>
          <li>PO-9912 (Contoso Ltd)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "notes",
    label: "Scratchpad",
    icon: <span>📝</span>,
    renderPanel: () => (
      <div>
        <p>Quick scratchpad notes...</p>
        <textarea rows={4} style={{ width: "100%" }} defaultValue="Follow up on Q3 revenue quota." />
      </div>
    ),
  },
  {
    id: "terminal",
    label: "Cloud Terminal",
    icon: <span>⌨️</span>,
    renderPanel: () => <code>$ unierp cluster-status --all</code>,
  },
];

export const Default: Story = {
  args: {
    tools: sampleTools,
    statusText: "System Connected (14ms)",
    liveStatus: "online",
    density: "standard",
  },
};

export const Compact: Story = {
  args: {
    tools: sampleTools,
    statusText: "Syncing DB...",
    liveStatus: "syncing",
    density: "compact",
  },
};
