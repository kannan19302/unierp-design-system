import type { Meta, StoryObj } from "@storybook/react";
import { EntityLineage, type LineageItem } from "./entity-lineage";

const sampleLineage: LineageItem[] = [
  {
    id: "l1",
    documentType: "Purchase Requisition",
    documentNumber: "PR-2026-0042",
    date: "Aug 10, 2026",
    amount: "$12,400",
    status: "approved",
  },
  {
    id: "l2",
    documentType: "Purchase Order",
    documentNumber: "PO-2026-0189",
    date: "Aug 12, 2026",
    amount: "$12,400",
    status: "approved",
  },
  {
    id: "l3",
    documentType: "Goods Receipt Note",
    documentNumber: "GRN-2026-0091",
    date: "Aug 18, 2026",
    status: "completed",
  },
  {
    id: "l4",
    documentType: "Vendor Invoice",
    documentNumber: "INV-99214",
    date: "Aug 22, 2026",
    amount: "$12,400",
    status: "pending",
    isCurrent: true,
  },
  {
    id: "l5",
    documentType: "Payment Voucher",
    documentNumber: "PV-PENDING",
    status: "draft",
  },
];

const meta: Meta<typeof EntityLineage> = {
  title: "Core/Workflow/EntityLineage",
  component: EntityLineage,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EntityLineage>;

export const ProcureToPayLineage: Story = {
  args: {
    items: sampleLineage,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Document Chain Audit Trail</h4>
        <EntityLineage items={sampleLineage} />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Full Procure-to-Pay Sequence</h4>
        <EntityLineage items={sampleLineage} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Truncated 2-Step Chain</h4>
        <EntityLineage items={sampleLineage.slice(0, 2)} />
      </div>
    </div>
  ),
};
