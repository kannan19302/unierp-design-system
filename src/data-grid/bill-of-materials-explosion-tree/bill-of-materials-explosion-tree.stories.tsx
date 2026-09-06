import type { Meta, StoryObj } from "@storybook/react";
import {
  BillOfMaterialsExplosionTree,
  type BomNodeItem,
} from "./bill-of-materials-explosion-tree";

const mockBom: BomNodeItem = {
  id: "bom-root",
  partNumber: "ASM-9901-ROB",
  description: "Robotic Arm Actuator Assembly MK-IV",
  level: 0,
  quantityPerAssy: 1,
  unitCost: 1450.0,
  stockStatus: "in_stock",
  availableStock: 25,
  ecoRevision: "D.2",
  children: [
    {
      id: "bom-sub-1",
      partNumber: "SUB-4412-MTR",
      description: "Brushless Harmonic Drive Servo Motor Subassembly",
      level: 1,
      quantityPerAssy: 1,
      unitCost: 680.0,
      stockStatus: "in_stock",
      availableStock: 42,
      ecoRevision: "C.0",
      children: [
        {
          id: "bom-comp-1",
          partNumber: "CMP-8812-ENC",
          description: "Optical Rotary Absolute Encoder 19-bit",
          level: 2,
          quantityPerAssy: 1,
          unitCost: 195.0,
          stockStatus: "shortage",
          availableStock: 4,
          ecoRevision: "B.1",
        },
        {
          id: "bom-comp-2",
          partNumber: "CMP-8813-STT",
          description: "Stator Core Winding Assembly",
          level: 2,
          quantityPerAssy: 1,
          unitCost: 220.0,
          stockStatus: "in_stock",
          availableStock: 110,
        },
      ],
    },
    {
      id: "bom-sub-2",
      partNumber: "SUB-4413-HSG",
      description: "Precision CNC Aluminum Chassis & Gear Housing",
      level: 1,
      quantityPerAssy: 1,
      unitCost: 310.0,
      stockStatus: "low_stock",
      availableStock: 8,
      ecoRevision: "A.3",
      children: [
        {
          id: "bom-comp-3",
          partNumber: "HDW-1002-BRG",
          description: "Crossed Roller Bearing 85mm OD",
          level: 2,
          quantityPerAssy: 2,
          unitCost: 45.0,
          stockStatus: "in_stock",
          availableStock: 85,
        },
      ],
    },
  ],
};

const meta: Meta<typeof BillOfMaterialsExplosionTree> = {
  title: "DataGrid/BillOfMaterialsExplosionTree",
  component: BillOfMaterialsExplosionTree,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BillOfMaterialsExplosionTree>;

export const Default: Story = {
  args: {
    assemblyTitle: "Robotic Arm Actuator Assembly MK-IV",
    assemblyPartNumber: "ASM-9901-ROB",
    bomData: mockBom,
  },
};

export const Compact: Story = {
  args: {
    assemblyTitle: "Robotic Arm Actuator Assembly MK-IV",
    assemblyPartNumber: "ASM-9901-ROB",
    bomData: mockBom,
    density: "compact",
  },
};
