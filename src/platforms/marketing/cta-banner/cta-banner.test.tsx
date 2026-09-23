import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CTABanner } from "./cta-banner";

const defaultProps = {} as any;

describe("CTABanner", () => {
  it("renders without crashing", () => {
    render(<CTABanner {...defaultProps} headline="Ready to transform your business?" subtext="Join 10,000+ companies already using UniERP to streamline their operations." primaryAction={{ label: 'Start Free Trial' }} secondaryAction={{ label: 'Schedule Demo' }} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CTABanner {...defaultProps} headline="Ready to transform your business?" subtext="Join 10,000+ companies already using UniERP to streamline their operations." primaryAction={{ label: 'Start Free Trial' }} secondaryAction={{ label: 'Schedule Demo' }} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
