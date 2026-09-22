import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DateTimePicker } from "./date-time-picker";
import { TimePicker } from "./time-picker";

describe("DateTimePicker Primitive", () => {
  it("handles datetime change", () => {
    const onChange = vi.fn();
    render(<DateTimePicker value="2026-08-29T10:00" onChange={onChange} aria-label="Meeting Time" />);
    const input = screen.getByLabelText("Meeting Time");
    fireEvent.change(input, { target: { value: "2026-08-29T11:30" } });
    expect(onChange).toHaveBeenCalledWith("2026-08-29T11:30");
  });

  it("handles time change", () => {
    const onChange = vi.fn();
    render(<TimePicker value="08:00" onChange={onChange} />);
    const input = screen.getByDisplayValue("08:00");
    fireEvent.change(input, { target: { value: "10:15" } });
    expect(onChange).toHaveBeenCalledWith("10:15");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DateTimePicker aria-label="Scheduled Time" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
