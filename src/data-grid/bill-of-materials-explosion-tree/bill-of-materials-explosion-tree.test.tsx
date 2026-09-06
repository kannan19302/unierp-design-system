import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  BillOfMaterialsExplosionTree,
  type BomNodeItem,
} from "./bill-of-materials-explosion-tree";

const testBom: BomNodeItem = {
  id: "bom-root",
  partNumber: "ASM-9901-ROB",
  description: "Robotic Arm Actuator Assembly MK-IV",
  level: 0,
  quantityPerAssy: 1,
  unitCost: 1000.0,
  stockStatus: "in_stock",
  availableStock: 25,
  ecoRevision: "D.2",
  children: [
    {
      id: "bom-sub-1",
      partNumber: "SUB-4412-MTR",
      description: "Servo Motor Subassembly",
      level: 1,
      quantityPerAssy: 1,
      unitCost: 500.0,
      stockStatus: "shortage",
      availableStock: 2,
    },
  ],
};

describe("BillOfMaterialsExplosionTree", () => {
  it("renders BOM parts and computes totals correctly", () => {
    render(
      <BillOfMaterialsExplosionTree
        assemblyTitle="Actuator Unit"
        assemblyPartNumber="ASM-9901"
        bomData={testBom}
      />
    );

    expect(screen.getByText("Actuator Unit")).toBeInTheDocument();
    expect(screen.getByText("ASM-9901")).toBeInTheDocument();
    expect(screen.getByText("Robotic Arm Actuator Assembly MK-IV")).toBeInTheDocument();
    expect(screen.getByText("Servo Motor Subassembly")).toBeInTheDocument();
  });

  it("filters for shortages only when toggle button is clicked", () => {
    render(
      <BillOfMaterialsExplosionTree
        assemblyTitle="Actuator Unit"
        assemblyPartNumber="ASM-9901"
        bomData={testBom}
      />
    );

    const filterBtn = screen.getByRole("button", { name: /Filter Shortages Only/i });
    fireEvent.click(filterBtn);

    expect(screen.getByText("Servo Motor Subassembly")).toBeInTheDocument();
    expect(screen.queryByText("Robotic Arm Actuator Assembly MK-IV")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BillOfMaterialsExplosionTree
        assemblyTitle="Actuator Unit"
        assemblyPartNumber="ASM-9901"
        bomData={testBom}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
