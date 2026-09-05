import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Logo } from "./logo";

describe("Logo Brand Component", () => {
  it("renders default horizontal lockup with wordmark and tagline", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: /UniERP/i })).toBeInTheDocument();
    expect(screen.getByText("UniERP")).toBeInTheDocument();
    expect(screen.getByText("ENTERPRISE SAAS BUSINESS PLATFORM")).toBeInTheDocument();
  });

  it("renders glyph-only variant without text", () => {
    render(<Logo variant="glyph" />);
    expect(screen.getByRole("img", { name: /UniERP/i })).toBeInTheDocument();
    expect(screen.queryByText("UniERP")).not.toBeInTheDocument();
  });

  it("renders stacked variant with accessible role", () => {
    render(<Logo variant="stacked" theme="dark" size="lg" />);
    expect(screen.getByRole("img", { name: /UniERP/i })).toBeInTheDocument();
    expect(screen.getByText("UniERP")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <div>
        <Logo variant="horizontal" theme="light" />
        <Logo variant="stacked" theme="dark" />
        <Logo variant="glyph" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
