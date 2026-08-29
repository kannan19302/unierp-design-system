import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DrillDownModal } from "./drill-down-modal";

const DrillDownDemo = () => {
  const [open, setOpen] = useState(true);
  const columns = [
    { key: "code", label: "Invoice Code" },
    { key: "tenant", label: "Tenant / Client" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount (USD)" },
  ];
  const rows = [
    { code: "INV-901", tenant: "Acme Logistics", status: "Paid", amount: "$14,200" },
    { code: "INV-902", tenant: "Apex Aerospace", status: "Pending", amount: "$8,500" },
    { code: "INV-903", tenant: "Cyberdyne Systems", status: "Overdue", amount: "$22,100" },
  ];

  return (
    <div style={{ padding: "var(--space-4)" }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ padding: "var(--space-2) var(--space-4)", background: "var(--color-brand, #3b82f6)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
      >
        Open Drill-Down Modal
      </button>
      <DrillDownModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Unpaid Accounts Receivable"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

const meta: Meta = {
  title: "Dashboard/DrillDownModal",
  component: DrillDownDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <DrillDownDemo />,
};
