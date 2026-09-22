import type { Meta, StoryObj } from "@storybook/react";
import { DetailLayout } from "./detail-layout";
import { PageHeader } from "../page-header";
import { Card } from "../../data-display/card";
import { RecordSidebar } from "../record-sidebar";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof DetailLayout> = {
  title: "Layout/DetailLayout",
  component: DetailLayout,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    header: { control: false },
    main: { control: false },
    sidebar: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof DetailLayout>;

export const AnatomyAndComposition: Story = {
  render: (args) => <DetailLayout {...args} />,
  args: {
    header: (
      <PageHeader
        title="Journal Entry #JV-2026-09"
        subtitle="FY2026 Q1 Reconciliation batch"
        badge={<Badge variant="warning">Under Review</Badge>}
        actions={<Button size="sm">Post Entry</Button>}
      />
    ),
    main: (
      <Card>
        <p style={{ margin: 0, padding: "16px", color: "var(--color-text-secondary)" }}>
          Tabular ledger lines, credit-debit verification, and double-entry balance check.
        </p>
      </Card>
    ),
    sidebar: (
      <RecordSidebar title="Batch Details">
        <p style={{ margin: 0, padding: "12px", color: "var(--color-text-muted)" }}>
          Approval status: Pending CFO sign-off.
        </p>
      </RecordSidebar>
    ),
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>Full Layout with Sidebar</h4>
        <DetailLayout
          header={
            <PageHeader
              title="Purchase Order #PO-4091"
              subtitle="Supplier: Global Logistics Corp"
              badge={<Badge variant="success">Approved</Badge>}
            />
          }
          main={
            <Card>
              <div style={{ padding: "16px" }}>Line items and delivery schedule breakdown.</div>
            </Card>
          }
          sidebar={
            <RecordSidebar title="Audit Trail">
              <div style={{ padding: "12px" }}>Created by John Doe at 09:30 AM</div>
            </RecordSidebar>
          }
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>Full-Width Layout (No Sidebar)</h4>
        <DetailLayout
          header={
            <PageHeader
              title="Consolidated Ledger Report"
              subtitle="Global Entities Aggregate"
            />
          }
          main={
            <Card>
              <div style={{ padding: "16px" }}>Comprehensive financial statement and ledger trail.</div>
            </Card>
          }
        />
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

