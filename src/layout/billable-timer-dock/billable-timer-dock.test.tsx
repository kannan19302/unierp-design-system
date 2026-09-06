import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { BillableTimerDock } from "./billable-timer-dock";
import type { MatterOrProject } from "./billable-timer-dock";

const mockProjects: MatterOrProject[] = [
  {
    id: "proj-1",
    name: "Corporate Audit",
    code: "AUD-01",
    clientName: "Acme Corp",
    hourlyRate: 300,
  },
];

describe("BillableTimerDock", () => {

  it("renders timer dock with initial 00:00:00 display", () => {
    render(<BillableTimerDock projects={mockProjects} />);

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(screen.getByText(/AUD-01 - Corporate Audit/)).toBeInTheDocument();
  });

  it("advances seconds when started", () => {
    vi.useFakeTimers();
    render(<BillableTimerDock projects={mockProjects} />);

    const playBtn = screen.getByRole("button", { name: /Start timer/i });
    fireEvent.click(playBtn);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("00:00:03")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("toggles minimize and expand view", () => {
    render(<BillableTimerDock projects={mockProjects} />);

    expect(screen.getByText(/Matter \/ Project/i)).toBeInTheDocument();

    const collapseBtn = screen.getByRole("button", { name: /Minimize timer dock/i });
    fireEvent.click(collapseBtn);

    expect(screen.queryByText(/Matter \/ Project/i)).not.toBeInTheDocument();

    const expandBtn = screen.getByRole("button", { name: /Expand timer dock/i });
    fireEvent.click(expandBtn);

    expect(screen.getByText(/Matter \/ Project/i)).toBeInTheDocument();
  });

  it("commits logged time on Log Time button click", () => {
    vi.useFakeTimers();
    const onLogTime = vi.fn();
    render(<BillableTimerDock projects={mockProjects} onLogTime={onLogTime} />);

    const playBtn = screen.getByRole("button", { name: /Start timer/i });
    fireEvent.click(playBtn);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const logBtn = screen.getByRole("button", { name: /Log Time/i });
    fireEvent.click(logBtn);

    expect(onLogTime).toHaveBeenCalledTimes(1);
    expect(onLogTime).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "proj-1",
        durationSeconds: 5,
        isBillable: true,
      })
    );
    vi.useRealTimers();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BillableTimerDock projects={mockProjects} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
