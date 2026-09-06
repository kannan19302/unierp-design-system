import type { Meta, StoryObj } from "@storybook/react";
import { ClinicalTrialCohortRandomizer } from "./clinical-trial-cohort-randomizer";

const meta: Meta<typeof ClinicalTrialCohortRandomizer> = {
  title: "Workflow/ClinicalTrialCohortRandomizer",
  component: ClinicalTrialCohortRandomizer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClinicalTrialCohortRandomizer>;

const mockProtocol = {
  protocolId: "ONC-2026-PHASE-3",
  studyTitle: "Phase III Evaluation of CDK4/6 Inhibitor in Advanced Solid Tumors",
  blinding: "DOUBLE_BLIND" as const,
  targetEnrollment: 400,
  randomizationRatio: "1:1",
  activeArms: [
    {
      armId: "ARM-A",
      armName: "Arm A - CDK4/6 Oral Capsule (100mg)",
      enrolledCount: 148,
    },
    {
      armId: "ARM-B",
      armName: "Arm B - Matched Placebo Control",
      enrolledCount: 146,
    },
  ],
};

export const Default: Story = {
  args: {
    protocol: mockProtocol,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    protocol: mockProtocol,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    protocol: mockProtocol,
    density: "comfortable",
  },
};
