import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Scheduler } from "./scheduler";

describe("Scheduler Input", () => {
  it("renders schedule events and hours", () => {
    const events = [{ id: "1", title: "Project Sync", startHour: 10 }];
    render(<Scheduler events={events} />);
    expect(screen.getByRole("region", { name: "Schedule View" })).toBeInTheDocument();
    expect(screen.getByText("Project Sync")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<Scheduler density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<Scheduler density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("triggers onAddEvent when slot is clicked", () => {
    const onAddEvent = vi.fn();
    render(<Scheduler onAddEvent={onAddEvent} startHour={9} endHour={11} />);

    const slot9 = screen.getByRole("row", { name: /time slot 09:00/i });
    fireEvent.click(slot9);
    expect(onAddEvent).toHaveBeenCalledWith(9);
  });

  it("triggers onEventClick when event card is clicked", () => {
    const onEventClick = vi.fn();
    const event = { id: "e1", title: "Audit Meeting", startHour: 10 };
    render(<Scheduler events={[event]} onEventClick={onEventClick} />);

    const eventBtn = screen.getByRole("button", { name: /audit meeting/i });
    fireEvent.click(eventBtn);
    expect(onEventClick).toHaveBeenCalledWith(event);
  });

  it("navigates previous and next days when onDateChange is supplied", () => {
    const onDateChange = vi.fn();
    const initialDate = new Date(2026, 8, 23);
    render(<Scheduler date={initialDate} onDateChange={onDateChange} />);

    const prevBtn = screen.getByRole("button", { name: /previous day/i });
    fireEvent.click(prevBtn);
    expect(onDateChange).toHaveBeenCalled();

    const nextBtn = screen.getByRole("button", { name: /next day/i });
    fireEvent.click(nextBtn);
    expect(onDateChange).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Scheduler
        title="Testing Shift"
        events={[{ id: "1", title: "Review", startHour: 9 }]}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
