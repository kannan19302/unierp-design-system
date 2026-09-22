import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StatsCounter } from "./stats-counter";

const defaultProps = {} as any;

describe("StatsCounter", () => {
  it("renders without crashing", () => {
    render(<StatsCounter {...defaultProps} stats={[{ value: '10,000+', label: 'Customers Worldwide' }, { value: '99.99%', label: 'Uptime SLA' }, { value: '$2B+', label: 'Transactions Processed' }, { value: '150+', label: 'Countries Served' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<StatsCounter {...defaultProps} stats={[{ value: '10,000+', label: 'Customers Worldwide' }, { value: '99.99%', label: 'Uptime SLA' }, { value: '$2B+', label: 'Transactions Processed' }, { value: '150+', label: 'Countries Served' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
