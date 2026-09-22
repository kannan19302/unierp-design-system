import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { MetricTrendCard } from "./metric-trend-card";

describe("MetricTrendCard", () => {
  it("renders without crashing", () => {
    render(
      <MetricTrendCard
        label="Monthly Revenue"
        value="$184,290"
        change={12.5}
        trend={[120, 135, 128, 145, 160, 155, 172, 184]}
      />
    );
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<MetricTrendCard ref={ref} label="Monthly Revenue" value="$184,290" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MetricTrendCard
        label="Monthly Revenue"
        value="$184,290"
        change={12.5}
        trend={[120, 135, 128, 145, 160, 155, 172, 184]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
