import type { Meta, StoryObj } from "@storybook/react";
import { BinLocationGrid, StorageBin } from "./bin-location-grid";

const SAMPLE_BINS: StorageBin[] = [
  {
    id: "bin-1",
    binCode: "A04-01-03",
    bay: 1,
    tier: 3,
    capacityPercent: 92,
    skuCount: 1,
    primarySku: "MED-INS-100U",
    primarySkuName: "Insulin Glargine 100 U/mL",
    lotNumber: "LOT-99214A",
    expiryDate: "2027-12-31",
    onHandQty: 480,
    isColdChain: true,
  },
  {
    id: "bin-2",
    binCode: "A04-02-03",
    bay: 2,
    tier: 3,
    capacityPercent: 45,
    skuCount: 2,
    primarySku: "MED-EPN-03MG",
    primarySkuName: "Epinephrine Auto-Injector 0.3mg",
    lotNumber: "LOT-88120B",
    expiryDate: "2026-11-15",
    onHandQty: 120,
    isColdChain: true,
  },
  {
    id: "bin-3",
    binCode: "A04-03-03",
    bay: 3,
    tier: 3,
    capacityPercent: 0,
    skuCount: 0,
  },
  {
    id: "bin-4",
    binCode: "A04-01-02",
    bay: 1,
    tier: 2,
    capacityPercent: 100,
    skuCount: 1,
    primarySku: "MED-VAX-MRNA",
    primarySkuName: "COVID-19 Bivalent Vaccine",
    lotNumber: "LOT-VAX-0441",
    expiryDate: "2026-10-01",
    onHandQty: 1200,
    isColdChain: true,
    isQuarantined: true,
  },
  {
    id: "bin-5",
    binCode: "A04-02-02",
    bay: 2,
    tier: 2,
    capacityPercent: 60,
    skuCount: 1,
    primarySku: "MED-ABX-500MG",
    primarySkuName: "Amoxicillin Trihydrate 500mg",
    lotNumber: "LOT-55192C",
    expiryDate: "2028-06-30",
    onHandQty: 850,
  },
  {
    id: "bin-6",
    binCode: "A04-03-02",
    bay: 3,
    tier: 2,
    capacityPercent: 20,
    skuCount: 1,
    primarySku: "IND-SOL-ETHANOL",
    primarySkuName: "Denatured Ethanol 95% Reagent",
    onHandQty: 40,
    isHazardous: true,
  },
  {
    id: "bin-7",
    binCode: "A04-01-01",
    bay: 1,
    tier: 1,
    capacityPercent: 75,
    skuCount: 1,
    primarySku: "SUP-GLV-NITRILE-M",
    primarySkuName: "Nitrile Exam Gloves Size M",
    onHandQty: 5000,
  },
  {
    id: "bin-8",
    binCode: "A04-02-01",
    bay: 2,
    tier: 1,
    capacityPercent: 10,
    skuCount: 1,
    primarySku: "SUP-SYR-03ML",
    primarySkuName: "Luer-Lock Syringe 3mL",
    onHandQty: 250,
  },
  {
    id: "bin-9",
    binCode: "A04-03-01",
    bay: 3,
    tier: 1,
    capacityPercent: 0,
    skuCount: 0,
  },
];

const meta: Meta<typeof BinLocationGrid> = {
  title: "DataGrid/BinLocationGrid",
  component: BinLocationGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BinLocationGrid>;

export const Default: Story = {
  args: {
    aisleCode: "Aisle 04 — Pharmaceutical Cold Vault",
    bays: 3,
    tiers: 3,
    bins: SAMPLE_BINS,
    selectedBinId: "bin-1",
  },
};

export const QuarantinedLocationSelected: Story = {
  args: {
    aisleCode: "Aisle 04 — Pharmaceutical Cold Vault",
    bays: 3,
    tiers: 3,
    bins: SAMPLE_BINS,
    selectedBinId: "bin-4",
  },
};
