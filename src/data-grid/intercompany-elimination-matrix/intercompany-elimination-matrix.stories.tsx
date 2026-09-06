import type { Meta, StoryObj } from "@storybook/react";
import {
  IntercompanyEliminationMatrix,
  type IntercompanyPairLine,
} from "./intercompany-elimination-matrix";

const sampleLines: IntercompanyPairLine[] = [
  {
    id: "ic-1",
    sourceEntity: "US-HoldCo Inc (1000)",
    sourceAccount: "11200 - Due from UK Sub",
    sourceAmount: 250000.0,
    sourceCurrency: "USD",
    targetEntity: "UK-OpCo Ltd (2000)",
    targetAccount: "21200 - Due to US HoldCo",
    targetAmount: 196850.39,
    targetCurrency: "GBP",
    fxRateUsed: 1.27,
    varianceBaseCurrency: 0.0,
    transactionType: "trade_ar_ap",
    status: "matched",
  },
  {
    id: "ic-2",
    sourceEntity: "US-HoldCo Inc (1000)",
    sourceAccount: "11350 - Management Fee Receivable",
    sourceAmount: 45000.0,
    sourceCurrency: "USD",
    targetEntity: "DE-Logistics GmbH (3000)",
    targetAccount: "21350 - Management Fee Payable",
    targetAmount: 38461.54,
    targetCurrency: "EUR",
    fxRateUsed: 1.08,
    varianceBaseCurrency: 3461.54,
    transactionType: "management_fee",
    status: "variance",
  },
  {
    id: "ic-3",
    sourceEntity: "SG-Holdings Pte (4000)",
    sourceAccount: "11900 - Intercompany Term Loan",
    sourceAmount: 1000000.0,
    sourceCurrency: "USD",
    targetEntity: "US-HoldCo Inc (1000)",
    targetAccount: "21900 - Long-term IC Note",
    targetAmount: 1000000.0,
    targetCurrency: "USD",
    fxRateUsed: 1.0,
    varianceBaseCurrency: 0.0,
    transactionType: "intercompany_loan",
    status: "eliminated",
    eliminationVoucherRef: "ELIM-8921",
  },
];

const meta: Meta<typeof IntercompanyEliminationMatrix> = {
  title: "Data Grid/IntercompanyEliminationMatrix",
  component: IntercompanyEliminationMatrix,
  parameters: {
    layout: "padded",
  },
  args: {
    lines: sampleLines,
  },
};

export default meta;
type Story = StoryObj<typeof IntercompanyEliminationMatrix>;

export const Default: Story = {
  args: {},
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};
