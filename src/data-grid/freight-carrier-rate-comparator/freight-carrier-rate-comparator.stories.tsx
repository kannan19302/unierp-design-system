import type { Meta, StoryObj } from "@storybook/react";
import {
  FreightCarrierRateComparator,
  FreightCarrierQuote,
  FreightLaneSpecification,
} from "./freight-carrier-rate-comparator";

const sampleLane: FreightLaneSpecification = {
  originPostal: "60666 (Chicago, IL)",
  destinationPostal: "75261 (Dallas, TX)",
  palletCount: 4,
  totalWeightLbs: 3400,
  freightClass: "Class 70",
};

const sampleQuotes: FreightCarrierQuote[] = [
  {
    id: "quote_fxfe_01",
    carrierName: "FedEx Freight Priority",
    scacCode: "FXFE",
    mode: "LTL",
    transitDays: 2,
    baseRateUsd: 1250.0,
    fuelSurchargeUsd: 180.5,
    accessorialsUsd: 75.0,
    totalLandedCostUsd: 1505.5,
    tenderStatus: "QUOTED",
    guaranteedDelivery: true,
  },
  {
    id: "quote_odfl_02",
    carrierName: "Old Dominion Freight Line",
    scacCode: "ODFL",
    mode: "LTL",
    transitDays: 3,
    baseRateUsd: 1080.0,
    fuelSurchargeUsd: 155.0,
    accessorialsUsd: 50.0,
    totalLandedCostUsd: 1285.0,
    tenderStatus: "QUOTED",
    guaranteedDelivery: false,
  },
  {
    id: "quote_xpo_03",
    carrierName: "XPO Logistics Expedited",
    scacCode: "CNWY",
    mode: "LTL",
    transitDays: 2,
    baseRateUsd: 1340.0,
    fuelSurchargeUsd: 195.0,
    accessorialsUsd: 90.0,
    totalLandedCostUsd: 1625.0,
    tenderStatus: "QUOTED",
    guaranteedDelivery: true,
  },
  {
    id: "quote_ch_04",
    carrierName: "C.H. Robinson Dedicated FTL",
    scacCode: "RBTW",
    mode: "FTL",
    transitDays: 1,
    baseRateUsd: 1850.0,
    fuelSurchargeUsd: 220.0,
    accessorialsUsd: 0.0,
    totalLandedCostUsd: 2070.0,
    tenderStatus: "QUOTED",
    guaranteedDelivery: true,
  },
];

const meta: Meta<typeof FreightCarrierRateComparator> = {
  title: "Data Grid/FreightCarrierRateComparator",
  component: FreightCarrierRateComparator,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FreightCarrierRateComparator>;

export const Default: Story = {
  args: {
    lane: sampleLane,
    quotes: sampleQuotes,
  },
};

export const UltraCompact: Story = {
  args: {
    lane: sampleLane,
    quotes: sampleQuotes,
    density: "ultra-compact",
  },
};
