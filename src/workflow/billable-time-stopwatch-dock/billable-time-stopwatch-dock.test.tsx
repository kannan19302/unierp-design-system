import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BillableTimeStopwatchDock } from "./billable-time-stopwatch-dock";

const mockMatters = [
  {
    id: "m-1",
    clientName: "Stripe Global Inc.",
    matterCode: "MAT-2026-904",
    matterTitle: "Series D Financing",
    defaultHourlyRate: 600,
  },
  {
    id: "m-2",
    clientName: "Brex Corp.",
    matterCode: "MAT-2026-412",
    matterTitle: "Cross-Border Advisory",
    defaultHourlyRate: 500,
  },
];

describe("BillableTimeStopwatchDock", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(<BillableTimeStopwatchDock matters={mockMatters} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders dock title and initial stopped state", () => {
    render(<BillableTimeStopwatchDock matters={mockMatters} />);
    expect(screen.getByText("Legal & Professional Services Billable Time Dock")).toBeInTheDocument();
    expect(screen.getByText("○ STOPPED")).toBeInTheDocument();
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });

  it("starts and pauses timer on button click", () => {
    vi.useFakeTimers();
    try {
      render(<BillableTimeStopwatchDock matters={mockMatters} />);
      const startBtn = screen.getByRole("button", { name: /start time capture/i });

      fireEvent.click(startBtn);
      expect(screen.getByText("● RECORDING")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText("00:00:03")).toBeInTheDocument();

      const pauseBtn = screen.getByRole("button", { name: /pause time capture/i });
      fireEvent.click(pauseBtn);
      expect(screen.getByText("○ STOPPED")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("commits time entry with onCommitTimeEntry callback", () => {
    vi.useFakeTimers();
    try {
      const handleCommit = vi.fn();
      render(
        <BillableTimeStopwatchDock
          matters={mockMatters}
          onCommitTimeEntry={handleCommit}
        />
      );

      const startBtn = screen.getByRole("button", { name: /start time capture/i });
      fireEvent.click(startBtn);

      act(() => {
        vi.advanceTimersByTime(3600000); // 1 hour = 3600 seconds
      });

      const descInput = screen.getByPlaceholderText(/Drafting Section 4.2/i);
      fireEvent.change(descInput, { target: { value: "Reviewing loan covenant" } });

      const commitBtn = screen.getByRole("button", { name: /commit time entry/i });
      fireEvent.click(commitBtn);

      expect(handleCommit).toHaveBeenCalledWith({
        matterId: "m-1",
        secondsElapsed: 3600,
        hourlyRate: 600,
        isBillable: true,
        description: "Reviewing loan covenant",
      });
    } finally {
      vi.useRealTimers();
    }
  });
});
