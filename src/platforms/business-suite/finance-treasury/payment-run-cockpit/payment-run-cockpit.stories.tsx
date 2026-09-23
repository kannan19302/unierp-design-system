import type { Meta, StoryObj } from "@storybook/react";
import { PaymentRunCockpit, type PayableInvoice } from "./payment-run-cockpit";

const mockInvoices: PayableInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-8901",
    vendorName: "Amazon Web Services Inc",
    amount: 14250.0,
    currency: "USD",
    dueDate: "2026-09-10",
    discountAvailable: 285.0,
    rail: "ach",
    bankAccountMasked: "•••• 4419",
    riskScore: 8,
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-8902",
    vendorName: "SAP Deutschland SE",
    amount: 48900.0,
    currency: "USD",
    dueDate: "2026-09-08",
    discountAvailable: 978.0,
    rail: "sepa",
    bankAccountMasked: "•••• 9012",
    riskScore: 12,
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-8903",
    vendorName: "Tokyo Precision Machining",
    amount: 112000.0,
    currency: "USD",
    dueDate: "2026-09-07",
    rail: "wire",
    bankAccountMasked: "•••• 1827",
    riskScore: 24,
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-8904",
    vendorName: "Datadog Cloud Monitoring",
    amount: 6850.0,
    currency: "USD",
    dueDate: "2026-09-15",
    discountAvailable: 102.75,
    rail: "virtual_card",
    bankAccountMasked: "•••• 7731",
    riskScore: 5,
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-8905",
    vendorName: "Apex Facilities & Cleaning",
    amount: 3200.0,
    currency: "USD",
    dueDate: "2026-09-06",
    rail: "check",
    bankAccountMasked: "•••• 5521",
    riskScore: 62,
  },
];

const meta: Meta<typeof PaymentRunCockpit> = {
  title: "Platforms/BusinessSuite/Finance/PaymentRunCockpit",
  component: PaymentRunCockpit,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PaymentRunCockpit>;

export const Default: Story = {
  args: {
    runBatchId: "PR-2026-0906-01",
    title: "Commercial Accounts Payable Execution Run",
    invoices: mockInvoices,
    executionCutoff: "Today at 16:30 EST (Bank Wire Window)",
    density: "compact",
  },
};

export const Comfortable: Story = {
  args: {
    ...Default.args,
    density: "comfortable",
  },
};

export const WiresOnly: Story = {
  args: {
    runBatchId: "PR-2026-0906-02",
    title: "Mid-Day Wire Transfer Disbursement",
    invoices: mockInvoices.filter((i) => i.rail === "wire"),
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Payment Run Cockpit</h4>
        <PaymentRunCockpit
          runBatchId="PR-2026-0906-01"
          title="Commercial Accounts Payable Execution Run"
          invoices={mockInvoices}
          executionCutoff="Today at 16:30 EST (Bank Wire Window)"
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Full Execution Run (Compact)</h4>
        <PaymentRunCockpit
          runBatchId="PR-2026-0906-01"
          title="Commercial Accounts Payable Execution Run"
          invoices={mockInvoices}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Wire Transfer Execution (Comfortable)</h4>
        <PaymentRunCockpit
          runBatchId="PR-2026-0906-02"
          title="Mid-Day Wire Transfer Disbursement"
          invoices={mockInvoices.filter((i) => i.rail === "wire")}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
