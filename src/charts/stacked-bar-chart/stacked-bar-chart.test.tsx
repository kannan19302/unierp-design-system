import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StackedBarChart } from "./stacked-bar-chart";

describe("StackedBarChart", () => {
  it("renders without crashing", () => {
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const series = [
    { label: 'Product A', values: [120, 150, 180, 140, 200], color: '#2563eb' },
    { label: 'Product B', values: [80, 90, 110, 100, 130], color: '#10b981' },
    { label: 'Product C', values: [40, 60, 50, 70, 55], color: '#f59e0b' },
  ];
    render(<StackedBarChart categories={categories} series={series} />);
    expect(screen.getByRole('img', { name: /stacked bar chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const series = [
    { label: 'Product A', values: [120, 150, 180, 140, 200], color: '#2563eb' },
    { label: 'Product B', values: [80, 90, 110, 100, 130], color: '#10b981' },
    { label: 'Product C', values: [40, 60, 50, 70, 55], color: '#f59e0b' },
  ];
    const { container } = render(<StackedBarChart categories={categories} series={series} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
