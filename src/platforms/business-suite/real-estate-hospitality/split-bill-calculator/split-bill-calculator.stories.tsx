import type { Meta, StoryObj } from "@storybook/react";
import {
  SplitBillCalculator,
  BillLineItem,
} from "./split-bill-calculator";

const mockItems: BillLineItem[] = [
  { id: "i1", name: "Crispy Calamari with Garlic Aioli", quantity: 1, unitPrice: 18.0 },
  { id: "i2", name: "Prime Dry-Aged Ribeye (16oz)", quantity: 2, unitPrice: 65.0 },
  { id: "i3", name: "Pan-Seared Chilean Sea Bass", quantity: 1, unitPrice: 52.0 },
  { id: "i4", name: "Napa Valley Cabernet Sauvignon (Bottle)", quantity: 1, unitPrice: 110.0 },
  { id: "i5", name: "Artisanal Gelato Trio", quantity: 2, unitPrice: 14.0 },
];

const meta: Meta<typeof SplitBillCalculator> = {
  title: "Platforms/BusinessSuite/RealEstate/SplitBillCalculator",
  component: SplitBillCalculator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SplitBillCalculator>;

export const Default: Story = {
  args: {
    checkNumber: "CHK-8812",
    tableNumber: "Table 14 - Dining Room",
    items: mockItems,
    initialGuestCount: 3,
    initialTipPct: 20,
  },
};

export const PartiallyPaid: Story = {
  args: {
    checkNumber: "CHK-8812",
    tableNumber: "Table 14",
    items: mockItems,
    initialGuestCount: 3,
    tenders: [
      {
        id: "t1",
        method: "card",
        amount: 150.0,
        guestIndex: 1,
        timestamp: "2026-09-06T10:14:00Z",
      },
    ],
  },
};

export const UltraCompactDensity: Story = {
  args: {
    checkNumber: "CHK-8812",
    tableNumber: "Table 14",
    items: mockItems,
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SplitBillCalculator {...args} />
    </div>
  ),
  args: {
    checkNumber: "CHK-8812",
    tableNumber: "Table 14",
    items: mockItems,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Compact Density</h4>
        <SplitBillCalculator
          checkNumber="CHK-101"
          tableNumber="Table 4"
          items={mockItems}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Ultra Compact Density</h4>
        <SplitBillCalculator
          checkNumber="CHK-102"
          tableNumber="Table 8"
          items={mockItems}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};

