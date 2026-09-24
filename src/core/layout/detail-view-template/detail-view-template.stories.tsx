import type { Meta, StoryObj } from "@storybook/react";
import { DetailViewTemplate } from "./detail-view-template";
import { Button } from "../../primitives/button";
import { Badge } from "../../primitives/badge";

/**
 * `<DetailViewTemplate>` provides a standardized enterprise master entity view layout
 * with breadcrumb hierarchy, title row, action bar, optional KPI stats bar, primary content panel, and contextual sidebar.
 */
const meta: Meta<typeof DetailViewTemplate> = {
  title: "Core/Layout/DetailViewTemplate",
  component: DetailViewTemplate,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standard enterprise master-entity detail floorplan featuring identity breadcrumbs, status badges, contextual KPI bar, main workspace, and right-hand metadata sidebar.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DetailViewTemplate>;

export const Default: Story = {
  args: {
    entityType: "Customer Account",
    title: "Acme Industrial Logistics Inc.",
    identifier: "CUST-90214",
    statusBadge: <Badge variant="success">Active Partner</Badge>,
    headerActions: (
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button variant="secondary" size="sm">Export Dossier</Button>
        <Button variant="primary" size="sm">Edit Account</Button>
      </div>
    ),
    mainContent: (
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-base)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
        Main entity workspace content (orders, open invoices, contract agreements)
      </div>
    ),
    sidebarContent: (
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-base)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
        Audit timeline and primary account contacts
      </div>
    ),
  },
};

export const WithStatsBar: Story = {
  args: {
    ...Default.args,
    statsBar: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-3)", padding: "var(--space-3)", background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)" }}>
        <div><div style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>Total ARR</div><div style={{ fontWeight: 600 }}>$1,240,000</div></div>
        <div><div style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>Open Tickets</div><div style={{ fontWeight: 600 }}>3 Pending</div></div>
        <div><div style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>Contract Renewal</div><div style={{ fontWeight: 600 }}>Dec 2026</div></div>
        <div><div style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>Health Score</div><div style={{ fontWeight: 600, color: "var(--color-success-fg)" }}>98% (Optimal)</div></div>
      </div>
    ),
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Full Layout with Stats & Actions
        </h4>
        <div style={{ border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <DetailViewTemplate
            entityType="Vendor"
            title="Global Logistics Express"
            identifier="VND-4820"
            statusBadge={<Badge variant="default">Verified Vendor</Badge>}
            statsBar={
              <div style={{ padding: "var(--space-2) var(--space-4)", background: "var(--color-surface-sunken)", fontSize: "var(--text-xs)" }}>
                Spend YTD: $450,200 | Reliability: 99.4%
              </div>
            }
            mainContent={<div style={{ padding: "var(--space-4)" }}>Vendor contracts & logistics schedule</div>}
            sidebarContent={<div style={{ padding: "var(--space-4)" }}>Primary vendor representative</div>}
          />
        </div>
      </div>
    </div>
  ),
};
