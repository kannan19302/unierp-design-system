import type { Meta, StoryObj } from "@storybook/react";
import { BannerAlert } from "./banner-alert";

const meta: Meta<typeof BannerAlert> = {
  title: "Core/Feedback/BannerAlert",
  component: BannerAlert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BannerAlert>;

export const Info: Story = {
  args: {
    severity: "info",
    title: "Maintenance Scheduled",
    children: "System upgrade in progress from 02:00 to 04:00 UTC.",
  },
};

export const Warning: Story = {
  args: {
    severity: "warning",
    title: "Unsaved Changes",
    children: "Your invoice draft has not been saved.",
  },
};
