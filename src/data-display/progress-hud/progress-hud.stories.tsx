import type { Meta, StoryObj } from "@storybook/react";
import { ProgressHUD } from "./progress-hud";

const meta: Meta<typeof ProgressHUD> = {
  title: "DASHBOARD/ProgressHUD",
  component: ProgressHUD,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressHUD>;

export const InProgress: Story = {
  args: {
    percentComplete: 60,
    title: "Setup Checklist",
    items: [
      { key: "1", label: "Verify Company Details", isCompleted: true },
      { key: "2", label: "Add First Bank Account", isCompleted: true },
      { key: "3", label: "Invite Team Members", isCompleted: false, actionLabel: "Invite" },
      { key: "4", label: "Connect Payment Gateway", isCompleted: false, actionLabel: "Connect" },
    ],
  },
};

export const Complete: Story = {
  args: {
    percentComplete: 100,
    title: "Setup Complete",
    items: [
      { key: "1", label: "Verify Company Details", isCompleted: true },
      { key: "2", label: "Add First Bank Account", isCompleted: true },
    ],
  },
};
