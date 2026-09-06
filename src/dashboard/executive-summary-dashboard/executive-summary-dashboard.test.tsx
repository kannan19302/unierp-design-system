import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ExecutiveSummaryDashboard } from "./executive-summary-dashboard";

const defaultProps = {} as any;

describe("ExecutiveSummaryDashboard", () => {
  it("renders without crashing", () => {
    render(<ExecutiveSummaryDashboard {...defaultProps} metrics={[{ label: 'Revenue', value: '$2.4M', change: 12 }, { label: 'Customers', value: '1,847', change: 8 }, { label: 'MRR', value: '$198K', change: -3 }, { label: 'NPS', value: '72', change: 5 }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ExecutiveSummaryDashboard {...defaultProps} metrics={[{ label: 'Revenue', value: '$2.4M', change: 12 }, { label: 'Customers', value: '1,847', change: 8 }, { label: 'MRR', value: '$198K', change: -3 }, { label: 'NPS', value: '72', change: 5 }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
