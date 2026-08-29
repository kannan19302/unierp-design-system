import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect } from "./multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Inputs/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  args: {
    value: ["NY", "CA"],
    options: [
      { value: "NY", label: "New York Hub" },
      { value: "CA", label: "California Hub" },
      { value: "TX", label: "Texas Hub" },
      { value: "FL", label: "Florida Hub" },
      { value: "IL", label: "Illinois Hub" },
    ],
  },
};
