import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DrillDownModal } from "./drill-down-modal";

const columns = [
  { key: "code", label: "Invoice Code" },
  { key: "tenant", label: "Tenant / Client" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount (USD)" },
];

const sampleRows = [
  { code: "INV-901", tenant: "Acme Logistics", status: "Paid", amount: "$14,200" },
  { code: "INV-902", tenant: "Apex Aerospace", status: "Pending", amount: "$8,500" },
  { code: "INV-903", tenant: "Cyberdyne Systems", status: "Overdue", amount: "$22,100" },
];

const meta: Meta<typeof DrillDownModal> = {
  title: "Dashboard/DrillDownModal",
  component: DrillDownModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof DrillDownModal>;

export const Default: Story = {
  render: () => (
    <DrillDownModal
      isOpen={true}
      onClose={() => {}}
      title="Unpaid Accounts Receivable"
      columns={columns}
      rows={sampleRows}
    />
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <DrillDownModal
      isOpen={true}
      onClose={() => {}}
      title="Audit Trail Entries"
      columns={[
        { key: "id", label: "Event ID" },
        { key: "user", label: "Operator" },
        { key: "action", label: "Action" },
      ]}
      rows={[
        { id: "EVT-01", user: "j.doe@unierp.com", action: "POST_LEDGER" },
        { id: "EVT-02", user: "a.smith@unierp.com", action: "APPROVE_PO" },
      ]}
    />
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <DrillDownModal
        isOpen={true}
        onClose={() => {}}
        title="Empty Result Drill-down"
        columns={columns}
        rows={[]}
      />
    </div>
  ),
};
