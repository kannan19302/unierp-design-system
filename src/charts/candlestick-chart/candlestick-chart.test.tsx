import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CandlestickChart } from "./candlestick-chart";

const SAMPLE_PRICES = [
  { date: "2024-01-01", open: 150, high: 155, low: 148, close: 154 },
  { date: "2024-01-02", open: 154, high: 158, low: 152, close: 151 },
];

describe("CandlestickChart", () => {
  it("renders without crashing", () => {
    render(<CandlestickChart data={SAMPLE_PRICES} />);
    expect(
      screen.getByRole("img", { name: /candlestick chart/i })
    ).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CandlestickChart ref={ref} data={SAMPLE_PRICES} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <CandlestickChart data={SAMPLE_PRICES} />
    );
    expect(container.querySelector('[data-slot="candlestick-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="candlestick-chart-svg"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="candlestick-chart-candle"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="candlestick-chart-wick"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="candlestick-chart-body"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <CandlestickChart
          density={density}
          data={SAMPLE_PRICES}
        />
      );
      const root = container.querySelector('[data-slot="candlestick-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CandlestickChart data={SAMPLE_PRICES} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
