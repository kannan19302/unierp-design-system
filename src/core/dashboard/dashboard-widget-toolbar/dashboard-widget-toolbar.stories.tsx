import type { Meta, StoryObj } from "@storybook/react";
import { DashboardWidgetToolbar } from "./dashboard-widget-toolbar";

const meta: Meta<typeof DashboardWidgetToolbar> = {
  title: "Core/Dashboard/DashboardWidgetToolbar",
  component: DashboardWidgetToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardWidgetToolbar>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 600, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <DashboardWidgetToolbar
        title="Revenue by Region"
        lastUpdated="2 min ago"
        onRefresh={() => {}}
        onExpand={() => {}}
        onExport={() => {}}
        onEdit={() => {}}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <DashboardWidgetToolbar
        title="Active User Sessions"
        lastUpdated="Live streaming"
        onRefresh={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Full Controls (Refresh, Expand, Export, Edit)
        </h4>
        <DashboardWidgetToolbar
          title="General Ledger Reconciliation"
          lastUpdated="Today, 08:30"
          onRefresh={() => {}}
          onExpand={() => {}}
          onExport={() => {}}
          onEdit={() => {}}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Minimal (No Action Buttons)
        </h4>
        <DashboardWidgetToolbar
          title="Static Executive Briefing"
          lastUpdated="Quarterly Closing"
        />
      </div>
    </div>
  ),
};
