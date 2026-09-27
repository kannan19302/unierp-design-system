import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SparklineGrid, Sparkline } from "./sparkline";

const SAMPLE_ROWS = [
  { label: "Revenue", values: [100, 120, 115, 140, 160], current: "$160k", change: 14.2 },
  { label: "Expenses", values: [80, 85, 90, 88, 82], current: "$82k", change: -6.8 },
];

describe("SparklineGrid", () => {
  it("renders rows and metric values correctly", () => {
    render(<SparklineGrid rows={SAMPLE_ROWS} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$160k")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SparklineGrid ref={ref} rows={SAMPLE_ROWS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(<SparklineGrid rows={SAMPLE_ROWS} />);
    expect(container.querySelector('[data-slot="sparkline-grid"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sparkline-table"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="sparkline-header-cell"]').length).toBe(4);
    expect(container.querySelectorAll('[data-slot="sparkline-row"]').length).toBe(2);
    expect(container.querySelectorAll('[data-slot="sparkline-cell"]').length).toBe(2);
    expect(container.querySelectorAll('[data-slot="sparkline-chart-cell"]').length).toBe(2);
    expect(container.querySelectorAll('[data-slot="sparkline-num-cell"]').length).toBe(2);
    expect(container.querySelectorAll('[data-slot="sparkline-change-cell"]').length).toBe(2);
    expect(container.querySelectorAll('[data-slot="sparkline-mini-chart"]').length).toBe(2);
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <SparklineGrid density={density} rows={SAMPLE_ROWS} />
      );
      const root = container.querySelector('[data-slot="sparkline-grid"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("works with Sparkline alias", () => {
    render(<Sparkline rows={SAMPLE_ROWS} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SparklineGrid rows={SAMPLE_ROWS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
