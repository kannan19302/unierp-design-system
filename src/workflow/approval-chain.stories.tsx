import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalChain, type ApprovalStep } from "./approval-chain";

const meta: Meta<typeof ApprovalChain> = {
  title: "Workflow/ApprovalChain",
  component: ApprovalChain,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ApprovalChain>;

const sampleSteps: ApprovalStep[] = [
  {
    id: "step-1",
    title: "1. Department Head Sign-off",
    description: "Requires approval from Engineering Lead.",
    status: "approved",
    approvers: [
      {
        id: "u1",
        name: "Alex Rivera",
        role: "VP Engineering",
        status: "approved",
        decidedAt: "Today, 09:30 AM",
        comment: "Budget allocation verified under Q3 dev operations.",
      },
    ],
  },
  {
    id: "step-2",
    title: "2. Finance & Procurement Review",
    description: "Quorum: At least 2 of 3 authorized finance officers must sign.",
    status: "pending",
    quorum: 2,
    slaDeadline: "Due in 4 hours",
    canApprove: true,
    approvers: [
      {
        id: "u2",
        name: "Sarah Chen",
        role: "Finance Director",
        status: "approved",
        decidedAt: "Today, 11:15 AM",
      },
      {
        id: "u3",
        name: "Marcus Vance",
        role: "Controller",
        status: "pending",
      },
      {
        id: "u4",
        name: "Elena Rostova",
        role: "CFO",
        status: "pending",
      },
    ],
  },
  {
    id: "step-3",
    title: "3. Legal Compliance & Risk",
    description: "Final vendor risk evaluation and NDA validation.",
    status: "pending",
    approvers: [
      {
        id: "u5",
        name: "David Sterling",
        role: "General Counsel",
        status: "pending",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    steps: sampleSteps,
  },
};

export const LoadingState: Story = {
  args: {
    steps: sampleSteps,
    loading: true,
  },
};
