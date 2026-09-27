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

  it("navigates months when clicking header buttons", () => {
    const date = new Date(2026, 7, 15); // August 2026
    render(<Calendar selectedDate={date} />);
    expect(screen.getByText("August 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("September 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByText("August 2026")).toBeInTheDocument();
  });

  it("respects minDate and maxDate bounds", () => {
    const minDate = new Date(2026, 7, 10);
    const maxDate = new Date(2026, 7, 20);
    render(<Calendar selectedDate={new Date(2026, 7, 15)} minDate={minDate} maxDate={maxDate} />);

    const earlyDay = screen.getByRole("button", { name: new Date(2026, 7, 5).toDateString() });
    expect(earlyDay).toBeDisabled();

    const validDay = screen.getByRole("button", { name: new Date(2026, 7, 15).toDateString() });
    expect(validDay).not.toBeDisabled();

    const lateDay = screen.getByRole("button", { name: new Date(2026, 7, 25).toDateString() });
    expect(lateDay).toBeDisabled();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<Calendar density="compact" selectedDate={new Date(2026, 7, 15)} />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<Calendar density="ultra-compact" selectedDate={new Date(2026, 7, 15)} />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<Calendar density="comfortable" selectedDate={new Date(2026, 7, 15)} />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Calendar selectedDate={new Date(2026, 7, 15)} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
