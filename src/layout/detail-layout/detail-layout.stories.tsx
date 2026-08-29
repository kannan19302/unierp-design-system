import type { Meta, StoryObj } from "@storybook/react";
import { DetailLayout } from "./detail-layout";
import { PageHeader } from "../page-header";
import { Card } from "../../data-display/card";
import { RecordSidebar } from "../record-sidebar";

const meta: Meta<typeof DetailLayout> = {
  title: "Layout/DetailLayout",
  component: DetailLayout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DetailLayout>;

export const Default: Story = {
  args: {
    header: <PageHeader title="Journal Entry #JV-2026-09" subtitle="FY2026 Q1 Reconciliation batch" />,
    main: (
      <Card>
        <p>Main tabular voucher lines and ledger reconciliation breakdown.</p>
      </Card>
    ),
    sidebar: (
      <RecordSidebar title="Batch Status">
        <p>Approval status: Pending CFO sign-off.</p>
      </RecordSidebar>
    ),
  },
};
