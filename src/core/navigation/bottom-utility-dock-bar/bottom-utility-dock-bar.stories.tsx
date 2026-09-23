import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BottomUtilityDockBar } from "./bottom-utility-dock-bar";

const meta: Meta<typeof BottomUtilityDockBar> = {
  title: "Core/Navigation/BottomUtilityDockBar",
  component: BottomUtilityDockBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "todo" },
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
        <textarea rows={4} style={{ inlineSize: "100%" }} defaultValue="Follow up on Q3 revenue quota." />
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Dock with Panel Open</p>
        <BottomUtilityDockBar
          tools={sampleTools}
          activeToolId="history"
          statusText="Live Sync Active"
          liveStatus="online"
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Dock with Warning/Sync Status</p>
        <BottomUtilityDockBar
          tools={sampleTools}
          statusText="Reconnecting in 5s..."
          liveStatus="syncing"
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <BottomUtilityDockBar
        tools={sampleTools}
        density="ultra-compact"
        statusText="Ultra Compact"
        liveStatus="online"
      />
      <BottomUtilityDockBar
        tools={sampleTools}
        density="compact"
        statusText="Compact"
        liveStatus="syncing"
      />
      <BottomUtilityDockBar
        tools={sampleTools}
        density="standard"
        statusText="Standard"
        liveStatus="online"
      />
      <BottomUtilityDockBar
        tools={sampleTools}
        density="comfortable"
        statusText="Comfortable Offline"
        liveStatus="offline"
      />
    </div>
  ),
};
