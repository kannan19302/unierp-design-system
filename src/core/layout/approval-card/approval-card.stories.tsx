import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalCard } from "./approval-card";

const meta: Meta<typeof ApprovalCard> = {
  title: "Core/Layout/ApprovalCard",
  component: ApprovalCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ApprovalCard>;

export const Default: Story = {
  args: {
    requestTitle: "Hardware Acquisition: 10x Dell PowerEdge R760",
    requesterName: "Marcus Brody (IT Infrastructure)",
    amount: "$78,200.00 USD",
    department: "Information Technology",
  },
};
