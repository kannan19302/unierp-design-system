import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PricingBlock } from "./pricing";

describe("PricingBlock Primitive", () => {
  it("renders plan tiers and prices", () => {
    render(<PricingBlock title="Subscription Tiers" />);
    expect(screen.getByText("Subscription Tiers")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("$99/mo")).toBeInTheDocument();
    expect(screen.getByText("RECOMMENDED")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<PricingBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
