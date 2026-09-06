import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { WaterfallChart } from "./waterfall-chart";

describe("WaterfallChart", () => {
  it("renders without crashing", () => {
    const sampleData = [
    { label: 'Revenue', value: 1200000 },
    { label: 'COGS', value: -450000 },
    { label: 'OpEx', value: -320000 },
    { label: 'Tax', value: -85000 },
    { label: 'Net Income', value: 345000, isTotal: true },
  ];
    render(<WaterfallChart data={sampleData} />);
    expect(screen.getByRole('img', { name: /waterfall chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const sampleData = [
    { label: 'Revenue', value: 1200000 },
    { label: 'COGS', value: -450000 },
    { label: 'OpEx', value: -320000 },
    { label: 'Tax', value: -85000 },
    { label: 'Net Income', value: 345000, isTotal: true },
  ];
    const { container } = render(<WaterfallChart data={sampleData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
