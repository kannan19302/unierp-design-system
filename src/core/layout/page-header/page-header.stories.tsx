import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Button } from "../../primitives/button";
import { Badge } from "../../primitives/badge";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const AnatomyAndComposition: Story = {
  render: (args) => <PageHeader {...args} />,
  args: {
    title: "General Ledger Journal",
    subtitle: "Manage, verify, and post financial transaction batches for FY2026.",
    badge: <Badge variant="success">Batch Active</Badge>,
    breadcrumbs: [
      { label: "Finance", href: "#" },
      { label: "Ledger", href: "#" },
      { label: "Vouchers" },
    ],
    actions: (
      <>
        <Button variant="outline" size="sm">Export Batch</Button>
        <Button size="sm">New Voucher</Button>
      </>
    ),
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "16px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>Full Header with Breadcrumbs & Badge</h4>
        <PageHeader
          title="Purchase Order #PO-2026-891"
          subtitle="Vendor: Apex Industrial Components LLC"
          badge={<Badge variant="warning">Awaiting Approval</Badge>}
          breadcrumbs={[
            { label: "Procurement", href: "#" },
            { label: "Purchase Orders", href: "#" },
            { label: "PO-2026-891" },
          ]}
          actions={
            <div style={{ display: "flex", gap: "8px" }}>
              <Button variant="outline" size="sm">Reject</Button>
              <Button size="sm">Approve Order</Button>
            </div>
          }
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>Minimal Header (Title & Description only)</h4>
        <PageHeader
          title="Tax Configuration"
          description="Jurisdiction rules, VAT/GST schedules, and withholding rates."
        />
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

