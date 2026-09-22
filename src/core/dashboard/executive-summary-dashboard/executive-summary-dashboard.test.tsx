import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ExecutiveSummaryDashboard } from "./executive-summary-dashboard";

const sampleMetrics = [
  { label: "Revenue", value: "$2.4M", change: 12 },
  { label: "Customers", value: "1,847", change: 8 },
  { label: "MRR", value: "$198K", change: -3 },
  { label: "NPS", value: "72", change: 5 },
];

describe("ExecutiveSummaryDashboard", () => {
  it("renders without crashing", () => {
    render(<ExecutiveSummaryDashboard metrics={sampleMetrics} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ExecutiveSummaryDashboard ref={ref} metrics={sampleMetrics} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ExecutiveSummaryDashboard metrics={sampleMetrics} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
