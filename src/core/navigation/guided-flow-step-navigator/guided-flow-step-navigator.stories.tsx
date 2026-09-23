import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GuidedFlowStepNavigator } from "./guided-flow-step-navigator";

const meta: Meta<typeof GuidedFlowStepNavigator> = {
  title: "Core/Navigation/GuidedFlowStepNavigator",
  component: GuidedFlowStepNavigator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
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
    onStepClick: (id) => console.log(`Step clicked: ${id}`),
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard 4-Step Onboarding Flow</p>
        <GuidedFlowStepNavigator
          steps={sampleSteps}
          activeStepId="step2"
          density="standard"
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>All Completed Flow</p>
        <GuidedFlowStepNavigator
          steps={sampleSteps.map((s) => ({ ...s, status: "completed" as const }))}
          activeStepId="step4"
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <GuidedFlowStepNavigator
        steps={sampleSteps}
        activeStepId="step1"
        density="ultra-compact"
      />
      <GuidedFlowStepNavigator
        steps={sampleSteps}
        activeStepId="step2"
        density="compact"
      />
      <GuidedFlowStepNavigator
        steps={sampleSteps}
        activeStepId="step3"
        density="standard"
      />
      <GuidedFlowStepNavigator
        steps={sampleSteps}
        activeStepId="step4"
        density="comfortable"
      />
    </div>
  ),
};
