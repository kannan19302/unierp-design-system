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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<DateTimePicker density="compact" value="2026-09-19T10:00" />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<DateTimePicker density="ultra-compact" value="2026-09-19T10:00" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<DateTimePicker density="comfortable" value="2026-09-19T10:00" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("handles invalid state and displays error message", () => {
    render(
      <DateTimePicker
        label="Departure Datetime"
        value="2024-01-01T00:00"
        invalid
        error="Date cannot be in the past"
      />
    );

    const input = screen.getByLabelText("Departure Datetime");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Date cannot be in the past");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DateTimePicker label="Scheduled Time" value="2026-09-23T14:00" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
