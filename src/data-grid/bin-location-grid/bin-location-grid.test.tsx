import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BinLocationGrid, StorageBin } from "./bin-location-grid";

const TEST_BINS: StorageBin[] = [
  {
    id: "b1",
    binCode: "A01-01-02",
    bay: 1,
    tier: 2,
    capacityPercent: 80,
    skuCount: 1,
    primarySku: "SKU-TEST-100",
    primarySkuName: "Test Item 100",
    lotNumber: "LOT-999",
    onHandQty: 50,
  },
  {
    id: "b2",
    binCode: "A01-02-02",
    bay: 2,
    tier: 2,
    capacityPercent: 0,
    skuCount: 0,
  },
  {
    id: "b3",
    binCode: "A01-01-01",
    bay: 1,
    tier: 1,
    capacityPercent: 95,
    skuCount: 1,
    primarySku: "SKU-QUARANTINE",
    isQuarantined: true,
  },
  {
    id: "b4",
    binCode: "A01-02-01",
    bay: 2,
    tier: 1,
    capacityPercent: 50,
    skuCount: 1,
  },
];

describe("BinLocationGrid", () => {
  it("renders aisle and bins with zero accessibility violations", async () => {
    const { container } = render(
      <BinLocationGrid
        aisleCode="Aisle 01 — Test Rack"
        bays={2}
        tiers={2}
        bins={TEST_BINS}
        selectedBinId="b1"
      />
    );

    expect(screen.getByText("Aisle 01 — Test Rack")).toBeInTheDocument();
    expect(screen.getAllByText("A01-01-02").length).toBeGreaterThan(0);
    expect(screen.getByText("SKU-TEST-100")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles bin selection via click and keyboard", () => {
    const handleSelect = vi.fn();
    render(
      <BinLocationGrid
        aisleCode="Aisle 01"
        bays={2}
        tiers={2}
        bins={TEST_BINS}
        onSelectBin={handleSelect}
      />
    );

    const bin2 = screen.getByLabelText(/A01-02-02/i);
    fireEvent.click(bin2);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "b2", binCode: "A01-02-02" })
    );

    const bin3 = screen.getByLabelText(/A01-01-01/i);
    fireEvent.keyDown(bin3, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "b3", isQuarantined: true })
    );
  });

  it("filters bins based on status filter buttons", () => {
    render(
      <BinLocationGrid
        aisleCode="Aisle 01"
        bays={2}
        tiers={2}
        bins={TEST_BINS}
      />
    );

    const quarantineBtn = screen.getByRole("button", { name: /Quarantine/i });
    fireEvent.click(quarantineBtn);

    const quarantinedCell = screen.getByLabelText(/A01-01-01/i);
    expect(quarantinedCell).not.toHaveClass("_binDimmed_");

    const nonQuarantinedCell = screen.getByLabelText(/A01-01-02/i);
    expect(nonQuarantinedCell.className).toMatch(/binDimmed/);
  });
});
