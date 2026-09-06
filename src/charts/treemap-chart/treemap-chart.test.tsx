import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TreemapChart } from "./treemap-chart";

describe("TreemapChart", () => {
  it("renders without crashing", () => {
    const data = [
    { label: 'Engineering', value: 450000 },
    { label: 'Marketing', value: 280000 },
    { label: 'Sales', value: 320000 },
    { label: 'Support', value: 150000 },
    { label: 'HR', value: 95000 },
    { label: 'Legal', value: 75000 },
  ];
    render(<TreemapChart data={data} />);
    expect(screen.getByRole('img', { name: /treemap chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const data = [
    { label: 'Engineering', value: 450000 },
    { label: 'Marketing', value: 280000 },
    { label: 'Sales', value: 320000 },
    { label: 'Support', value: 150000 },
    { label: 'HR', value: 95000 },
    { label: 'Legal', value: 75000 },
  ];
    const { container } = render(<TreemapChart data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
