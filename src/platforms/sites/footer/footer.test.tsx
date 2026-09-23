import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Footer } from "./footer";

describe("Footer Layout Component", () => {
  it("renders product variant with copyright and legal links", () => {
    render(
      <Footer
        variant="product"
        copyright="© 2026 Test Corp"
        legalLinks={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ]}
      />
    );

    expect(screen.getByText("© 2026 Test Corp")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("renders marketing variant with sections and tagline", () => {
    render(
      <Footer
        variant="marketing"
        tagline="Enterprise cloud platform"
        sections={[
          {
            title: "Products",
            links: [{ label: "Financials", href: "/fin" }],
          },
        ]}
      />
    );

    expect(screen.getByText("Enterprise cloud platform")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Financials" })).toHaveAttribute("href", "/fin");
  });

  it("has zero accessibility violations in product variant", async () => {
    const { container } = render(
      <Footer
        variant="product"
        legalLinks={[{ label: "Privacy", href: "/privacy" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in marketing variant", async () => {
    const { container } = render(
      <Footer
        variant="marketing"
        sections={[
          {
            title: "Explore",
            links: [{ label: "Overview", href: "/overview" }],
          },
        ]}
        legalLinks={[{ label: "Terms", href: "/terms" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
