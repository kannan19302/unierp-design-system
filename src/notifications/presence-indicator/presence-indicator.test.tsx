import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PresenceIndicator } from "./presence-indicator";

const defaultProps = {} as any;

describe("PresenceIndicator", () => {
  it("renders without crashing", () => {
    render(<PresenceIndicator {...defaultProps} status="online" name="Jane Smith" statusMessage="In a meeting until 3 PM" />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<PresenceIndicator {...defaultProps} status="online" name="Jane Smith" statusMessage="In a meeting until 3 PM" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
