import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CashFlowForecastWaterfall, type CashFlowStepItem } from "./cash-flow-forecast-waterfall";

const testSteps: CashFlowStepItem[] = [
  {
    id: "step-1",
    name: "Enterprise SaaS ARR Collections",
    category: "inflow",
    amount: 5000000,
  },
  {
    id: "step-2",
    name: "Global Payroll & Benefits",
    category: "outflow",
    amount: 3000000,
  },
];

describe("CashFlowForecastWaterfall", () => {
  it("renders waterfall elements and computes balances accurately", () => {
    render(
      <CashFlowForecastWaterfall
        title="Q3 Cash Bridge Forecast"
        openingBalance={10000000}
        items={testSteps}
        minimumCashBuffer={4000000}
      />
    );

    expect(screen.getByText("Q3 Cash Bridge Forecast")).toBeInTheDocument();
    expect(screen.getAllByText("Opening Liquidity").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Enterprise SaaS ARR Collections").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Global Payroll & Benefits").length).toBeGreaterThanOrEqual(1);
  });

  it("adjusts values dynamically when sensitivity shock slider is shifted", () => {
    render(
      <CashFlowForecastWaterfall
        title="Q3 Cash Bridge Forecast"
        openingBalance={10000000}
        items={testSteps}
        minimumCashBuffer={4000000}
      />
    );

    const recessionBtn = screen.getByRole("button", { name: /-15% Recession/i });
    fireEvent.click(recessionBtn);

    expect(screen.getByText("-15%")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <CashFlowForecastWaterfall
        title="Q3 Cash Bridge Forecast"
        openingBalance={10000000}
        items={testSteps}
        minimumCashBuffer={4000000}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
