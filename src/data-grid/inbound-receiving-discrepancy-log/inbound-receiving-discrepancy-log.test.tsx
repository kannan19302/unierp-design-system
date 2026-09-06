import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  InboundReceivingDiscrepancyLog,
  InboundReceivingLine,
} from "./inbound-receiving-discrepancy-log";

const sampleLines: InboundReceivingLine[] = [
  {
    id: "rcv_line_01",
    sku: "AV-TURB-772",
    description: "Titanium Compressor Rotor Blade",
    expectedUnits: 500,
    receivedUnits: 480,
    damagedUnits: 5,
    discrepancyUnits: -20,
    lotNumber: "LOT-2026-B81",
    disposition: "QUARANTINED",
  },
  {
    id: "rcv_line_02",
    sku: "AV-SEAL-104",
    description: "Hydraulic O-Ring Nitrile",
    expectedUnits: 2000,
    receivedUnits: 2000,
    damagedUnits: 0,
    discrepancyUnits: 0,
    lotNumber: "LOT-2026-A12",
    disposition: "ACCEPTED",
  },
];

describe("InboundReceivingDiscrepancyLog", () => {
  it("renders PO header and receiving line details truthfully", () => {
    render(
      <InboundReceivingDiscrepancyLog
        poNumber="PO-2026-9914"
        supplierName="Honeywell Aerospace"
        lines={sampleLines}
      />
    );
    expect(
      screen.getByText(/Dock Inbound Shipment Receiving & Quality Inspection/i)
    ).toBeInTheDocument();
    expect(screen.getByText("PO-2026-9914")).toBeInTheDocument();
    expect(screen.getByText("Honeywell Aerospace", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("AV-TURB-772")).toBeInTheDocument();
    expect(screen.getByText("AV-SEAL-104")).toBeInTheDocument();
  });

  it("handles updating line item disposition", () => {
    const handleUpdate = vi.fn();
    render(
      <InboundReceivingDiscrepancyLog
        lines={sampleLines}
        onUpdateDisposition={handleUpdate}
      />
    );

    const actionSelect = screen.getByLabelText("Update disposition for SKU AV-TURB-772");
    fireEvent.change(actionSelect, { target: { value: "ACCEPTED" } });

    expect(handleUpdate).toHaveBeenCalledWith("rcv_line_01", "ACCEPTED");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<InboundReceivingDiscrepancyLog lines={sampleLines} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
