import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MasterDetailSplitNavigator } from "./master-detail-split-navigator";

const meta: Meta<typeof MasterDetailSplitNavigator> = {
  title: "Navigation/MasterDetailSplitNavigator",
  component: MasterDetailSplitNavigator,
  parameters: {
    layout: "padded",
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
    onNavigate: (idx) => alert(`Navigate to record #${idx}`),
    onSplitRatioChange: (ratio) => alert(`Ratio changed to: ${ratio}`),
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
