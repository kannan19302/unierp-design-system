import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  DrawingSheetPunchAnnotator,
  type DrawingSheetMeta,
  type PunchItemPin,
} from "./drawing-sheet-punch-annotator";

const sampleSheet: DrawingSheetMeta = {
  sheetNumber: "A-201",
  sheetTitle: "Level 2 Floorplan - West Wing Engineering Lab",
  revisionNumber: "Rev D",
  scale: "1/8\" = 1'-0\"",
  projectCode: "PRJ-BLD-882",
};

const samplePins: PunchItemPin[] = [
  {
    id: "pin-1",
    pinNumber: 1,
    posX: 32,
    posY: 38,
    trade: "electrical",
    title: "Conduit Stub-up Out of Tolerance",
    description: "Electrical feed stub-up in Elec Closet 202 is 4 inches south of wall centerline.",
    assignedSubcontractor: "Helix Electric Corp",
    dueDate: "2026-09-12",
    status: "open",
    severity: "critical",
    photoCount: 2,
  },
  {
    id: "pin-2",
    pinNumber: 2,
    posX: 68,
    posY: 28,
    trade: "hvac",
    title: "VAV Box Access Clearance Blocked",
    description: "VAV-2-04 damper actuator is obstructed by cable tray.",
    assignedSubcontractor: "Apollo Mechanical",
    dueDate: "2026-09-15",
    status: "pending_inspection",
    severity: "standard",
  },
];

describe("DrawingSheetPunchAnnotator", () => {
  it("renders blueprint sheet and interactive pin drops", () => {
    render(
      <DrawingSheetPunchAnnotator
        sheet={sampleSheet}
        initialPins={samplePins}
      />
    );

    expect(
      screen.getByText("Level 2 Floorplan - West Wing Engineering Lab")
    ).toBeDefined();
    expect(screen.getByText("A-201")).toBeDefined();
    expect(screen.getByLabelText(/Punch pin #1/i)).toBeDefined();
    expect(screen.getByLabelText(/Punch pin #2/i)).toBeDefined();
    expect(screen.getByText("Conduit Stub-up Out of Tolerance")).toBeDefined();
  });

  it("selects pin on drawing canvas and updates status", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    render(
      <DrawingSheetPunchAnnotator
        sheet={sampleSheet}
        initialPins={samplePins}
        onSelectPin={onSelect}
        onUpdatePinStatus={onUpdate}
      />
    );

    const pin2Btn = screen.getByLabelText(/Punch pin #2/i);
    fireEvent.click(pin2Btn);

    expect(onSelect).toHaveBeenCalledWith(samplePins[1]);
    expect(screen.getByText("VAV Box Access Clearance Blocked")).toBeDefined();

    const readyBtn = screen.getByText("Ready for Inspect");
    fireEvent.click(readyBtn);

    expect(onUpdate).toHaveBeenCalledWith("pin-2", "pending_inspection");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DrawingSheetPunchAnnotator
        sheet={sampleSheet}
        initialPins={samplePins}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
