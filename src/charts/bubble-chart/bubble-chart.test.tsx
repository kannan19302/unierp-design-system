import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BubbleChart } from "./bubble-chart";

describe("BubbleChart", () => {
  it("renders without crashing", () => {
    const data = [
    { x: 45, y: 78, size: 120, label: 'Product A' },
    { x: 72, y: 55, size: 80, label: 'Product B' },
    { x: 30, y: 90, size: 200, label: 'Product C' },
    { x: 85, y: 40, size: 60, label: 'Product D' },
    { x: 55, y: 65, size: 150, label: 'Product E' },
  ];
    render(<BubbleChart data={data} xLabel="Market Share (%)" yLabel="Growth Rate (%)" />);
    expect(screen.getByRole('img', { name: /bubble chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const data = [
    { x: 45, y: 78, size: 120, label: 'Product A' },
    { x: 72, y: 55, size: 80, label: 'Product B' },
    { x: 30, y: 90, size: 200, label: 'Product C' },
    { x: 85, y: 40, size: 60, label: 'Product D' },
    { x: 55, y: 65, size: 150, label: 'Product E' },
  ];
    const { container } = render(<BubbleChart data={data} xLabel="Market Share (%)" yLabel="Growth Rate (%)" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
