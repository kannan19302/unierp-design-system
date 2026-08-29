import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DashboardKPICard } from "./dashboard-kpi-card";

describe("DashboardKPICard Primitive", () => {
  it("renders metric value, sparkline, and triggers click", () => {
    const onClick = vi.fn();
    render(
      <DashboardKPICard
        title="Total Revenue"
        value="$128,450"
        change={8.4}
        changeLabel="vs last month"
        trend={[10, 14, 18, 16, 24, 30]}
        onClick={onClick}
      />
    );

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("$128,450")).toBeInTheDocument();
    expect(screen.getByText(/8.4%/)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Total Revenue"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DashboardKPICard title="New Subscriptions" value="342" progress={85} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
