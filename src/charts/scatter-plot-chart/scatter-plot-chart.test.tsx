import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ScatterPlotChart } from "./scatter-plot-chart";

describe("ScatterPlotChart", () => {
  it("renders without crashing", () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    label: `Point ${i + 1}`,
  }));
    render(<ScatterPlotChart data={data} xLabel="Effort (hrs)" yLabel="Impact Score" />);
    expect(screen.getByRole('img', { name: /scatter plot chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    label: `Point ${i + 1}`,
  }));
    const { container } = render(<ScatterPlotChart data={data} xLabel="Effort (hrs)" yLabel="Impact Score" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
