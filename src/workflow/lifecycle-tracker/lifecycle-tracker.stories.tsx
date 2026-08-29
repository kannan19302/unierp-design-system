import type { Meta, StoryObj } from "@storybook/react";
import { LifecycleTracker, type LifecycleStage } from "./lifecycle-tracker";

const meta: Meta<typeof LifecycleTracker> = {
  title: "Workflow/LifecycleTracker",
  component: LifecycleTracker,
  parameters: {
    layout: "padded",
  },
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
