import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SiteShell } from "./site-shell";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

describe("SiteShell Layout Component", () => {
  it("renders brand name, navigation, and CTA button", () => {
    render(
      <SiteShell
        brandName="Acme Corp"
        navItems={navItems}
        ctaButton={{ label: "Sign In", href: "/login" }}
      >
        <div>Site Body Content</div>
      </SiteShell>
    );

    expect(screen.getAllByText("Acme Corp").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute("href", "/features");
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login");
    expect(screen.getByText("Site Body Content")).toBeInTheDocument();
  });

  it("toggles mobile menu when toggle button is clicked", () => {
    const { container } = render(
      <SiteShell brandName="Acme Corp" navItems={navItems}>
        <div>Content</div>
      </SiteShell>
    );

    const toggle = container.querySelector(
      'button[aria-controls="mobile-nav-panel"]'
    ) as HTMLButtonElement;
    expect(toggle).toBeInTheDocument();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector("#mobile-nav-panel")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SiteShell
        brandName="Acme Corp"
        navItems={navItems}
        ctaButton={{ label: "Get Started", href: "/signup" }}
      >
        <div>Content</div>
      </SiteShell>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
