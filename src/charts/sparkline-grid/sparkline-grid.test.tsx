import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SparklineGrid } from "./sparkline-grid";

describe("SparklineGrid", () => {
  it("renders without crashing", () => {
    const rows = [
    { label: 'Revenue', values: [120, 135, 128, 145, 160, 155, 172], current: '$172K', change: 11 },
    { label: 'Users', values: [5200, 5400, 5100, 5800, 6200, 6100, 6500], current: '6,500', change: 6.5 },
    { label: 'Churn Rate', values: [3.2, 2.8, 3.1, 2.5, 2.9, 3.0, 2.7], current: '2.7%', change: -10 },
    { label: 'NPS Score', values: [42, 45, 44, 48, 50, 52, 55], current: '55', change: 5.8 },
  ];
    render(<SparklineGrid rows={rows} />);
    expect(screen.getByRole('table', { name: /sparkline grid/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const rows = [
    { label: 'Revenue', values: [120, 135, 128, 145, 160, 155, 172], current: '$172K', change: 11 },
    { label: 'Users', values: [5200, 5400, 5100, 5800, 6200, 6100, 6500], current: '6,500', change: 6.5 },
    { label: 'Churn Rate', values: [3.2, 2.8, 3.1, 2.5, 2.9, 3.0, 2.7], current: '2.7%', change: -10 },
    { label: 'NPS Score', values: [42, 45, 44, 48, 50, 52, 55], current: '55', change: 5.8 },
  ];
    const { container } = render(<SparklineGrid rows={rows} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
