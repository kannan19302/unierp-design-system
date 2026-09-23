import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SegmentedControl } from "./segmented-control";

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month", disabled: true },
  { value: "year", label: "Year" },
];

describe("Strata V1 SegmentedControl Primitive", () => {
  it("renders all options and active state", () => {
    render(<SegmentedControl options={OPTIONS} value="day" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange on click", () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} value="day" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Week" }));
    expect(onChange).toHaveBeenCalledWith("week");
  });

  it("does not select disabled segment", () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} value="day" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard arrow navigation skipping disabled options", () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} value="week" onChange={onChange} />);
    const weekBtn = screen.getByRole("radio", { name: "Week" });

    // ArrowRight should skip "month" (disabled) and land on "year"
    fireEvent.keyDown(weekBtn, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("year");
  });

  it("has zero accessibility violations across sizes", async () => {
    const { container, rerender } = render(
      <SegmentedControl options={OPTIONS} value="day" onChange={() => {}} />
    );
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(
      <SegmentedControl size="sm" fullWidth options={OPTIONS} value="year" onChange={() => {}} />
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
