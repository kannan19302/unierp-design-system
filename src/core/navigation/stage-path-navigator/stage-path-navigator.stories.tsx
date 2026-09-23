import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StagePathNavigator } from "./stage-path-navigator";

const meta: Meta<typeof StagePathNavigator> = {
  title: "Core/Navigation/StagePathNavigator",
  component: StagePathNavigator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Stage Path</p>
        <StagePathNavigator
          stages={sampleStages}
          activeStageId="proposal"
          actionLabel="Mark Stage as Complete"
          onActionClick={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Read-Only Milestone Indicator</p>
        <StagePathNavigator
          stages={sampleStages}
          activeStageId="qualification"
          actionLabel=""
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <StagePathNavigator stages={sampleStages} activeStageId="prospect" density="ultra-compact" />
      <StagePathNavigator stages={sampleStages} activeStageId="qualification" density="compact" />
      <StagePathNavigator stages={sampleStages} activeStageId="proposal" density="standard" />
      <StagePathNavigator stages={sampleStages} activeStageId="closed" density="comfortable" />
    </div>
  ),
};
