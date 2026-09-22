import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { HeroBlock } from "./hero";

describe("HeroBlock Primitive", () => {
  it("renders headlines and action buttons", () => {
    render(
      <HeroBlock
        title="Automate Global ERP"
        subtitle="Unify your billing, ledger, and multi-tenant supply chain."
        primaryCta="Request Demo"
      />
    );

    expect(screen.getByText("Automate Global ERP")).toBeInTheDocument();
    expect(screen.getByText(/Unify your billing/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request Demo" })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<HeroBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
