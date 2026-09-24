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

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "540px" }}>
      <div>
        <BannerAlert severity="info" title="Informational Notice">
          Scheduled multi-region ledger sync will occur at 02:00 UTC.
        </BannerAlert>
      </div>
      <div>
        <BannerAlert severity="success" title="Reconciliation Completed">
          All 1,420 transaction lines matched across primary and secondary ledgers.
        </BannerAlert>
      </div>
      <div>
        <BannerAlert severity="warning" title="Approvals Pending">
          Two disbursements exceed standard manager authorization limits.
        </BannerAlert>
      </div>
      <div>
        <BannerAlert severity="danger" title="Fiscal Period Closed">
          FY2026-Q1 is locked. Adjustments require controller override authorization.
        </BannerAlert>
      </div>
    </div>
  ),
};
