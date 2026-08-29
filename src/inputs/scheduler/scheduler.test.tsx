import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("has zero accessibility violations", async () => {
    const { container } = render(<Scheduler events={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
