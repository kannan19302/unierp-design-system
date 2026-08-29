import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    current: 1,
    steps: [
      { title: "Company Profile", description: "Tax & Legal Info" },
      { title: "Chart of Accounts", description: "COA Structure" },
      { title: "Fiscal Calendar", description: "Periods & Quarters" },
      { title: "Verification", description: "Review & Activate" },
    ],
  },
};
