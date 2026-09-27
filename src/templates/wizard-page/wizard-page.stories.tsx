import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepWizard } from "./wizard-page";

/**
 * `<MultiStepWizard>` organizes multi-stage transaction workflows into sequential steps
 * with progress indicators, descriptive headers, and integrated step navigation.
 */
const meta: Meta<typeof MultiStepWizard> = {
  title: "Templates/MultiStepWizard",
  component: MultiStepWizard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Enterprise multi-step wizard component featuring accessible progress navigation, step indicator states, and controlled or uncontrolled stage switching.",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    currentStep: {
      control: { type: "number", min: 0, max: 2 },
      description: "Active wizard step index.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiStepWizard>;

const sampleSteps = [
  { id: "1", title: "Customer Account", description: "Select master debtor" },
  { id: "2", title: "Payment Terms", description: "Net 30 / EOM" },
  { id: "3", title: "Credit Limit", description: "Set exposure limit" },
];

export const Default: Story = {
  args: {
    steps: sampleSteps,
  },
};

export const MiddleStep: Story = {
  args: {
    steps: sampleSteps,
    currentStep: 1,
  },
};

export const FinalStep: Story = {
  args: {
    steps: sampleSteps,
    currentStep: 2,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", inlineSize: 680 }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Initial Step (First / Step 1)
        </h4>
        <MultiStepWizard steps={sampleSteps} currentStep={0} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Progressed Step (Step 2 Active)
        </h4>
        <MultiStepWizard steps={sampleSteps} currentStep={1} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Final Step (Step 3 / Ready to Complete)
        </h4>
        <MultiStepWizard steps={sampleSteps} currentStep={2} />
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  name: "Density scale comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", inlineSize: 680 }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3)" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBlockEnd: "var(--space-2)" }}>
            Density: {density}
          </div>
          <MultiStepWizard
            density={density}
            steps={sampleSteps}
            currentStep={1}
          />
        </div>
      ))}
    </div>
  ),
};
