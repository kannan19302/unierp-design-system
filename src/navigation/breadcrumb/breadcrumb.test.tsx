import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb Primitive", () => {
  it("renders breadcrumb trail and marks current item", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Accounts", href: "/accounts" },
          { label: "1000 - Cash" },
        ]}
      />
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("1000 - Cash")).toHaveAttribute("aria-current", "page");
  });

  it("renders data-slot anatomy correctly", () => {
    render(
      <Breadcrumb
        density="compact"
        items={[
          { label: "Home", href: "/" },
          { label: "Ledger" },
        ]}
      />
    );
    const nav = document.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("data-density", "compact");
    expect(document.querySelector('[data-slot="breadcrumb-list"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="breadcrumb-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="breadcrumb-link"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="breadcrumb-page"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="breadcrumb-separator"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Ledger" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("activates a callback ancestor with keyboard and keeps an unlinked current page static", async () => {
    const open = vi.fn();
    render(<Breadcrumb items={[{ label: "Finance", onClick: open }, { label: "Ledger" }]} />);
    const ancestor = screen.getByRole("button", { name: "Finance" });
    ancestor.focus();
    await userEvent.keyboard("{Enter}");
    expect(open).toHaveBeenCalledOnce();
    expect(screen.queryByRole("link", { name: "Ledger" })).not.toBeInTheDocument();
    expect(screen.getByText("Ledger")).toHaveAttribute("aria-current", "page");
  });

  it("preserves existing terminal links for compatibility", () => {
    render(<Breadcrumb items={[{ label: "Finance", href: "/finance" }, { label: "Ledger", href: "/ledger" }]} />);
    expect(screen.getByRole("link", { name: "Ledger" })).toHaveAttribute("aria-current", "page");
  });

  it("accepts a contextual landmark name when several trails share a page", () => {
    render(<Breadcrumb aria-label="Shipment breadcrumb" items={[{ label: "Shipments" }]} />);
    expect(screen.getByRole("navigation", { name: "Shipment breadcrumb" })).toBeInTheDocument();
  });
});
