import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { EmbeddedReportFrame } from "./embedded-report-frame";

const defaultProps = {} as any;

describe("EmbeddedReportFrame", () => {
  it("renders without crashing", () => {
    render(<EmbeddedReportFrame {...defaultProps} title="Q3 Revenue Report" src="https://reports.example.com/q3-revenue" />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<EmbeddedReportFrame {...defaultProps} title="Q3 Revenue Report" src="https://reports.example.com/q3-revenue" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
