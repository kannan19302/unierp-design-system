import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { AlertBanner } from "./alert-banner";

const defaultProps = {} as any;

describe("AlertBanner", () => {
  it("renders without crashing", () => {
    render(<AlertBanner {...defaultProps} variant="warning" title="Scheduled Maintenance" message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC." action={{ label: 'Learn More', onClick: () => {} }} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<AlertBanner {...defaultProps} variant="warning" title="Scheduled Maintenance" message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC." action={{ label: 'Learn More', onClick: () => {} }} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
