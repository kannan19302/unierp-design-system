import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { BillOfMaterialsTreeGrid } from "./bill-of-materials-tree-grid";

describe("BillOfMaterialsTreeGrid", () => {
  const sampleBomTree = {
    id: "asm-root",
    partNumber: "PRD-ROBOT-ARM-700",
    description: "6-Axis Industrial Robotic Arm",
    type: "assembly" as const,
    sourcing: "make" as const,
    revision: "Rev D.2",
    quantityPerAssembly: 1,
    unitOfMeasure: "EA",
    scrapPercentage: 0,
    unitCost: 14500.0,
    children: [
      {
        id: "sub-motor",
        partNumber: "ASM-DRIVE-J1",
        description: "Harmonic Drive Motor Assembly",
        type: "subassembly" as const,
        sourcing: "make" as const,
        revision: "Rev C",
        quantityPerAssembly: 1,
        unitOfMeasure: "EA",
        scrapPercentage: 1.0,
        unitCost: 2850.0,
        hasActiveEco: true,
        ecoNumber: "ECO-2026-081",
      },
    ],
  };

  const defaultProps = {
    assemblyPartNumber: "PRD-ROBOT-ARM-700",
    assemblyTitle: "6-Axis Industrial Articulated Robotic Arm",
    revision: "Rev D.2",
    rootBomNode: sampleBomTree,
    onSelectNode: vi.fn(),
    onToggleEcoDetails: vi.fn(),
  };

  it("renders BOM header, assembly title, and table tree", () => {
    render(<BillOfMaterialsTreeGrid {...defaultProps} />);
    expect(
      screen.getByRole("heading", {
        name: /Bill of Materials: 6-Axis Industrial Articulated Robotic Arm/i,
      })
    ).toBeDefined();
    expect(screen.getAllByText(/PRD-ROBOT-ARM-700/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("ASM-DRIVE-J1")).toBeDefined();
  });

  it("selects a component node on row click", () => {
    const handleSelect = vi.fn();
    render(<BillOfMaterialsTreeGrid {...defaultProps} onSelectNode={handleSelect} />);
    const row = screen.getByText("ASM-DRIVE-J1");
    fireEvent.click(row);
    expect(handleSelect).toHaveBeenCalledWith("sub-motor");
  });

  it("triggers ECO details callback when clicking ECO badge", () => {
    const handleEco = vi.fn();
    render(<BillOfMaterialsTreeGrid {...defaultProps} onToggleEcoDetails={handleEco} />);
    const ecoBtn = screen.getByRole("button", { name: /view change order/i });
    fireEvent.click(ecoBtn);
    expect(handleEco).toHaveBeenCalledWith("ECO-2026-081");
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<BillOfMaterialsTreeGrid {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
