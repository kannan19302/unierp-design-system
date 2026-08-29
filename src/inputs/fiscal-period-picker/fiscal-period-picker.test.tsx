import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FiscalPeriodPicker } from "./fiscal-period-picker";

describe("FiscalPeriodPicker Primitive", () => {
  it("renders 4 fiscal quarters for the specified start month", () => {
    render(<FiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={4} />);
    expect(screen.getByText("FY2026:")).toBeInTheDocument();
    const select = screen.getByLabelText("Fiscal period") as HTMLSelectElement;
    expect(select.options).toHaveLength(4);
    expect(select.options[0]?.text).toContain("Apr–Jun");
  });

  it("fires onSelectPeriod on option change", () => {
    const onSelect = vi.fn();
    render(<FiscalPeriodPicker fiscalYear={2026} onSelectPeriod={onSelect} />);
    const select = screen.getByLabelText("Fiscal period");
    fireEvent.change(select, { target: { value: "FY2026-Q2" } });
    expect(onSelect).toHaveBeenCalledWith("FY2026-Q2");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FiscalPeriodPicker fiscalYear={2026} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
