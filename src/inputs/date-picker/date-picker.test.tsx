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

  it("has zero accessibility violations", async () => {
    const { container } = render(<DatePicker aria-label="Due Date" value="2026-10-10" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
