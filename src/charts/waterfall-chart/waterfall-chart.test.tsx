import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { WaterfallChart } from "./waterfall-chart";

const SAMPLE_DATA = [
  { label: "Starting Cash", value: 100000, isTotal: true },
  { label: "Revenue", value: 45000 },
];

describe("WaterfallChart", () => {
  it("renders without crashing and displays data labels", () => {
    render(<WaterfallChart data={SAMPLE_DATA} />);
    expect(screen.getByRole("img", { name: /waterfall chart/i })).toBeInTheDocument();
    expect(screen.getByText("Starting Cash")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<WaterfallChart ref={ref} data={SAMPLE_DATA} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <WaterfallChart data={SAMPLE_DATA} />
    );
    expect(container.querySelector('[data-slot="waterfall-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="waterfall-chart-bars"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="waterfall-chart-bar-group"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="waterfall-chart-bar-value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="waterfall-chart-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="waterfall-chart-bar-label"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <WaterfallChart
          density={density}
          data={SAMPLE_DATA}
        />
      );
      const root = container.querySelector('[data-slot="waterfall-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WaterfallChart data={SAMPLE_DATA} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
