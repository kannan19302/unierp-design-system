import type { Meta, StoryObj } from "@storybook/react";
import { TrialCountdown } from "./trial-countdown";

const meta: Meta<typeof TrialCountdown> = {
  title: "COMPONENTS/TrialCountdown",
  component: TrialCountdown,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof TrialCountdown>;

export const Active: Story = {
  args: {
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const Expired: Story = {
  args: {
    endsAt: new Date(Date.now() - 1000).toISOString(),
  },
};
