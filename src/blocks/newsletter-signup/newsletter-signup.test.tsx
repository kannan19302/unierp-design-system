import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { NewsletterSignup } from "./newsletter-signup";

const defaultProps = {} as any;

describe("NewsletterSignup", () => {
  it("renders without crashing", () => {
    render(<NewsletterSignup {...defaultProps} title="Stay in the Loop" subtitle="Product updates, engineering insights, and industry best practices." />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<NewsletterSignup {...defaultProps} title="Stay in the Loop" subtitle="Product updates, engineering insights, and industry best practices." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
