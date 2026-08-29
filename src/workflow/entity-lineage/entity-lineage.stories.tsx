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
  title: "Workflow/EntityLineage",
  component: EntityLineage,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EntityLineage>;

export const ProcureToPayLineage: Story = {
  args: {
    items: sampleLineage,
  },
};
