import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  WarehousePickPackWaveConsole,
  PickTask,
  ToteSlot,
} from "./warehouse-pick-pack-wave-console";

const sampleTasks: PickTask[] = [
  {
    id: "task-1",
    sequenceNumber: 1,
    locationBarcode: "LOC-04-B-02-14",
    locationLabel: "AISLE 04 - BAY B - SHELF 2 - BIN 14",
    sku: "AERO-NUT-500",
    itemDescription: "Locking Flange Nut",
    requiredQty: 24,
    pickedQty: 0,
    targetToteSlot: "A1",
    orderReference: "SO-99201",
    customerName: "Boeing Defense",
    isCompleted: false,
  },
];

const sampleTotes: ToteSlot[] = [
  {
    slotId: "A1",
    toteBarcode: "TOTE-9901",
    assignedOrder: "SO-99201",
    itemCount: 0,
    targetCapacity: 30,
    status: "active",
  },
];

describe("WarehousePickPackWaveConsole", () => {
  it("renders active pick location and barcode form", () => {
    render(
      <WarehousePickPackWaveConsole
        waveId="WAVE-2026-0819"
        initialTasks={sampleTasks}
        toteSlots={sampleTotes}
      />
    );

    expect(screen.getByText("Fulfillment Pick & Pack Wave Console")).toBeInTheDocument();
    expect(screen.getByText("WAVE-2026-0819")).toBeInTheDocument();
    expect(screen.getByText("AISLE 04 - BAY B - SHELF 2 - BIN 14")).toBeInTheDocument();
    expect(screen.getByText("AERO-NUT-500")).toBeInTheDocument();
    expect(screen.getByText("24 UNITS")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Scan SKU barcode/i)).toBeInTheDocument();
  });

  it("validates barcode scan and auto-completes task", () => {
    const onConfirm = vi.fn();
    render(
      <WarehousePickPackWaveConsole
        initialTasks={sampleTasks}
        toteSlots={sampleTotes}
        onConfirmPick={onConfirm}
      />
    );

    const input = screen.getByPlaceholderText(/Scan SKU barcode/i);
    const verifyBtn = screen.getByRole("button", { name: /Verify Scan/i });

    // Try incorrect scan
    fireEvent.change(input, { target: { value: "WRONG-SKU" } });
    fireEvent.click(verifyBtn);
    expect(screen.getByText(/Barcode mismatch/i)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    // Enter correct SKU
    fireEvent.change(input, { target: { value: "AERO-NUT-500" } });
    fireEvent.click(verifyBtn);
    expect(onConfirm).toHaveBeenCalledWith("task-1", "AERO-NUT-500");
    expect(screen.getByText(/All Wave Picks Completed!/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WarehousePickPackWaveConsole
        initialTasks={sampleTasks}
        toteSlots={sampleTotes}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
