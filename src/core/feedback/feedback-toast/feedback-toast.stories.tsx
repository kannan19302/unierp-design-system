import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackToast } from "./feedback-toast";

const meta: Meta<typeof FeedbackToast> = {
  title: "Core/Feedback/FeedbackToast",
  component: FeedbackToast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeedbackToast>;

export const Success: Story = {
  args: {
    type: "success",
    message: "Purchase order #PO-9021 created",
    description: "Sent to finance for approval.",
    actionLabel: "View Order",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    message: "Failed to post journal entry",
    description: "Ledger account 1010-USD has insufficient liquidity.",
    actionLabel: "Retry",
  },
};
