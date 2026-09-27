import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalChain, type ApprovalStep } from "./approval-chain";

const meta: Meta<typeof ApprovalChain> = {
  title: "Compositions/ApprovalChain",
  component: ApprovalChain,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata density tier for compact audit display versus spacious executive workflows.",
    },
    loading: {
      control: "boolean",
      description: "Whether pending mutation states disable action buttons.",
    },
    onApprove: { action: "approved" },
    onReject: { action: "rejected" },
    onDelegate: { action: "delegated" },
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
    density: "standard",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    steps: sampleSteps,
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", maxInlineSize: "720px" }}>
      <ApprovalChain {...args} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (24px nodes)</h4>
        <ApprovalChain steps={sampleSteps.slice(0, 2)} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (28px nodes)</h4>
        <ApprovalChain steps={sampleSteps.slice(0, 2)} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (32px nodes)</h4>
        <ApprovalChain steps={sampleSteps.slice(0, 2)} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (40px nodes)</h4>
        <ApprovalChain steps={sampleSteps.slice(0, 2)} density="comfortable" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Active Review Process</h4>
        <ApprovalChain steps={sampleSteps} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Rejected / Escalated Chain</h4>
        <ApprovalChain
          steps={[
            {
              id: "step-rej",
              title: "Security & Infosec Review",
              description: "SOC2 Compliance gate rejected due to open vulnerability tickets.",
              status: "rejected",
              approvers: [
                {
                  id: "u-sec",
                  name: "Vikram Malhotra",
                  role: "Head of Infosec",
                  status: "rejected",
                  comment: "Critical unpatched CVE detected in third-party library.",
                },
              ],
            },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Loading State</h4>
        <ApprovalChain steps={sampleSteps} loading />
      </div>
    </div>
  ),
};
