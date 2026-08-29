import type { Meta, StoryObj } from "@storybook/react";
import { HealthScore } from "./health-score";

const meta: Meta<typeof HealthScore> = {
  title: "Primitives/HealthScore",
  component: HealthScore,
  tags: ["autodocs"],
  argTypes: {
    score: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HealthScore>;

export const Good: Story = {
  args: { score: 95 },
};

export const Fair: Story = {
  args: { score: 65 },
};

export const Poor: Story = {
  args: { score: 32 },
};
