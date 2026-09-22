import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CrossFilterDashboard } from "./cross-filter-dashboard";

const sampleFilters = [
  { id: "region", label: "Region", options: ["North", "South", "East", "West"] },
  { id: "quarter", label: "Quarter", options: ["Q1", "Q2", "Q3", "Q4"] },
];

describe("CrossFilterDashboard", () => {
  it("renders without crashing", () => {
    render(<CrossFilterDashboard filters={sampleFilters} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CrossFilterDashboard ref={ref} filters={sampleFilters} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CrossFilterDashboard filters={sampleFilters} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
