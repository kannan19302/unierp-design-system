import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { EscalationAlertStack } from "./escalation-alert-stack";

const defaultProps = {} as any;

describe("EscalationAlertStack", () => {
  it("renders without crashing", () => {
    render(<EscalationAlertStack {...defaultProps} alerts={[{ id: '1', title: 'Database CPU at 98%', severity: 'critical', timestamp: '30s ago', source: 'prod-db-01' }, { id: '2', title: 'API Error Rate > 5%', severity: 'high', timestamp: '2 min ago', source: 'api-gateway' }]} onAcknowledge={() => {}} onSnooze={() => {}} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<EscalationAlertStack {...defaultProps} alerts={[{ id: '1', title: 'Database CPU at 98%', severity: 'critical', timestamp: '30s ago', source: 'prod-db-01' }, { id: '2', title: 'API Error Rate > 5%', severity: 'high', timestamp: '2 min ago', source: 'api-gateway' }]} onAcknowledge={() => {}} onSnooze={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
