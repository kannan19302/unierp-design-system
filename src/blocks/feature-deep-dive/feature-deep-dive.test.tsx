import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FeatureDeepDive } from "./feature-deep-dive";

const defaultProps = {} as any;

describe("FeatureDeepDive", () => {
  it("renders without crashing", () => {
    render(<FeatureDeepDive {...defaultProps} features={[{ title: 'Real-Time Analytics', description: 'Monitor your business metrics in real-time with our advanced analytics engine. Track KPIs, revenue, and operational health.', icon: '📊' }, { title: 'Enterprise Security', description: 'Bank-grade encryption, SOC 2 compliance, and granular RBAC ensure your data is always protected.', icon: '🔒', align: 'right' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FeatureDeepDive {...defaultProps} features={[{ title: 'Real-Time Analytics', description: 'Monitor your business metrics in real-time with our advanced analytics engine. Track KPIs, revenue, and operational health.', icon: '📊' }, { title: 'Enterprise Security', description: 'Bank-grade encryption, SOC 2 compliance, and granular RBAC ensure your data is always protected.', icon: '🔒', align: 'right' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
