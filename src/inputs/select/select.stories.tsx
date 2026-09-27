import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "Inputs/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: "Country",
    options: [
      { label: "United States", value: "US" },
      { label: "United Kingdom", value: "UK" },
      { label: "Germany", value: "DE" },
    ],
  },
};
