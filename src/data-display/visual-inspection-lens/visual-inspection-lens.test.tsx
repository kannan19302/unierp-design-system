import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VisualInspectionLens, InspectionPin } from "./visual-inspection-lens";

const TEST_PINS: InspectionPin[] = [
  {
    id: "p1",
    xPercent: 25,
    yPercent: 30,
    label: "PIN-01",
    description: "Crack detected in foundation wall",
    status: "flagged",
  },
  {
    id: "p2",
    xPercent: 75,
    yPercent: 60,
    label: "PIN-02",
    description: "Rebar spacing verified",
    status: "resolved",
  },
];

describe("VisualInspectionLens", () => {
  it("renders images, slider and has zero accessibility violations", async () => {
    const { container } = render(
      <VisualInspectionLens
        baseImageUrl="/test-base.png"
        baseLabel="Rev A"
        revisedImageUrl="/test-revised.png"
        revisedLabel="Rev B"
        pins={TEST_PINS}
      />
    );

    expect(screen.getByText("Visual Inspection & Revision Diff")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /Image comparison split position/i })).toBeInTheDocument();
    expect(screen.getByText("PIN-01")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles keyboard navigation on the split slider", () => {
    render(
      <VisualInspectionLens
        baseImageUrl="/test-base.png"
        revisedImageUrl="/test-revised.png"
        initialSplitPercent={50}
      />
    );

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "52");

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    fireEvent.keyDown(slider, { key: "Home" });
    expect(slider).toHaveAttribute("aria-valuenow", "0");

    fireEvent.keyDown(slider, { key: "End" });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
  });

  it("switches modes between split curtain and opacity overlay", () => {
    render(
      <VisualInspectionLens
        baseImageUrl="/test-base.png"
        revisedImageUrl="/test-revised.png"
      />
    );

    const overlayBtn = screen.getByRole("button", { name: /Opacity Fade/i });
    fireEvent.click(overlayBtn);

    expect(screen.getByLabelText(/Layer Transparency/i)).toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: /Image comparison split position/i })).not.toBeInTheDocument();
  });

  it("displays details card when an inspection pin is clicked", () => {
    const handlePinClick = vi.fn();
    render(
      <VisualInspectionLens
        baseImageUrl="/test-base.png"
        revisedImageUrl="/test-revised.png"
        pins={TEST_PINS}
        onPinClick={handlePinClick}
      />
    );

    const pin1Btn = screen.getByRole("button", { name: /PIN-01/i });
    fireEvent.click(pin1Btn);

    expect(handlePinClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "p1", label: "PIN-01" })
    );
    expect(screen.getByText("Crack detected in foundation wall")).toBeInTheDocument();
  });
});
