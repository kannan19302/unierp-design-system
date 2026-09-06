import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GuidedFlowStepNavigator } from "./guided-flow-step-navigator";

const meta: Meta<typeof GuidedFlowStepNavigator> = {
  title: "Navigation/GuidedFlowStepNavigator",
  component: GuidedFlowStepNavigator,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof GuidedFlowStepNavigator>;

const sampleSteps = [
  {
    id: "step1",
    title: "Subsidiary Corporate Details",
    description: "Legal entity name, tax ID, and registered jurisdiction",
    status: "completed" as const,
    timeEstimate: "2 mins",
  },
  {
    id: "step2",
    title: "Chart of Accounts Mapping",
    description: "Standardize GL accounts across ERP partitions",
    status: "in-progress" as const,
    timeEstimate: "5 mins",
  },
  {
    id: "step3",
    title: "Multi-Jurisdiction VAT Configuration",
    description: "Configure reverse-charge VAT rules and digital tax engine",
    status: "error" as const,
    errorCount: 2,
    timeEstimate: "4 mins",
  },
  {
    id: "step4",
    title: "Final Review & Subsidiary Activation",
    description: "Audit trail sign-off and dual-controller authorization",
    status: "locked" as const,
    timeEstimate: "1 min",
  },
];

export const Default: Story = {
  args: {
    steps: sampleSteps,
    activeStepId: "step2",
    title: "Subsidiary Onboarding Flow",
    density: "standard",
    onStepClick: (id) => alert(`Step clicked: ${id}`),
  },
};

export const Compact: Story = {
  args: {
    steps: sampleSteps,
    activeStepId: "step3",
    title: "VAT Setup",
    density: "compact",
  },
};
