import type { Meta, StoryObj } from "@storybook/react";
import {
  SupplyChainDisruptionRiskHeatmap,
  LaneRiskCell,
} from "./supply-chain-disruption-risk-heatmap";

const sampleOrigins = [
  "Shanghai (CNSHA)",
  "Ningbo (CNNGB)",
  "Shenzhen (CNSZX)",
  "Busan (KRPUS)",
];

const sampleDestinations = [
  "Long Beach (USLGB)",
  "Rotterdam (NLRTM)",
  "Singapore (SGSIN)",
  "Hamburg (DEHAM)",
];

const sampleCells: LaneRiskCell[] = [
  {
    laneId: "LANE-TP-01",
    originHub: "Shanghai (CNSHA)",
    destinationHub: "Long Beach (USLGB)",
    riskScore: 88,
    severity: "critical",
    category: "port_congestion",
    dwellDays: 7.4,
    transitVarianceDays: 3.8,
    recommendedAlternate: "Divert via Prince Rupert (CAPRR) + Intermodal CN Rail to Chicago",
    primaryCarrier: "Maersk Line (2M Alliance)",
  },
  {
    laneId: "LANE-EU-02",
    originHub: "Shanghai (CNSHA)",
    destinationHub: "Rotterdam (NLRTM)",
    riskScore: 62,
    severity: "elevated",
    category: "geopolitical",
    dwellDays: 4.2,
    transitVarianceDays: 1.5,
    recommendedAlternate: "Cape of Good Hope routing with bunkering at Port Louis",
    primaryCarrier: "CMA CGM (Ocean Alliance)",
  },
  {
    laneId: "LANE-AP-03",
    originHub: "Shanghai (CNSHA)",
    destinationHub: "Singapore (SGSIN)",
    riskScore: 18,
    severity: "low",
    category: "weather",
    dwellDays: 1.1,
    transitVarianceDays: 0.2,
    primaryCarrier: "ONE Line (THE Alliance)",
  },
  {
    laneId: "LANE-TP-04",
    originHub: "Ningbo (CNNGB)",
    destinationHub: "Long Beach (USLGB)",
    riskScore: 76,
    severity: "severe",
    category: "port_congestion",
    dwellDays: 6.1,
    transitVarianceDays: 2.9,
    recommendedAlternate: "Oakland (USOAK) bypass slot allocation",
    primaryCarrier: "COSCO Shipping",
  },
  {
    laneId: "LANE-EU-05",
    originHub: "Ningbo (CNNGB)",
    destinationHub: "Rotterdam (NLRTM)",
    riskScore: 45,
    severity: "moderate",
    category: "weather",
    dwellDays: 3.5,
    transitVarianceDays: 0.8,
    primaryCarrier: "Hapag-Lloyd",
  },
  {
    laneId: "LANE-EU-06",
    originHub: "Ningbo (CNNGB)",
    destinationHub: "Hamburg (DEHAM)",
    riskScore: 68,
    severity: "elevated",
    category: "port_congestion",
    dwellDays: 5.0,
    transitVarianceDays: 2.1,
    recommendedAlternate: "Bremerhaven barge feeder relay",
    primaryCarrier: "MSC",
  },
  {
    laneId: "LANE-TP-07",
    originHub: "Shenzhen (CNSZX)",
    destinationHub: "Long Beach (USLGB)",
    riskScore: 71,
    severity: "severe",
    category: "tariffs",
    dwellDays: 5.8,
    transitVarianceDays: 2.4,
    recommendedAlternate: "Ensenada (MXESE) bonded overland transshipment",
    primaryCarrier: "Evergreen Marine",
  },
  {
    laneId: "LANE-AP-08",
    originHub: "Shenzhen (CNSZX)",
    destinationHub: "Singapore (SGSIN)",
    riskScore: 22,
    severity: "low",
    category: "weather",
    dwellDays: 1.4,
    transitVarianceDays: 0.1,
    primaryCarrier: "Yang Ming",
  },
  {
    laneId: "LANE-TP-09",
    originHub: "Busan (KRPUS)",
    destinationHub: "Long Beach (USLGB)",
    riskScore: 38,
    severity: "moderate",
    category: "port_congestion",
    dwellDays: 2.9,
    transitVarianceDays: 0.7,
    primaryCarrier: "HMM",
  },
  {
    laneId: "LANE-EU-10",
    originHub: "Busan (KRPUS)",
    destinationHub: "Rotterdam (NLRTM)",
    riskScore: 54,
    severity: "elevated",
    category: "geopolitical",
    dwellDays: 3.8,
    transitVarianceDays: 1.2,
    primaryCarrier: "ONE Line",
  },
  {
    laneId: "LANE-EU-11",
    originHub: "Busan (KRPUS)",
    destinationHub: "Hamburg (DEHAM)",
    riskScore: 29,
    severity: "moderate",
    category: "weather",
    dwellDays: 2.5,
    transitVarianceDays: 0.4,
    primaryCarrier: "MSC",
  },
];

const meta: Meta<typeof SupplyChainDisruptionRiskHeatmap> = {
  title: "Data Display/SupplyChainDisruptionRiskHeatmap",
  component: SupplyChainDisruptionRiskHeatmap,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SupplyChainDisruptionRiskHeatmap>;

export const Default: Story = {
  args: {
    corridorName: "Trans-Pacific & Global Ocean Freight",
    origins: sampleOrigins,
    destinations: sampleDestinations,
    cells: sampleCells,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
