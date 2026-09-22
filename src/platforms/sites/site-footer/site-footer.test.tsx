import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SiteFooter } from "./site-footer";

describe("SiteFooter Component", () => {
  it("renders contentinfo footer with copyright", () => {
    render(<SiteFooter copyrightText="© 2026 Test Enterprise" />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("© 2026 Test Enterprise")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SiteFooter />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
