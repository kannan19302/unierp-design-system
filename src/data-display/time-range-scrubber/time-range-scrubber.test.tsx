import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TimeRangeScrubber } from "./time-range-scrubber";

describe("TimeRangeScrubber", () => {
  it("renders duration presets, date inputs, and controls", () => {
    render(<TimeRangeScrubber />);

    expect(screen.getByRole("button", { name: "15M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1H" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "24H" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Timezone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Auto-Refresh Interval/i)).toBeInTheDocument();
  });

  it("updates start and end times on preset click", () => {
    const onChange = vi.fn();
    render(<TimeRangeScrubber onChange={onChange} />);

    const btn1H = screen.getByRole("button", { name: "1H" });
    fireEvent.click(btn1H);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: "1h",
      })
    );
  });

  it("updates timezone on select change", () => {
    const onChange = vi.fn();
    render(<TimeRangeScrubber onChange={onChange} />);

    const tzSelect = screen.getByLabelText(/Select Timezone/i);
    fireEvent.change(tzSelect, { target: { value: "America/New_York" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        timezone: "America/New_York",
      })
    );
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<TimeRangeScrubber />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
