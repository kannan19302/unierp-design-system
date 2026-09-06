import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RadarChart } from "./radar-chart";

describe("RadarChart", () => {
  it("renders without crashing", () => {
    const axes = ['Speed', 'Reliability', 'Cost', 'Support', 'Features'];
  const datasets = [
    { label: 'Product A', values: [80, 90, 60, 70, 85], color: '#2563eb' },
    { label: 'Product B', values: [65, 75, 90, 80, 60], color: '#10b981' },
  ];
    render(<RadarChart axes={axes} datasets={datasets} />);
    expect(screen.getByRole('img', { name: /radar chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const axes = ['Speed', 'Reliability', 'Cost', 'Support', 'Features'];
  const datasets = [
    { label: 'Product A', values: [80, 90, 60, 70, 85], color: '#2563eb' },
    { label: 'Product B', values: [65, 75, 90, 80, 60], color: '#10b981' },
  ];
    const { container } = render(<RadarChart axes={axes} datasets={datasets} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
