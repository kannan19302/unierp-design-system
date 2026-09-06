import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CandlestickChart } from "./candlestick-chart";

describe("CandlestickChart", () => {
  it("renders without crashing", () => {
    const data = [
    { date: '2026-01', open: 142, high: 155, low: 138, close: 150 },
    { date: '2026-02', open: 150, high: 162, low: 147, close: 145 },
    { date: '2026-03', open: 145, high: 158, low: 140, close: 156 },
    { date: '2026-04', open: 156, high: 168, low: 152, close: 160 },
    { date: '2026-05', open: 160, high: 170, low: 155, close: 153 },
    { date: '2026-06', open: 153, high: 165, low: 148, close: 163 },
    { date: '2026-07', open: 163, high: 175, low: 160, close: 172 },
  ];
    render(<CandlestickChart data={data} />);
    expect(screen.getByRole('img', { name: /candlestick chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const data = [
    { date: '2026-01', open: 142, high: 155, low: 138, close: 150 },
    { date: '2026-02', open: 150, high: 162, low: 147, close: 145 },
    { date: '2026-03', open: 145, high: 158, low: 140, close: 156 },
    { date: '2026-04', open: 156, high: 168, low: 152, close: 160 },
    { date: '2026-05', open: 160, high: 170, low: 155, close: 153 },
    { date: '2026-06', open: 153, high: 165, low: 148, close: 163 },
    { date: '2026-07', open: 163, high: 175, low: 160, close: 172 },
  ];
    const { container } = render(<CandlestickChart data={data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
