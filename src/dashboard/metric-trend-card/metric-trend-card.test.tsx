import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { MetricTrendCard } from "./metric-trend-card";

const defaultProps = {} as any;

describe("MetricTrendCard", () => {
  it("renders without crashing", () => {
    render(<MetricTrendCard {...defaultProps} label="Monthly Revenue" value="$184,290" change={12.5} trend={[120, 135, 128, 145, 160, 155, 172, 184]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MetricTrendCard {...defaultProps} label="Monthly Revenue" value="$184,290" change={12.5} trend={[120, 135, 128, 145, 160, 155, 172, 184]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
