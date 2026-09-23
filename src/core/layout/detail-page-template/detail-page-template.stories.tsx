import type { Meta, StoryObj } from "@storybook/react";
import { DetailPageTemplate } from "./detail-page-template";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof DetailPageTemplate> = {
  title: "Core/Layout/DetailPageTemplate",
  component: DetailPageTemplate,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    tabs: { control: false },
    actions: { control: false },
    meta: { control: false },
    contextRail: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof DetailPageTemplate>;

const TABS = [
  {
    key: "overview",
    label: "Overview",
    content: (
      <div style={{ padding: "16px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 8px 0" }}>Enterprise Profile Overview</h4>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
          Primary account data, enterprise credit terms, billing cycles, and legal jurisdiction details.
        </p>
      </div>
    ),
  },
  {
    key: "activity",
    label: "Activity",
    count: 12,
    content: (
      <div style={{ padding: "16px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 8px 0" }}>Audit Activity Stream</h4>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
          12 ledger modifications and reconciliation sign-offs recorded in the current billing period.
        </p>
      </div>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    content: (
      <div style={{ padding: "16px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 8px 0" }}>Entity Configuration</h4>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
          Tax exemption IDs, auto-sweep threshold preferences, and notification routing webhooks.
        </p>
      </div>
    ),
  },
];

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ padding: "24px", background: "var(--color-bg-subtle)", minBlockSize: "100vh" }}>
      <DetailPageTemplate {...args} />
    </div>
  ),
  args: {
    title: "Acme Corporation",
    subtitle: "Enterprise customer since 2021 · Tier 1 Platinum SLA",
    backLabel: "Back to Customers",
    onBack: () => {},
    meta: <Badge variant="success">Active Tenant</Badge>,
    actions: (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="outline" size="sm">Export Ledger</Button>
        <Button size="sm">Edit Customer</Button>
      </div>
    ),
    tabs: TABS,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "24px", background: "var(--color-bg-subtle)" }}>
      <div>
        <h3 style={{ margin: "0 0 16px 0", color: "var(--color-text-primary)" }}>Standard Active State with Context Rail</h3>
        <DetailPageTemplate
          title="Invoice #INV-2026-901"
          subtitle="Issued to Horizon Holdings LLC"
          backLabel="Back to Invoices"
          onBack={() => {}}
          meta={<Badge variant="warning">Awaiting Approval</Badge>}
          actions={<Button size="sm">Review Invoice</Button>}
          tabs={TABS}
          contextRail={
            <div style={{ inlineSize: "260px", padding: "16px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontWeight: 600, marginBlockEnd: "8px" }}>Context Rail</div>
              <div style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>Related Purchase Orders & Contract Milestones</div>
            </div>
          }
        />
      </div>

      <div>
        <h3 style={{ margin: "0 0 16px 0", color: "var(--color-text-primary)" }}>Loading / Shimmer Skeleton State</h3>
        <DetailPageTemplate
          title="Synchronizing Ledger..."
          subtitle="Fetching multi-currency exchange rates"
          tabs={TABS}
          loading={true}
        />
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

