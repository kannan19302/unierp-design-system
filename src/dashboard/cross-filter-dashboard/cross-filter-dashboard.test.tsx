import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CrossFilterDashboard } from "./cross-filter-dashboard";

const defaultProps = {} as any;

describe("CrossFilterDashboard", () => {
  it("renders without crashing", () => {
    render(<CrossFilterDashboard {...defaultProps} filters={[{ id: 'region', label: 'Region', options: ['North', 'South', 'East', 'West'] }, { id: 'quarter', label: 'Quarter', options: ['Q1', 'Q2', 'Q3', 'Q4'] }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CrossFilterDashboard {...defaultProps} filters={[{ id: 'region', label: 'Region', options: ['North', 'South', 'East', 'West'] }, { id: 'quarter', label: 'Quarter', options: ['Q1', 'Q2', 'Q3', 'Q4'] }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
