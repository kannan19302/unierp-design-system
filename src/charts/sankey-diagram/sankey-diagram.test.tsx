import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SankeyDiagram } from "./sankey-diagram";

describe("SankeyDiagram", () => {
  it("renders without crashing", () => {
    const nodes = [
    { id: 'organic', label: 'Organic', color: '#10b981' },
    { id: 'paid', label: 'Paid Ads', color: '#2563eb' },
    { id: 'referral', label: 'Referral', color: '#8b5cf6' },
    { id: 'signup', label: 'Signups', color: '#f59e0b' },
    { id: 'trial', label: 'Trial', color: '#06b6d4' },
    { id: 'paid_plan', label: 'Paid Plan', color: '#10b981' },
  ];
  const links = [
    { source: 'organic', target: 'signup', value: 4500 },
    { source: 'paid', target: 'signup', value: 3200 },
    { source: 'referral', target: 'signup', value: 1800 },
    { source: 'signup', target: 'trial', value: 6200 },
    { source: 'signup', target: 'paid_plan', value: 3300 },
  ];
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getByRole('img', { name: /sankey diagram/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const nodes = [
    { id: 'organic', label: 'Organic', color: '#10b981' },
    { id: 'paid', label: 'Paid Ads', color: '#2563eb' },
    { id: 'referral', label: 'Referral', color: '#8b5cf6' },
    { id: 'signup', label: 'Signups', color: '#f59e0b' },
    { id: 'trial', label: 'Trial', color: '#06b6d4' },
    { id: 'paid_plan', label: 'Paid Plan', color: '#10b981' },
  ];
  const links = [
    { source: 'organic', target: 'signup', value: 4500 },
    { source: 'paid', target: 'signup', value: 3200 },
    { source: 'referral', target: 'signup', value: 1800 },
    { source: 'signup', target: 'trial', value: 6200 },
    { source: 'signup', target: 'paid_plan', value: 3300 },
  ];
    const { container } = render(<SankeyDiagram nodes={nodes} links={links} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
