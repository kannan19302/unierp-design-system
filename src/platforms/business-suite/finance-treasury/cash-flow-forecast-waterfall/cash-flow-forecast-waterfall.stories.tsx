import type { Meta, StoryObj } from "@storybook/react";
import { CashFlowForecastWaterfall, type CashFlowStepItem } from "./cash-flow-forecast-waterfall";

const mockSteps: CashFlowStepItem[] = [
  {
    id: "step-1",
    name: "Enterprise SaaS ARR Collections",
    category: "inflow",
    amount: 8500000,
    notes: "Q3 renewal tranche from Fortune 500 customers.",
  },
  {
    id: "step-2",
    name: "Channel Partner Royalties",
    category: "inflow",
    amount: 2100000,
    notes: "OEM reseller distribution settlements.",
  },
  {
    id: "step-3",
    name: "Global Payroll & Benefits",
    category: "outflow",
    amount: 4200000,
    notes: "Bi-weekly mid-month operational payroll cliff.",
  },
  {
    id: "step-4",
    name: "Cloud Hosting & Datacenter Infrastructure",
    category: "outflow",
    amount: 1850000,
    notes: "Reserved instance commitments (AWS + GCP).",
  },
  {
    id: "step-5",
    name: "Senior Credit Facility Debt Service",
    category: "outflow",
    amount: 1200000,
    notes: "Scheduled interest + principal amortization.",
  },
];

const meta: Meta<typeof CashFlowForecastWaterfall> = {
  title: "Platforms/BusinessSuite/FinanceTreasury/CashFlowForecastWaterfall",
  component: CashFlowForecastWaterfall,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CashFlowForecastWaterfall>;

export const Default: Story = {
  args: {
    title: "30-Day Liquidity & Cash Burn Waterfall Forecast",
    openingBalance: 12000000,
    items: mockSteps,
    minimumCashBuffer: 8000000,
  },
};

export const BufferBreach: Story = {
  args: {
    title: "High-Burn Expansion Scenario",
    openingBalance: 4000000,
    items: mockSteps,
    minimumCashBuffer: 10000000,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <CashFlowForecastWaterfall
        title="Compact Waterfall Anatomy"
        openingBalance={12000000}
        items={mockSteps}
        minimumCashBuffer={8000000}
        density="compact"
      />
      <CashFlowForecastWaterfall
        title="Comfortable Waterfall Anatomy"
        openingBalance={12000000}
        items={mockSteps}
        minimumCashBuffer={8000000}
        density="comfortable"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <CashFlowForecastWaterfall
        title="Healthy Cash Headroom State"
        openingBalance={15000000}
        items={mockSteps}
        minimumCashBuffer={5000000}
      />
      <CashFlowForecastWaterfall
        title="Buffer Breach Alert State"
        openingBalance={3000000}
        items={mockSteps}
        minimumCashBuffer={9000000}
      />
    </div>
  ),
};
