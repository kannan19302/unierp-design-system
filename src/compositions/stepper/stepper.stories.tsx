import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Core/Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const sampleSteps = [
  { title: "Company Profile", description: "Tax & Legal Info" },
  { title: "Chart of Accounts", description: "COA Structure" },
  { title: "Fiscal Calendar", description: "Periods & Quarters" },
  { title: "Verification", description: "Review & Activate" },
];

export const Default: Story = {
  args: {
    current: 1,
    steps: sampleSteps,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Interactive Progress Stepper</p>
        <Stepper
          current={2}
          steps={sampleSteps}
          onChange={(idx) => console.log("Step clicked:", idx)}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Initial Step</p>
        <Stepper
          current={0}
          steps={sampleSteps.slice(0, 3)}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Stepper current={0} steps={sampleSteps} />
      <Stepper current={1} steps={sampleSteps} />
      <Stepper current={2} steps={sampleSteps} />
      <Stepper current={3} steps={sampleSteps} />
    </div>
  ),
};
