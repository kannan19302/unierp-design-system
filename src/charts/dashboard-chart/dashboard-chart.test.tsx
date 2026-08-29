import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DashboardChart } from "./dashboard-chart";

// Mock recharts responsive container for jsdom
vi.mock("recharts", async () => {
  const original = await vi.importActual("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

const MOCK_DATA = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 5000, expenses: 2800 },
];

describe("DashboardChart Primitive", () => {
  it("renders title, subtitle, and responsive chart wrapper", () => {
    render(
      <DashboardChart
        title="Monthly P&L"
        subtitle="Revenue vs Operating Expenses"
        data={MOCK_DATA}
        config={{
          xAxisKey: "month",
          series: [
            { dataKey: "revenue", name: "Revenue" },
            { dataKey: "expenses", name: "Expenses" },
          ],
        }}
      />
    );

    expect(screen.getByText("Monthly P&L")).toBeInTheDocument();
    expect(screen.getByText("Revenue vs Operating Expenses")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DashboardChart
        title="P&L Chart"
        data={MOCK_DATA}
        config={{
          xAxisKey: "month",
          series: [{ dataKey: "revenue", name: "Revenue" }],
        }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
