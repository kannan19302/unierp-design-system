import type { Meta, StoryObj } from "@storybook/react";
import { SubledgerDistributionTable } from "./subledger-distribution-table";
import type { AccountOption, DistributionRow } from "./subledger-distribution-table";

const mockAccounts: AccountOption[] = [
  { id: "acc-1", code: "1010-00", name: "Operating Cash Primary" },
  { id: "acc-2", code: "2010-00", name: "Accounts Payable Trade" },
  { id: "acc-3", code: "5100-00", name: "Cloud Infrastructure Hosting" },
  { id: "acc-4", code: "6120-00", name: "Legal & Professional Fees" },
  { id: "acc-5", code: "1200-00", name: "Accounts Receivable Unbilled" },
];

const balancedRows: DistributionRow[] = [
  {
    id: "r-1",
    accountId: "acc-3",
    debit: 15000.0,
    credit: 0,
    subsidiary: "US Operating Entity (001)",
    department: "Engineering & R&D",
    costCenter: "CC-3000 Cloud Ops",
    memo: "AWS September compute usage",
  },
  {
    id: "r-2",
    accountId: "acc-4",
    debit: 5000.0,
    credit: 0,
    subsidiary: "US Operating Entity (001)",
    department: "General & Admin",
    costCenter: "CC-1000 Corp",
    memo: "Quarterly audit review retainers",
  },
  {
    id: "r-3",
    accountId: "acc-2",
    debit: 0,
    credit: 20000.0,
    subsidiary: "US Operating Entity (001)",
    department: "Finance & Accounting",
    costCenter: "CC-1000 Corp",
    memo: "AP voucher liability accrual",
  },
];

const unbalancedRows: DistributionRow[] = [
  {
    id: "r-1",
    accountId: "acc-3",
    debit: 12500.0,
    credit: 0,
    subsidiary: "US Operating Entity (001)",
    department: "Engineering & R&D",
    costCenter: "CC-3000 Cloud Ops",
    memo: "Datadog cluster monitoring license",
  },
  {
    id: "r-2",
    accountId: "acc-2",
    debit: 0,
    credit: 10000.0,
    subsidiary: "US Operating Entity (001)",
    department: "Finance & Accounting",
    costCenter: "CC-1000 Corp",
    memo: "Partial vendor disbursement",
  },
];

const meta: Meta<typeof SubledgerDistributionTable> = {
  title: "DataGrid/SubledgerDistributionTable",
  component: SubledgerDistributionTable,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubledgerDistributionTable>;

export const BalancedVoucher: Story = {
  args: {
    initialRows: balancedRows,
    availableAccounts: mockAccounts,
    currency: "$",
    density: "compact",
  },
};

export const UnbalancedWithAutofillRemainder: Story = {
  args: {
    initialRows: unbalancedRows,
    availableAccounts: mockAccounts,
    currency: "$",
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    initialRows: balancedRows,
    availableAccounts: mockAccounts,
    currency: "$",
    density: "ultra-compact",
  },
};

export const ReadOnlySummary: Story = {
  args: {
    initialRows: balancedRows,
    availableAccounts: mockAccounts,
    readOnly: true,
    currency: "$",
    density: "compact",
  },
};
