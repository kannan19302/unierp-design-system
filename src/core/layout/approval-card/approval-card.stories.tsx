import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalCard } from "./approval-card";

/**
 * `<ApprovalCard>` displays pending workflow approval requests with clear expenditure metadata,
 * requester identification, and approve/reject call-to-actions.
 */
const meta: Meta<typeof ApprovalCard> = {
  title: "Core/Layout/ApprovalCard",
  component: ApprovalCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Workflow approval card for authorization pipelines, showing requester, department, total amounts, and action controls.",
      },
    },
  },
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

export const Loading: Story = {
  args: {
    requestTitle: "Vendor Contract Renewal: Cloud Security Suite",
    requesterName: "Elena Rostova (SecOps)",
    amount: "$124,000.00 USD",
    department: "Information Security",
    isLoading: true,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 440 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Pending State
        </h4>
        <ApprovalCard
          requestTitle="Software License: Enterprise Figma 50 Seats"
          requesterName="Alex Morgan (Design Systems)"
          amount="$22,500.00 USD"
          department="Product Design"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Processing / Submitting State
        </h4>
        <ApprovalCard
          requestTitle="Q3 Marketing Campaign Budget Expansion"
          requesterName="Claire Vance (Demand Gen)"
          amount="$50,000.00 USD"
          department="Marketing"
          isLoading
        />
      </div>
    </div>
  ),
};
