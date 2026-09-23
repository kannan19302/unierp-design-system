import type { Meta, StoryObj } from "@storybook/react";
import { LifecycleTracker, type LifecycleStage } from "./lifecycle-tracker";

const meta: Meta<typeof LifecycleTracker> = {
  title: "Core/Workflow/LifecycleTracker",
  component: LifecycleTracker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LifecycleTracker>;

const sampleStages: LifecycleStage[] = [
  { id: "draft", name: "Draft", date: "Aug 20" },
  { id: "submitted", name: "Submitted", date: "Aug 22" },
  { id: "review", name: "Under Review", date: "Aug 25" },
  { id: "approved", name: "Approved" },
  { id: "executed", name: "Executed" },
];

export const InProgress: Story = {
  args: {
    stages: sampleStages,
    currentStageId: "review",
  },
};

export const Completed: Story = {
  args: {
    stages: sampleStages,
    currentStageId: "executed",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Lifecycle Tracker Progression</h4>
        <LifecycleTracker stages={sampleStages} currentStageId="review" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>In Progress (Review Stage)</h4>
        <LifecycleTracker stages={sampleStages} currentStageId="review" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Completed Lifecycle</h4>
        <LifecycleTracker stages={sampleStages} currentStageId="executed" />
      </div>
    </div>
  ),
};
