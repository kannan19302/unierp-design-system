import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SiteHeader } from "./site-header";

describe("SiteHeader Component", () => {
  it("renders header banner with navigation links", () => {
    render(<SiteHeader brandName="UniERP Platform" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("UniERP Platform")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SiteHeader />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
