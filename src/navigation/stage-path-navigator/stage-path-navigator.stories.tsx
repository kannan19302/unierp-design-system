import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StagePathNavigator } from "./stage-path-navigator";

const meta: Meta<typeof StagePathNavigator> = {
  title: "Navigation/StagePathNavigator",
  component: StagePathNavigator,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StagePathNavigator>;

const sampleStages = [
  { id: "prospect", label: "Prospecting", status: "completed" as const },
  { id: "qualification", label: "Qualification", status: "completed" as const },
  { id: "proposal", label: "Proposal / Quote", status: "current" as const },
  { id: "negotiation", label: "Negotiation", status: "upcoming" as const },
  { id: "closed", label: "Closed Won", status: "upcoming" as const },
];

export const Default: Story = {
  args: {
    stages: sampleStages,
    activeStageId: "proposal",
    actionLabel: "Mark Stage as Complete",
    density: "standard",
  },
};

export const Compact: Story = {
  args: {
    stages: sampleStages,
    activeStageId: "proposal",
    actionLabel: "Advance",
    density: "compact",
  },
};
