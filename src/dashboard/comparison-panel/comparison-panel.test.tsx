import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ComparisonPanel } from "./comparison-panel";

const defaultProps = {} as any;

describe("ComparisonPanel", () => {
  it("renders without crashing", () => {
    render(<ComparisonPanel {...defaultProps} items={[{ label: 'Revenue', current: '$1.2M', previous: '$980K', change: 22 }, { label: 'Orders', current: '3,241', previous: '2,890', change: 12 }, { label: 'Avg Ticket', current: '$370', previous: '$339', change: 9 }, { label: 'Refunds', current: '$12K', previous: '$8K', change: -50 }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ComparisonPanel {...defaultProps} items={[{ label: 'Revenue', current: '$1.2M', previous: '$980K', change: 22 }, { label: 'Orders', current: '3,241', previous: '2,890', change: 12 }, { label: 'Avg Ticket', current: '$370', previous: '$339', change: 9 }, { label: 'Refunds', current: '$12K', previous: '$8K', change: -50 }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
