import type { Meta, StoryObj } from "@storybook/react";
import {
  MatterTrustLedger,
  TrustLedgerEntry,
} from "./matter-trust-ledger";

const mockEntries: TrustLedgerEntry[] = [
  {
    id: "tx-1",
    date: "2026-08-01",
    type: "retainer_deposit",
    payeeOrPayor: "Acme Corporation (Client)",
    description: "Initial case retainer escrow deposit",
    amount: 50000.0,
    runningTrustBalance: 50000.0,
    voucherRef: "VCH-TR-8001",
    reconciliationStatus: "cleared",
  },
  {
    id: "tx-2",
    date: "2026-08-15",
    type: "disbursement_expense",
    payeeOrPayor: "US District Court - Western District WA",
    description: "Court filing fee & patent complaint service",
    amount: -850.0,
    runningTrustBalance: 49150.0,
    voucherRef: "VCH-TR-8042",
    reconciliationStatus: "cleared",
  },
  {
    id: "tx-3",
    date: "2026-08-31",
    type: "earned_fees_transfer",
    payeeOrPayor: "Meridian Legal Partners (Operating Account)",
    description: "Earned legal fees for August billed hours (Invoice #1049)",
    amount: -18500.0,
    runningTrustBalance: 30650.0,
    voucherRef: "VCH-TR-8119",
    reconciliationStatus: "cleared",
  },
  {
    id: "tx-4",
    date: "2026-09-02",
    type: "disbursement_expense",
    payeeOrPayor: "Forensic IP Analytics LLC",
    description: "Expert witness source code audit retainer",
    amount: -12000.0,
    runningTrustBalance: 18650.0,
    voucherRef: "VCH-TR-8204",
    reconciliationStatus: "cleared",
  },
];

const meta: Meta<typeof MatterTrustLedger> = {
  title: "Data Grid/MatterTrustLedger",
  component: MatterTrustLedger,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MatterTrustLedger>;

export const Default: Story = {
  args: {
    matterId: "MAT-2026-0812",
    matterName: "Acme Corp vs. Apex Logistics — Patent Infringement",
    clientName: "Acme Corporation",
    minimumRetainerThreshold: 15000,
    ioltaBankBalance: 18650.0,
    entries: mockEntries,
  },
};

export const BelowThresholdWarning: Story = {
  args: {
    matterId: "MAT-2026-0812",
    matterName: "Acme Corp vs. Apex Logistics — Patent Infringement",
    clientName: "Acme Corporation",
    minimumRetainerThreshold: 25000,
    ioltaBankBalance: 18650.0,
    entries: mockEntries,
  },
};

export const UltraCompactDensity: Story = {
  args: {
    matterId: "MAT-2026-0812",
    matterName: "Acme Corp vs. Apex Logistics",
    clientName: "Acme Corporation",
    entries: mockEntries,
    density: "ultra-compact",
  },
};
