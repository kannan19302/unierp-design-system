import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CompensationBandRangeVisualizer } from "./compensation-band-range-visualizer";

describe("CompensationBandRangeVisualizer", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<CompensationBandRangeVisualizer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders compensation band metrics and percentiles", () => {
    render(<CompensationBandRangeVisualizer currentOfferOrSalary={260000} />);
    expect(screen.getByText(/Total Compensation Range/i)).toBeInTheDocument();
    expect(screen.getByText("Range Minimum")).toBeInTheDocument();
    expect(screen.getByText("Compa-Ratio")).toBeInTheDocument();
    expect(screen.getByText("100.0%")).toBeInTheDocument(); // 260k / 260k
    expect(screen.getByText("Radford / Carta Global Benchmark")).toBeInTheDocument();
  });

  it("handles changing salary band selection", () => {
    const onSelect = vi.fn();
    render(<CompensationBandRangeVisualizer onSelectBand={onSelect} />);

    const select = screen.getByLabelText("Select Band / Tier:");
    fireEvent.change(select, { target: { value: "band_pm_l5_z1" } });

    expect(onSelect).toHaveBeenCalledWith("band_pm_l5_z1");
    expect(screen.getByText("Product Management Total Compensation Range")).toBeInTheDocument();
  });
});
