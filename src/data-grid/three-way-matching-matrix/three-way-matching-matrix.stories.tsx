import type { Meta, StoryObj } from "@storybook/react";
import { ThreeWayMatchingMatrix, MatchedLineItem } from "./three-way-matching-matrix";

const mockItems: MatchedLineItem[] = [
  {
    id: "item-1",
    lineNumber: 10,
    itemCode: "TURB-BLD-01",
    description: "Inconel 718 High-Pressure Turbine Blade Assembly",
    poNumber: "PO-88210",
    poQty: 48,
    poUnitPrice: 1250.0,
    grnNumber: "GRN-77401",
    receivedQty: 48,
    receivedDate: "2026-09-02",
    invoiceNumber: "INV-2026-9042",
    billedQty: 48,
    billedUnitPrice: 1250.0,
    status: "matched",
  },
  {
    id: "item-2",
    lineNumber: 20,
    itemCode: "O-RING-VITON",
    description: "High-Temperature Viton Seal Kit - Aero Specification",
    poNumber: "PO-88210",
    poQty: 200,
    poUnitPrice: 14.5,
    grnNumber: "GRN-77401",
    receivedQty: 200,
    receivedDate: "2026-09-02",
    invoiceNumber: "INV-2026-9042",
    billedQty: 200,
    billedUnitPrice: 17.2,
    status: "price_variance",
    varianceReason: "Vendor billed $17.20 vs contracted PO price $14.50 (+18.6%)",
  },
  {
    id: "item-3",
    lineNumber: 30,
    itemCode: "TITANIUM-HEX-BOLT",
    description: "Grade 5 Titanium Hex Flange Bolt (M10 x 45mm)",
    poNumber: "PO-88210",
    poQty: 500,
    poUnitPrice: 8.75,
    grnNumber: "GRN-77402",
    receivedQty: 400,
    receivedDate: "2026-09-04",
    invoiceNumber: "INV-2026-9042",
    billedQty: 500,
    billedUnitPrice: 8.75,
    status: "quantity_variance",
    varianceReason: "Invoice billed full 500 units; only 400 units received on dock",
  },
  {
    id: "item-4",
    lineNumber: 40,
    itemCode: "LUB-SYNTH-500",
    description: "Mil-Spec Synthetic Turbine Lubricant (55 Gal Drum)",
    poNumber: "PO-88210",
    poQty: 4,
    poUnitPrice: 3200.0,
    invoiceNumber: "INV-2026-9042",
    billedQty: 4,
    billedUnitPrice: 3200.0,
    status: "missing_receipt",
    varianceReason: "No warehouse receiving document on file for freight carrier delivery",
  },
];

const meta: Meta<typeof ThreeWayMatchingMatrix> = {
  title: "Data Grid/ThreeWayMatchingMatrix",
  component: ThreeWayMatchingMatrix,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThreeWayMatchingMatrix>;

export const Default: Story = {
  args: {
    invoiceReference: "INV-2026-9042",
    vendorName: "Apex Industrial Dynamics LLC",
    poReference: "PO-88210",
    items: mockItems,
    priceTolerancePercent: 2.0,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const AllMatched: Story = {
  args: {
    invoiceReference: "INV-2026-9055",
    vendorName: "Precision Fasteners Global Corp",
    poReference: "PO-88224",
    items: [
      {
        id: "item-10",
        lineNumber: 10,
        itemCode: "SS-WASHER-A2",
        description: "Stainless Steel A2 Flat Washer 100pk",
        poNumber: "PO-88224",
        poQty: 100,
        poUnitPrice: 12.0,
        grnNumber: "GRN-77450",
        receivedQty: 100,
        invoiceNumber: "INV-2026-9055",
        billedQty: 100,
        billedUnitPrice: 12.0,
        status: "matched",
      },
      {
        id: "item-20",
        lineNumber: 20,
        itemCode: "HEX-NUT-M8",
        description: "Metric M8 Zinc-Plated Locking Hex Nut 500pk",
        poNumber: "PO-88224",
        poQty: 50,
        poUnitPrice: 24.5,
        grnNumber: "GRN-77450",
        receivedQty: 50,
        invoiceNumber: "INV-2026-9055",
        billedQty: 50,
        billedUnitPrice: 24.5,
        status: "matched",
      },
    ],
    density: "standard",
  },
};
