import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { MatrixInventoryVariantPicker } from "./matrix-inventory-variant-picker";

describe("MatrixInventoryVariantPicker", () => {
  const sampleStock = {
    "XS__Black": { quantity: 15, reserved: 2, skuSuffix: "BLK-XS" },
    "S__Black": { quantity: 45, reserved: 10, skuSuffix: "BLK-S" },
    "XS__Navy": { quantity: 4, reserved: 0, skuSuffix: "NVY-XS" },
    "S__Navy": { quantity: 20, reserved: 4, skuSuffix: "NVY-S" },
  };

  const defaultProps = {
    productTitle: "Meridian Technical Waterproof Parka",
    baseSku: "PRK-900",
    wholesalePrice: 145.0,
    msrp: 295.0,
    xAxisAttributeName: "Color",
    xAxisValues: ["Black", "Navy"],
    yAxisAttributeName: "Size",
    yAxisValues: ["XS", "S"],
    initialStockMatrix: sampleStock,
    lowStockThreshold: 10,
    onCellQuantityChange: vi.fn(),
    onSaveInventory: vi.fn(),
  };

  it("renders product info and matrix table", () => {
    render(<MatrixInventoryVariantPicker {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /Meridian Technical Waterproof Parka/i })).toBeDefined();
    expect(screen.getByText(/SKU: PRK-900/i)).toBeDefined();
    expect(screen.getByText("Black")).toBeDefined();
    expect(screen.getByText("Navy")).toBeDefined();
  });

  it("handles quantity adjustments in cells", () => {
    const handleQtyChange = vi.fn();
    render(<MatrixInventoryVariantPicker {...defaultProps} onCellQuantityChange={handleQtyChange} />);
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBeGreaterThanOrEqual(4);
    fireEvent.change(inputs[0], { target: { value: "25" } });
    expect(handleQtyChange).toHaveBeenCalledWith("XS", "Black", 25);
  });

  it("calls onSaveInventory when Save button is clicked", () => {
    const handleSave = vi.fn();
    render(<MatrixInventoryVariantPicker {...defaultProps} onSaveInventory={handleSave} />);
    const saveBtn = screen.getByRole("button", { name: /commit stock changes/i });
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalled();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<MatrixInventoryVariantPicker {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
