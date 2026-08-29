import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageHeader } from "../page-header";

/**
 * The breadcrumb assertions here exist because `PageHeader` declared a
 * `breadcrumbs` prop and never rendered it. Callers passed it, it typechecked,
 * and it was silently discarded — so the provider control plane shipped with no
 * breadcrumbs at all while APP_FLOW §3 called them mandatory on every page.
 *
 * A prop that is accepted and ignored is worse than one that does not exist:
 * the missing prop is a compile error, the ignored one is a wrong screen nobody
 * is told about. These tests are the mechanism that can fail.
 */
describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Invoices" />);
    expect(screen.getByRole("heading", { name: "Invoices" })).toBeInTheDocument();
  });

  it("renders the description when given", () => {
    render(<PageHeader title="Invoices" description="Everything owed to you" />);
    expect(screen.getByText("Everything owed to you")).toBeInTheDocument();
  });

  it("renders actions when given", () => {
    render(<PageHeader title="Invoices" actions={<button>New invoice</button>} />);
    expect(screen.getByRole("button", { name: "New invoice" })).toBeInTheDocument();
  });

  it("RENDERS BREADCRUMBS — the regression this component shipped with", () => {
    render(
      <PageHeader
        title="INV-2043"
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "Invoices", href: "/finance/invoices" },
          { label: "INV-2043" },
        ]}
      />,
    );

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    expect(within(nav).getByText("Finance")).toBeInTheDocument();
    expect(within(nav).getByText("Invoices")).toBeInTheDocument();
    expect(within(nav).getByText("INV-2043")).toBeInTheDocument();
  });

  it("links every breadcrumb segment that carries an href", () => {
    // APP_FLOW §3: "Breadcrumb: mandatory on every page… Every segment is a
    // link." The trailing segment is the current page and correctly is not.
    render(
      <PageHeader
        title="INV-2043"
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "Invoices", href: "/finance/invoices" },
          { label: "INV-2043" },
        ]}
      />,
    );

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(within(nav).getByRole("link", { name: "Finance" })).toHaveAttribute(
      "href",
      "/finance",
    );
    expect(within(nav).getByRole("link", { name: "Invoices" })).toHaveAttribute(
      "href",
      "/finance/invoices",
    );
    expect(within(nav).queryByRole("link", { name: "INV-2043" })).toBeNull();
  });

  it("renders no breadcrumb nav when the list is absent or empty", () => {
    const { rerender } = render(<PageHeader title="Invoices" />);
    expect(screen.queryByRole("navigation", { name: /breadcrumb/i })).toBeNull();

    // An empty array must not render an empty <nav> — a landmark with nothing
    // in it is noise for a screen-reader user cycling landmarks.
    rerender(<PageHeader title="Invoices" breadcrumbs={[]} />);
    expect(screen.queryByRole("navigation", { name: /breadcrumb/i })).toBeNull();
  });
});
