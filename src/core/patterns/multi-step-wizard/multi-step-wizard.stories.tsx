import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepWizard } from "./multi-step-wizard";

const meta: Meta<typeof MultiStepWizard> = {
  title: "Core/Patterns/MultiStepWizard",
  component: MultiStepWizard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MultiStepWizard>;

export const Default: Story = {
  args: {
    steps: [
      { id: "1", title: "Customer Account", description: "Select master debtor" },
      { id: "2", title: "Payment Terms", description: "Net 30 / EOM" },
      { id: "3", title: "Credit Limit", description: "Set exposure limit" },
    ],
  },
};
