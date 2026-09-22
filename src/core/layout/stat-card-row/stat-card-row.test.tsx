import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StatCardRow, type StatCardItem } from "./stat-card-row";

const MOCK_STATS: StatCardItem[] = [
  { label: "Active Tenants", value: "1,284", change: 12.5, changeLabel: "vs last month" },
  { label: "Monthly Recurring Revenue", value: "$48,200", change: -2.1 },
];

describe("StatCardRow Primitive", () => {
  it("renders stat metrics and calculated changes", () => {
    render(<StatCardRow stats={MOCK_STATS} columns={2} />);

    expect(screen.getByText("Active Tenants")).toBeInTheDocument();
    expect(screen.getByText("1,284")).toBeInTheDocument();
    expect(screen.getByText(/12.5%/)).toBeInTheDocument();
    expect(screen.getByText("$48,200")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<StatCardRow stats={MOCK_STATS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
