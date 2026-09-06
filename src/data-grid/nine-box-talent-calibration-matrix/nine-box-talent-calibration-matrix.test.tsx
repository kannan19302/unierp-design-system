import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  NineBoxTalentCalibrationMatrix,
  CalibratedEmployee,
} from "./nine-box-talent-calibration-matrix";

const sampleEmployees: CalibratedEmployee[] = [
  {
    id: "emp-1",
    name: "Elena Rostova",
    role: "Principal Architect",
    department: "Platform Engineering",
    performance: 3,
    potential: 3,
    tenureYears: 4.2,
    readinessForPromotion: "ready_now",
  },
  {
    id: "emp-2",
    name: "Marcus Vance",
    role: "VP Cloud Systems",
    department: "Cloud Operations",
    performance: 2,
    potential: 2,
    tenureYears: 5.5,
  },
];

describe("NineBoxTalentCalibrationMatrix", () => {
  it("renders cycle title, 9-box archetypes, and employee chips", () => {
    render(
      <NineBoxTalentCalibrationMatrix
        cycleName="2026 Leadership Calibration"
        employees={sampleEmployees}
      />
    );

    expect(screen.getByText("2026 Leadership Calibration")).toBeDefined();
    expect(screen.getByText("Star / Future Exec")).toBeDefined();
    expect(screen.getByText("Core Player")).toBeDefined();
    expect(screen.getAllByText("Elena Rostova").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Marcus Vance").length).toBeGreaterThanOrEqual(1);
  });

  it("selects employee chip and updates the profile drawer", () => {
    const handleSelect = vi.fn();

    render(
      <NineBoxTalentCalibrationMatrix
        cycleName="2026 Leadership Calibration"
        employees={sampleEmployees}
        onSelectEmployee={handleSelect}
      />
    );

    const marcusBtn = screen.getByRole("button", {
      name: /Select Marcus Vance/i,
    });
    fireEvent.click(marcusBtn);

    expect(handleSelect).toHaveBeenCalledWith(sampleEmployees[1]);
    expect(screen.getByText("VP Cloud Systems")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <NineBoxTalentCalibrationMatrix
        cycleName="2026 Leadership Calibration"
        employees={sampleEmployees}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
