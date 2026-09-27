import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DatePicker } from "./date-picker";

describe("DatePicker Primitive", () => {
  it("handles date change event", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2026-01-01" onChange={onChange} aria-label="Invoice Date" />);
    const input = screen.getByLabelText("Invoice Date");
    fireEvent.change(input, { target: { value: "2026-05-15" } });
    expect(onChange).toHaveBeenCalledWith("2026-05-15");
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<DatePicker density="compact" value="2026-09-19" />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<DatePicker density="ultra-compact" value="2026-09-19" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<DatePicker density="comfortable" value="2026-09-19" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("handles invalid state and displays error message", () => {
    render(
      <DatePicker
        label="Due Date"
        value="2024-01-01"
        invalid
        error="Date must be in the current fiscal year"
      />
    );

    const input = screen.getByLabelText("Due Date");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Date must be in the current fiscal year");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DatePicker label="Due Date" value="2026-10-10" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
