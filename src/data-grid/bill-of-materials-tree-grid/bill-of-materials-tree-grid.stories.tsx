import type { Meta, StoryObj } from "@storybook/react";
import { BillOfMaterialsTreeGrid } from "./bill-of-materials-tree-grid";

const meta: Meta<typeof BillOfMaterialsTreeGrid> = {
  title: "Data Grid/BillOfMaterialsTreeGrid",
  component: BillOfMaterialsTreeGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BillOfMaterialsTreeGrid>;

const sampleBomTree = {
  id: "asm-root",
  partNumber: "PRD-ROBOT-ARM-700",
  description: "6-Axis Articulated Industrial Robotic Manipulator",
  type: "assembly" as const,
  sourcing: "make" as const,
  revision: "Rev D.2",
  quantityPerAssembly: 1,
  unitOfMeasure: "EA",
  scrapPercentage: 0,
  unitCost: 14500.0,
  children: [
    {
      id: "sub-motor-base",
      partNumber: "ASM-DRIVE-J1",
      description: "Base Harmonic Drive & Brushless Servomotor Assembly",
      type: "subassembly" as const,
      sourcing: "make" as const,
      revision: "Rev C",
      quantityPerAssembly: 1,
      unitOfMeasure: "EA",
      scrapPercentage: 1.0,
      unitCost: 2850.0,
      hasActiveEco: true,
      ecoNumber: "ECO-2026-081",
      children: [
        {
          id: "part-servo-motor",
          partNumber: "MTR-BLDC-48V-750W",
          description: "48V 750W High-Torque Brushless Servo Motor",
          type: "part" as const,
          sourcing: "buy" as const,
          revision: "Rev B",
          quantityPerAssembly: 1,
          unitOfMeasure: "EA",
          scrapPercentage: 0,
          unitCost: 650.0,
        },
        {
          id: "part-harmonic-gear",
          partNumber: "GRB-HARM-100-1",
          description: "Harmonic Strain Wave Reducer 100:1",
          type: "part" as const,
          sourcing: "buy" as const,
          revision: "Rev A",
          quantityPerAssembly: 1,
          unitOfMeasure: "EA",
          scrapPercentage: 0,
          unitCost: 1100.0,
        },
        {
          id: "part-encoder",
          partNumber: "ENC-OPT-20BIT",
          description: "20-Bit Absolute Optical Rotary Encoder",
          type: "part" as const,
          sourcing: "buy" as const,
          revision: "Rev A",
          quantityPerAssembly: 1,
          unitOfMeasure: "EA",
          scrapPercentage: 0,
          unitCost: 240.0,
        },
      ],
    },
    {
      id: "sub-arm-casting",
      partNumber: "ASM-CAST-UPPER-J2",
      description: "Upper Arm Cast Aluminum Structural Link",
      type: "subassembly" as const,
      sourcing: "make" as const,
      revision: "Rev B",
      quantityPerAssembly: 1,
      unitOfMeasure: "EA",
      scrapPercentage: 2.5,
      unitCost: 1850.0,
      children: [
        {
          id: "raw-alum-ingot",
          partNumber: "RAW-ALUM-A356",
          description: "A356-T6 Aerospace Grade Aluminum Ingot",
          type: "raw_material" as const,
          sourcing: "buy" as const,
          revision: "Rev A",
          quantityPerAssembly: 18.5,
          unitOfMeasure: "KG",
          scrapPercentage: 5.0,
          unitCost: 12.5,
        },
      ],
    },
  ],
};

export const Default: Story = {
  args: {
    assemblyPartNumber: "PRD-ROBOT-ARM-700",
    assemblyTitle: "6-Axis Industrial Articulated Robotic Arm",
    revision: "Rev D.2",
    rootBomNode: sampleBomTree,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
