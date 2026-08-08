import type { Meta, StoryObj } from "@storybook/react";
import {
  PageHeader,
  FilterBar,
  SavedViewSwitcher,
  BulkActionBar,
  DetailLayout,
  ApprovalTimeline,
  AuditTrailPanel,
  RecordSidebar,
  PrintLayout,
} from "./enterprise-patterns";

const meta: Meta = {
  title: "Components/EnterprisePatterns",
};

export default meta;

export const DefaultHeader: StoryObj = {
  render: () => (
    <PageHeader
      title="Purchase Orders"
      subtitle="Manage vendor purchase orders and approvals"
      breadcrumbs={[{ label: "Procurement", href: "#" }, { label: "Purchase Orders" }]}
    />
  ),
};

export const DefaultFilterBar: StoryObj = {
  render: () => (
    <FilterBar onClearAll={() => alert("Cleared")}>
      <span>Status: Open</span>
    </FilterBar>
  ),
};

export const DefaultSavedViewSwitcher: StoryObj = {
  render: () => (
    <SavedViewSwitcher
      views={[{ id: "v1", name: "All Orders" }, { id: "v2", name: "Pending Approval" }]}
      activeViewId="v1"
      onSelectView={(id) => alert(id)}
    />
  ),
};

export const DefaultBulkActionBar: StoryObj = {
  render: () => (
    <BulkActionBar
      selectedCount={3}
      actions={<button style={{ padding: "4px 8px" }}>Approve Selected</button>}
    />
  ),
};

export const DefaultDetailLayout: StoryObj = {
  render: () => (
    <DetailLayout
      header={<h1>PO-2026-001</h1>}
      main={<div>Order Details Main Content</div>}
      sidebar={<RecordSidebar title="Metadata"><div>Created 2026-08-08</div></RecordSidebar>}
    />
  ),
};

export const DefaultApprovalTimeline: StoryObj = {
  render: () => (
    <ApprovalTimeline
      steps={[
        { id: "1", approver: "Alice", status: "approved", timestamp: "10:00 AM" },
        { id: "2", approver: "Bob", status: "pending" },
      ]}
    />
  ),
};

export const DefaultAuditTrailPanel: StoryObj = {
  render: () => (
    <AuditTrailPanel
      logs={[
        { id: "1", action: "created order", user: "Alice", time: "10:00 AM" },
      ]}
    />
  ),
};

export const DefaultPrintLayout: StoryObj = {
  render: () => (
    <PrintLayout>
      <div>Printable document content</div>
    </PrintLayout>
  ),
};
