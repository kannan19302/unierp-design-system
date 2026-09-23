import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MasterDetailSplitNavigator } from "./master-detail-split-navigator";

const meta: Meta<typeof MasterDetailSplitNavigator> = {
  title: "Core/Navigation/MasterDetailSplitNavigator",
  component: MasterDetailSplitNavigator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof MasterDetailSplitNavigator>;

export const Default: Story = {
  args: {
    currentIndex: 14,
    totalCount: 92,
    reviewedCount: 30,
    statusLabel: "30 of 92 audited",
    splitRatio: "50/50",
    density: "standard",
    onNavigate: (idx) => console.log(`Navigate to #${idx}`),
    onSplitRatioChange: (ratio) => console.log(`Ratio: ${ratio}`),
  },
};

export const Compact: Story = {
  args: {
    currentIndex: 1,
    totalCount: 45,
    splitRatio: "30/70",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard 50/50 Split Review</p>
        <MasterDetailSplitNavigator
          currentIndex={5}
          totalCount={20}
          reviewedCount={12}
          statusLabel="12 audited"
          splitRatio="50/50"
          onNavigate={() => {}}
          onSplitRatioChange={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact 70/30 Master Emphasis</p>
        <MasterDetailSplitNavigator
          currentIndex={19}
          totalCount={20}
          splitRatio="70/30"
          density="compact"
          onNavigate={() => {}}
          onSplitRatioChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <MasterDetailSplitNavigator
        currentIndex={1}
        totalCount={50}
        density="ultra-compact"
        onNavigate={() => {}}
      />
      <MasterDetailSplitNavigator
        currentIndex={10}
        totalCount={50}
        density="compact"
        onNavigate={() => {}}
      />
      <MasterDetailSplitNavigator
        currentIndex={25}
        totalCount={50}
        density="standard"
        onNavigate={() => {}}
      />
      <MasterDetailSplitNavigator
        currentIndex={50}
        totalCount={50}
        density="comfortable"
        onNavigate={() => {}}
      />
    </div>
  ),
};
