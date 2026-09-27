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

  it("has zero accessibility violations", async () => {
    const { container } = render(<CandlestickChart data={SAMPLE_PRICES} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
