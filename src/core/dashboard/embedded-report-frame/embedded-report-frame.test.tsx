import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { EmbeddedReportFrame } from "./embedded-report-frame";

describe("EmbeddedReportFrame", () => {
  it("renders without crashing", () => {
    render(
      <EmbeddedReportFrame
        title="Q3 Revenue Report"
        src="https://reports.example.com/q3-revenue"
      />
    );
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmbeddedReportFrame ref={ref} title="Q3 Revenue Report" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <EmbeddedReportFrame
        title="Q3 Revenue Report"
        src="https://reports.example.com/q3-revenue"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
