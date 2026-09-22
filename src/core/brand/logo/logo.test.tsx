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
    expect(screen.queryByText("ENTERPRISE SAAS BUSINESS PLATFORM")).not.toBeInTheDocument();
  });

  it("renders stacked variant with accessible role", () => {
    render(<Logo variant="stacked" theme="dark" size="lg" />);
    expect(screen.getByRole("img", { name: /UniERP/i })).toBeInTheDocument();
    expect(screen.getByText("UniERP")).toBeInTheDocument();
  });

  it("renders favicon variant without text", () => {
    render(<Logo variant="favicon" />);
    expect(screen.getByRole("img", { name: /UniERP/i })).toBeInTheDocument();
    expect(screen.queryByText("UniERP")).not.toBeInTheDocument();
  });

  it("renders wordmark variant without glyph icon", () => {
    const { container } = render(<Logo variant="wordmark" showTagline={false} />);
    expect(screen.getByText("UniERP")).toBeInTheDocument();
    expect(screen.queryByText("ENTERPRISE SAAS BUSINESS PLATFORM")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("supports suppressing the tagline badge", () => {
    render(<Logo showTagline={false} />);
    expect(screen.getByText("UniERP")).toBeInTheDocument();
    expect(screen.queryByText("ENTERPRISE SAAS BUSINESS PLATFORM")).not.toBeInTheDocument();
  });

  it("renders monochrome theme properly", () => {
    const { container } = render(<Logo theme="monochrome" />);
    expect(container.firstChild).toHaveClass(/theme-monochrome/);
  });

  it("renders responsive sizes correctly", () => {
    const { rerender, container } = render(<Logo size="sm" />);
    expect(container.firstChild).toHaveClass(/size-sm/);

    rerender(<Logo size="xl" />);
    expect(container.firstChild).toHaveClass(/size-xl/);
  });

  it("has zero accessibility violations across all lockups", async () => {
    const { container } = render(
      <div>
        <Logo variant="horizontal" theme="light" />
        <Logo variant="horizontal" theme="dark" />
        <Logo variant="stacked" theme="light" />
        <Logo variant="glyph" />
        <Logo variant="wordmark" />
        <Logo variant="favicon" />
        <Logo theme="monochrome" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
