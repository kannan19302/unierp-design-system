import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PivotGrid } from "../pivot-grid";

const mockSales = [
  { region: "East", quarter: "Q1", revenue: 100 },
  { region: "East", quarter: "Q2", revenue: 200 },
  { region: "West", quarter: "Q1", revenue: 150 },
  { region: "West", quarter: "Q2", revenue: 300 },
];

describe("PivotGrid Primitive", () => {
  it("renders dimension headers and calculated totals", () => {
    render(
      <PivotGrid
        data={mockSales}
        rowDimension="region"
        columnDimension="quarter"
        metric="revenue"
        aggregation="sum"
      />
    );

    expect(screen.getByText("East")).toBeInTheDocument();
    expect(screen.getByText("West")).toBeInTheDocument();
    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText("Q2")).toBeInTheDocument();
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PivotGrid
        data={mockSales}
        rowDimension="region"
        columnDimension="quarter"
        metric="revenue"
        aggregation="sum"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
