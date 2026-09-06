import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ComparisonTable } from "./comparison-table";

const defaultProps = {} as any;

describe("ComparisonTable", () => {
  it("renders without crashing", () => {
    render(<ComparisonTable {...defaultProps} plans={[{ id: 'starter', name: 'Starter', price: '$29/mo', cta: 'Get Started' }, { id: 'pro', name: 'Pro', price: '$99/mo', cta: 'Start Free Trial' }, { id: 'enterprise', name: 'Enterprise', price: 'Custom', cta: 'Contact Sales' }]} features={[{ label: 'Users', values: { starter: '5', pro: '25', enterprise: 'Unlimited' } }, { label: 'Storage', values: { starter: '10GB', pro: '100GB', enterprise: '1TB' } }, { label: 'API Access', values: { starter: false, pro: true, enterprise: true } }, { label: 'SSO', values: { starter: false, pro: false, enterprise: true } }]} highlightPlan="pro" />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ComparisonTable {...defaultProps} plans={[{ id: 'starter', name: 'Starter', price: '$29/mo', cta: 'Get Started' }, { id: 'pro', name: 'Pro', price: '$99/mo', cta: 'Start Free Trial' }, { id: 'enterprise', name: 'Enterprise', price: 'Custom', cta: 'Contact Sales' }]} features={[{ label: 'Users', values: { starter: '5', pro: '25', enterprise: 'Unlimited' } }, { label: 'Storage', values: { starter: '10GB', pro: '100GB', enterprise: '1TB' } }, { label: 'API Access', values: { starter: false, pro: true, enterprise: true } }, { label: 'SSO', values: { starter: false, pro: false, enterprise: true } }]} highlightPlan="pro" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
