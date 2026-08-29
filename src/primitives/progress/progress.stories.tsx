import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "COMPONENTS/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Quarter: Story = {
  args: {
    value: 25,
    max: 100,
  },
};

export const Half: Story = {
  args: {
    value: 50,
    max: 100,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    max: 100,
  },
};
