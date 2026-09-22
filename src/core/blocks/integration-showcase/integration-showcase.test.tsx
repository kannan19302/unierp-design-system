import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { IntegrationShowcase } from "./integration-showcase";

const defaultProps = {} as any;

describe("IntegrationShowcase", () => {
  it("renders without crashing", () => {
    render(<IntegrationShowcase {...defaultProps} integrations={[{ name: 'Slack', icon: '💬', category: 'Communication' }, { name: 'Stripe', icon: '💳', category: 'Payments' }, { name: 'AWS', icon: '☁️', category: 'Cloud' }, { name: 'GitHub', icon: '🐙', category: 'Dev Tools' }, { name: 'Salesforce', icon: '☁️', category: 'CRM' }, { name: 'Jira', icon: '📋', category: 'Dev Tools' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<IntegrationShowcase {...defaultProps} integrations={[{ name: 'Slack', icon: '💬', category: 'Communication' }, { name: 'Stripe', icon: '💳', category: 'Payments' }, { name: 'AWS', icon: '☁️', category: 'Cloud' }, { name: 'GitHub', icon: '🐙', category: 'Dev Tools' }, { name: 'Salesforce', icon: '☁️', category: 'CRM' }, { name: 'Jira', icon: '📋', category: 'Dev Tools' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
