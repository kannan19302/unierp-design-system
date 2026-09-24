import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepWizard } from "./multi-step-wizard";

/**
 * `<MultiStepWizard>` organizes multi-stage transaction workflows into sequential steps
 * with progress indicators, descriptive headers, and integrated step navigation.
 */
const meta: Meta<typeof MultiStepWizard> = {
  title: "Core/Layout/MultiStepWizard",
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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", width: 680 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Initial Step (First / Step 1)
        </h4>
        <MultiStepWizard steps={sampleSteps} currentStep={0} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Progressed Step (Step 2 Active)
        </h4>
        <MultiStepWizard steps={sampleSteps} currentStep={1} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Final Step (Step 3 / Ready to Complete)
        </h4>
        <MultiStepWizard steps={sampleSteps} currentStep={2} />
      </div>
    </div>
  ),
};
