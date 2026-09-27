import type { Meta, StoryObj } from "@storybook/react";
import { Stepper, Steps } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Compositions/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    current: {
      control: "number",
      description: "Active step index (0-based).",
    },
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
    density: "standard",
    steps: sampleSteps,
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact Density (20px indicator)</h4>
        <Steps current={1} density="ultra-compact" steps={sampleSteps} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact Density (24px indicator)</h4>
        <Steps current={1} density="compact" steps={sampleSteps} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Density (28px indicator)</h4>
        <Steps current={1} density="standard" steps={sampleSteps} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable Density (36px indicator)</h4>
        <Steps current={1} density="comfortable" steps={sampleSteps} />
      </div>
    </div>
  ),
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
