import type { Meta, StoryObj } from "@storybook/react";
import { SplitMasterDetailTemplate } from "./split-master-detail-template";
import { Button } from "../../primitives/button";

/**
 * `<SplitMasterDetailTemplate>` provides a two-pane layout for high-throughput operational review,
 * pairing a scrollable master entity list on the left with a comprehensive detail pane on the right.
 */
const meta: Meta<typeof SplitMasterDetailTemplate> = {
  title: "Core/Layout/SplitMasterDetailTemplate",
  component: SplitMasterDetailTemplate,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Two-pane split screen template providing master collection navigation alongside immediate record detail inspection.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SplitMasterDetailTemplate>;

export const Default: Story = {
  args: {
    masterTitle: "Suppliers (1,248)",
    masterToolbar: <Button variant="secondary" size="sm">+ New Supplier</Button>,
    masterList: (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "var(--space-2)" }}>
        <div style={{ padding: "var(--space-3)", background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontWeight: 600 }}>Acme Global Logistics</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>ID: SUP-001 • Tier 1</div>
        </div>
        <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontWeight: 600 }}>Apex Component Works</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>ID: SUP-002 • Tier 2</div>
        </div>
      </div>
    ),
    detailHeader: <h3 style={{ margin: 0 }}>Acme Global Logistics</h3>,
    detailBody: (
      <div style={{ padding: "var(--space-4)" }}>
        <p>Comprehensive supplier profile, compliance certifications, and active procurement contracts.</p>
      </div>
    ),
  },
};

export const EmptyDetail: Story = {
  args: {
    masterTitle: "Invoices (42)",
    masterList: (
      <div style={{ padding: "var(--space-3)", color: "var(--color-fg-muted)", fontSize: "var(--text-sm)" }}>
        42 invoices awaiting review
      </div>
    ),
    isDetailEmpty: true,
    emptyDetailMessage: "Select an invoice from the list to preview details and line items.",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Populated Master Detail Workspace
        </h4>
        <div style={{ border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", height: 320, overflow: "hidden" }}>
          <SplitMasterDetailTemplate
            masterTitle="Partners (28)"
            masterList={<div style={{ padding: "var(--space-3)" }}>Apex Partners LLC</div>}
            detailHeader={<h4 style={{ margin: 0 }}>Apex Partners LLC</h4>}
            detailBody={<div style={{ padding: "var(--space-4)" }}>Partner details pane</div>}
          />
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Empty Selection State
        </h4>
        <div style={{ border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", height: 240, overflow: "hidden" }}>
          <SplitMasterDetailTemplate
            masterTitle="Partners (28)"
            isDetailEmpty
            emptyDetailMessage="Select a partner from the sidebar to inspect records."
          />
        </div>
      </div>
    </div>
  ),
};
