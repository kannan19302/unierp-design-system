import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Calendar } from "./calendar";

describe("Calendar Input", () => {
  it("renders calendar and triggers onSelectDate", () => {
    const handleSelect = vi.fn();
    const date = new Date(2026, 7, 15);
    render(<Calendar selectedDate={date} onSelectDate={handleSelect} />);
    expect(screen.getByRole("region", { name: "Calendar" })).toBeInTheDocument();
    const dayBtn = screen.getByRole("button", { name: new Date(2026, 7, 20).toDateString() });
    fireEvent.click(dayBtn);
    expect(handleSelect).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Calendar selectedDate={new Date(2026, 7, 15)} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
