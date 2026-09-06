import type { Meta, StoryObj } from "@storybook/react";
import {
  EsgEmissionsCalculator,
  EmissionActivityLine,
} from "./esg-emissions-calculator";

const mockActivities: EmissionActivityLine[] = [
  {
    id: "act-1",
    activityName: "Industrial Boiler Natural Gas Combustion",
    facilityName: "Assembly Plant Alpha (Everett, WA)",
    scope: "scope_1",
    quantity: 45000,
    unitOfMeasure: "therms",
    emissionFactor: 5.306,
    factorSource: "EPA GHG Hub 2026",
    tCo2e: 238.77,
  },
  {
    id: "act-2",
    activityName: "Purchased Electricity (Grid Consumption)",
    facilityName: "R&D Avionics Center (Austin, TX)",
    scope: "scope_2",
    quantity: 820000,
    unitOfMeasure: "kWh",
    emissionFactor: 0.3845,
    factorSource: "eGRID 2026 (ERCOT)",
    tCo2e: 315.29,
  },
  {
    id: "act-3",
    activityName: "Commercial Flight Business Travel",
    facilityName: "Global Corporate Workforce",
    scope: "scope_3",
    quantity: 340000,
    unitOfMeasure: "passenger-miles",
    emissionFactor: 0.178,
    factorSource: "DEFRA 2026 Flight Factor",
    tCo2e: 60.52,
  },
  {
    id: "act-4",
    activityName: "Upstream Ocean Freight Logistics",
    facilityName: "Titanium Ingot Supply Chain",
    scope: "scope_3",
    quantity: 120000,
    unitOfMeasure: "ton-miles",
    emissionFactor: 0.042,
    factorSource: "IMO Carbon Registry",
    tCo2e: 5.04,
  },
];

const meta: Meta<typeof EsgEmissionsCalculator> = {
  title: "Data Grid/EsgEmissionsCalculator",
  component: EsgEmissionsCalculator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EsgEmissionsCalculator>;

export const Default: Story = {
  args: {
    reportingYear: 2026,
    targetNetZeroYear: 2035,
    annualReductionTargetPct: 12.5,
    activities: mockActivities,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
