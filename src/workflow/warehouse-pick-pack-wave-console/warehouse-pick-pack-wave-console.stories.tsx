import type { Meta, StoryObj } from "@storybook/react";
import {
  WarehousePickPackWaveConsole,
  PickTask,
  ToteSlot,
} from "./warehouse-pick-pack-wave-console";

const mockTasks: PickTask[] = [
  {
    id: "task-1",
    sequenceNumber: 1,
    locationBarcode: "LOC-04-B-02-14",
    locationLabel: "AISLE 04 - BAY B - SHELF 2 - BIN 14",
    sku: "AERO-NUT-500",
    itemDescription: "Locking Flange Nut 3/8-24 Cadmium Plated",
    requiredQty: 24,
    pickedQty: 0,
    targetToteSlot: "A1",
    orderReference: "SO-99201",
    customerName: "Boeing Defense Solutions",
    isCompleted: false,
  },
  {
    id: "task-2",
    sequenceNumber: 2,
    locationBarcode: "LOC-04-B-03-01",
    locationLabel: "AISLE 04 - BAY B - SHELF 3 - BIN 01",
    sku: "AERO-WASHER-100",
    itemDescription: "Mil-Spec Titanium Structural Washer",
    requiredQty: 50,
    pickedQty: 0,
    targetToteSlot: "A2",
    orderReference: "SO-99208",
    customerName: "Lockheed Martin Missiles",
    isCompleted: false,
  },
  {
    id: "task-3",
    sequenceNumber: 3,
    locationBarcode: "LOC-05-A-01-08",
    locationLabel: "AISLE 05 - BAY A - SHELF 1 - BIN 08",
    sku: "GASKET-KAVLAR-02",
    itemDescription: "High-Pressure Hydraulic Gasket Ring",
    requiredQty: 10,
    pickedQty: 0,
    targetToteSlot: "B1",
    orderReference: "SO-99215",
    customerName: "General Electric Aviation",
    isCompleted: false,
  },
];

const mockTotes: ToteSlot[] = [
  {
    slotId: "A1",
    toteBarcode: "TOTE-9901",
    assignedOrder: "SO-99201",
    itemCount: 0,
    targetCapacity: 30,
    status: "active",
  },
  {
    slotId: "A2",
    toteBarcode: "TOTE-9902",
    assignedOrder: "SO-99208",
    itemCount: 12,
    targetCapacity: 60,
    status: "active",
  },
  {
    slotId: "B1",
    toteBarcode: "TOTE-9903",
    assignedOrder: "SO-99215",
    itemCount: 5,
    targetCapacity: 20,
    status: "active",
  },
  {
    slotId: "B2",
    toteBarcode: "TOTE-9904",
    assignedOrder: "SO-99220",
    itemCount: 0,
    targetCapacity: 40,
    status: "idle",
  },
];

const meta: Meta<typeof WarehousePickPackWaveConsole> = {
  title: "Workflow/WarehousePickPackWaveConsole",
  component: WarehousePickPackWaveConsole,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WarehousePickPackWaveConsole>;

export const Default: Story = {
  args: {
    waveId: "WAVE-2026-0819",
    priority: "expedited",
    cutoffTime: "16:30 EST (38m remaining)",
    cartId: "CART-07",
    pickerName: "Marcus Rivera",
    initialTasks: mockTasks,
    toteSlots: mockTotes,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const CompletedWave: Story = {
  args: {
    ...Default.args,
    initialTasks: mockTasks.map((t) => ({ ...t, isCompleted: true })),
  },
};
