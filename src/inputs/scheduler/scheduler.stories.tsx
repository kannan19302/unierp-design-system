import type { Meta, StoryObj } from "@storybook/react";
import { Scheduler } from "./scheduler";

const meta: Meta<typeof Scheduler> = {
  title: "INPUTS/Scheduler",
  component: Scheduler,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Scheduler>;

export const Default: Story = {
  args: {
    events: [
      { id: "1", title: "Daily Standup", startHour: 9 },
      { id: "2", title: "Quarterly Financial Review", startHour: 14 },
    ],
  },
};
