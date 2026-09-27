import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import {
  CatalogShell,
  CatalogGallery,
  CatalogListing,
  type CatalogFacet,
  type CatalogTile,
} from "./catalog-shell";

const TILES: CatalogTile[] = [
  {
    id: "stripe",
    name: "Stripe",
    publisher: "Stripe, Inc.",
    publisherVerified: true,
    description: "Payments integration",
    href: "/a/stripe",
    rating: { score: 4.9, reviewsCount: 320 },
    pricing: "Free",
    tags: ["Finance", "Payments"],
    badge: "Featured",
    actionSlot: <button type="button">Install</button>,
  },
  {
    id: "slack",
    name: "Slack",
    publisher: "Salesforce",
    description: "Notifications",
    href: "/a/slack",
  },
];

describe("CatalogShell", () => {
  it("groups facet checkboxes in a real fieldset with a legend", () => {
    const facets: CatalogFacet[] = [
      { id: "cat", legend: "Category", options: [{ id: "pay", label: "Payments", count: 12 }] },
    ];
    render(<CatalogShell facets={facets}>results</CatalogShell>);

    const group = screen.getByRole("group", { name: "Category" });
    expect(within(group).getByRole("checkbox", { name: /Payments/ })).toBeInTheDocument();
  });

  it("reports the facet counts", () => {
    const facets: CatalogFacet[] = [
      { id: "cat", legend: "Category", options: [{ id: "pay", label: "Payments", count: 12 }] },
    ];
    render(<CatalogShell facets={facets}>results</CatalogShell>);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("fires onChange when a facet is toggled", async () => {
    const onChange = vi.fn();
    const facets: CatalogFacet[] = [
      { id: "cat", legend: "Category", options: [{ id: "pay", label: "Payments", onChange }] },
    ];
    render(<CatalogShell facets={facets}>results</CatalogShell>);
    await userEvent.click(screen.getByRole("checkbox", { name: "Payments" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("announces the result count so filtering is perceivable without sight", () => {
    const { container } = render(
      <CatalogShell resultSummary="128 apps">results</CatalogShell>,
    );
    expect(container.querySelector("[aria-live]")).toHaveTextContent("128 apps");
  });

  it("renders storefront hero header and search slot when provided", () => {
    render(
      <CatalogShell
        hero={{
          title: "App & Integration Directory",
          subtitle: "Discover enterprise modules and connectors",
          badge: "New Release",
        }}
        searchSlot={<input placeholder="Search apps..." aria-label="Search apps" />}
      >
        <div>Content</div>
      </CatalogShell>
    );

    expect(screen.getByText("App & Integration Directory")).toBeInTheDocument();
    expect(screen.getByText("Discover enterprise modules and connectors")).toBeInTheDocument();
    expect(screen.getByText("New Release")).toBeInTheDocument();
    expect(screen.getByLabelText("Search apps")).toBeInTheDocument();
  });

  it("toggles view mode between grid and list", async () => {
    const onViewModeChange = vi.fn();
    render(
      <CatalogShell
        resultSummary="2 apps"
        onViewModeChange={onViewModeChange}
      >
        <div>Content</div>
      </CatalogShell>
    );

    const listButton = screen.getByLabelText("List view");
    await userEvent.click(listButton);
    expect(onViewModeChange).toHaveBeenCalledWith("list");
  });

  it("offers the facet panel through an accessible narrow-screen toggle", async () => {
    const facets: CatalogFacet[] = [
      { id: "category", legend: "Category", options: [{ id: "finance", label: "Finance" }] },
    ];
    render(<CatalogShell facets={facets}>results</CatalogShell>);
    // The control is CSS-hidden at jsdom's desktop width; the narrow-browser pass checks visibility.
    const toggle = screen.getByRole("button", { hidden: true });
    expect(toggle).toHaveTextContent("Show filters");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", screen.getByRole("complementary", { name: "Catalog filters" }).id);
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("does not show an inert view switch when no change handler exists", () => {
    render(<CatalogShell resultSummary="2 apps">results</CatalogShell>);
    expect(screen.queryByRole("button", { name: "Grid view" })).not.toBeInTheDocument();
  });

  it("renders active filter chips and handles individual dismiss and clear all", async () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();

    render(
      <CatalogShell
        resultSummary="10 apps"
        activeFilters={[
          { id: "cat-fin", label: "Finance & Accounting", onRemove },
        ]}
        onClearAllFilters={onClearAll}
      >
        <div>Content</div>
      </CatalogShell>
    );

    expect(screen.getByText("Finance & Accounting")).toBeInTheDocument();

    const removeBtn = screen.getByLabelText("Remove filter Finance & Accounting");
    await userEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledOnce();

    const clearAllBtn = screen.getByRole("button", { name: "Clear all" });
    await userEvent.click(clearAllBtn);
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it("renders empty state slot when provided", () => {
    render(
      <CatalogShell
        emptySlot={<div>No applications found matching your criteria.</div>}
      >
        <div>Should be overridden by emptySlot</div>
      </CatalogShell>
    );

    expect(screen.getByText("No applications found matching your criteria.")).toBeInTheDocument();
    expect(screen.queryByText("Should be overridden by emptySlot")).not.toBeInTheDocument();
  });

  it("renders loading skeleton state when loading is true", () => {
    const { container } = render(
      <CatalogShell loading resultSummary="Loading apps...">
        <div>Content</div>
      </CatalogShell>
    );

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading catalog items" })).toBeInTheDocument();
  });

  it("renders each gallery tile as one link with a usable name and metadata", () => {
    render(<CatalogGallery tiles={TILES} />);
    const link = screen.getByRole("link", { name: /Stripe/ });
    expect(link).toHaveAttribute("href", "/a/stripe");
    expect(link).toHaveAccessibleName(expect.stringContaining("Stripe"));
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("(320)")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
  });

  it("keeps gallery actions outside the destination link", async () => {
    const onClick = vi.fn();
    const onInstall = vi.fn();
    render(<CatalogGallery tiles={[{ id: "one", name: "One", href: "/one", onClick, actionSlot: <button type="button" onClick={onInstall}>Install one</button> }]} />);
    const link = screen.getByRole("link", { name: "One" });
    const install = screen.getByRole("button", { name: "Install one" });
    expect(link).not.toContainElement(install);
    await userEvent.click(install);
    expect(onInstall).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("CatalogListing", () => {
  const PERMISSIONS = [
    { scope: "connectors.write", description: "Create and update connector credentials" },
    { scope: "invoices.read", description: "Read your invoices and their line items" },
  ];

  it("LEADS WITH WHAT A PERMISSION DOES, not its scope string", () => {
    render(<CatalogListing permissions={PERMISSIONS} />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]!.textContent!.indexOf("Create and update connector credentials")).toBeLessThan(
      items[0]!.textContent!.indexOf("connectors.write"),
    );
  });

  it("still shows the scope, for the admin who wants the exact grant", () => {
    render(<CatalogListing permissions={PERMISSIONS} />);
    expect(screen.getByText("connectors.write")).toBeInTheDocument();
    expect(screen.getByText("invoices.read")).toBeInTheDocument();
  });

  it("omits the permissions section entirely when there are none", () => {
    render(<CatalogListing />);
    expect(screen.queryByRole("heading", { name: /What this app can access/ })).toBeNull();
  });

  it("puts the install CTA in a complementary landmark", () => {
    render(<CatalogListing aside={<button>Install</button>}>body</CatalogListing>);
    const aside = screen.getByRole("complementary");
    expect(within(aside).getByRole("button", { name: "Install" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const facets: CatalogFacet[] = [
      { id: "cat", legend: "Category", options: [{ id: "pay", label: "Payments", count: 12 }] },
    ];
    const { container } = render(
      <CatalogShell
        hero={{ title: "Enterprise App Store", subtitle: "Browse extensions" }}
        facets={facets}
        resultSummary="2 apps"
        activeFilters={[{ id: "f1", label: "Active Filter", onRemove: vi.fn() }]}
      >
        <CatalogGallery tiles={TILES} />
        <CatalogListing permissions={PERMISSIONS} aside={<button>Install</button>}>
          <h2>Stripe Payments</h2>
        </CatalogListing>
      </CatalogShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
