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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<FiscalPeriodPicker density="compact" fiscalYear={2026} />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<FiscalPeriodPicker density="ultra-compact" fiscalYear={2026} />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<FiscalPeriodPicker density="comfortable" fiscalYear={2026} />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("handles invalid state and displays error message", () => {
    render(
      <FiscalPeriodPicker
        label="Quarter"
        fiscalYear={2026}
        invalid
        error="Period is locked"
      />
    );

    const select = screen.getByLabelText("Quarter");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Period is locked");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FiscalPeriodPicker label="Fiscal Period" fiscalYear={2026} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
