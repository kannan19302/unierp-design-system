import type { Meta, StoryObj } from "@storybook/react";
import {
  LossReserveAdjustmentLedger,
  type ClaimFinancialSummary,
  type ReserveAdjustmentRecord,
} from "./loss-reserve-adjustment-ledger";

const sampleClaim: ClaimFinancialSummary = {
  claimNumber: "CLM-2026-88190",
  policyNumber: "POL-GL-99401",
  insuredName: "Apex Industrial Logistics Corp",
  dateOfLoss: "2026-06-14",
  claimantName: "Robert Miller",
  totalIncurred: 85000.0,
  totalPaid: 22500.0,
  totalOutstandingReserve: 62500.0,
  adjusterAuthorityLimit: 50000.0,
};

const sampleAdjustments: ReserveAdjustmentRecord[] = [
  {
    id: "adj-1",
    transactionDate: "2026-06-15",
    bucket: "indemnity",
    priorReserve: 0.0,
    adjustedAmount: 25000.0,
    newReserve: 25000.0,
    adjusterName: "Marcus Thorne",
    adjusterNpn: "NPN-9941029",
    reasonCode: "INITIAL_RESERVE_SETUP",
    requiresSupervisorSignoff: false,
    isSignedOff: true,
  },
  {
    id: "adj-2",
    transactionDate: "2026-07-22",
    bucket: "medical",
    priorReserve: 10000.0,
    adjustedAmount: 15000.0,
    newReserve: 25000.0,
    adjusterName: "Marcus Thorne",
    adjusterNpn: "NPN-9941029",
    reasonCode: "REVAL_NEW_EVIDENCE",
    requiresSupervisorSignoff: false,
    isSignedOff: true,
  },
  {
    id: "adj-3",
    transactionDate: "2026-09-01",
    bucket: "expense_dcc",
    priorReserve: 15000.0,
    adjustedAmount: 40000.0,
    newReserve: 55000.0,
    adjusterName: "Marcus Thorne",
    adjusterNpn: "NPN-9941029",
    reasonCode: "REVAL_LITIGATION_RISK",
    requiresSupervisorSignoff: true,
    isSignedOff: false,
  },
];

const meta: Meta<typeof LossReserveAdjustmentLedger> = {
  title: "Data Grid/LossReserveAdjustmentLedger",
  component: LossReserveAdjustmentLedger,
  parameters: {
    layout: "padded",
  },
  args: {
    claim: sampleClaim,
    initialAdjustments: sampleAdjustments,
  },
};

export default meta;
type Story = StoryObj<typeof LossReserveAdjustmentLedger>;

export const Default: Story = {
  args: {},
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};
