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
} from "../catalog-shell";

const TILES: CatalogTile[] = [
  { id: "stripe", name: "Stripe", publisher: "Stripe, Inc.", description: "Payments", href: "/a/stripe" },
  { id: "slack", name: "Slack", publisher: "Salesforce", description: "Notifications", href: "/a/slack" },
];

describe("CatalogShell", () => {
  it("groups facet checkboxes in a real fieldset with a legend", () => {
    // A pile of checkboxes with no group is a pile of unrelated controls to a
    // screen reader — there is no way to tell which filter they belong to.
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

  it("renders each gallery tile as one link with a usable name", () => {
    render(<CatalogGallery tiles={TILES} />);
    const link = screen.getByRole("link", { name: /Stripe/ });
    expect(link).toHaveAttribute("href", "/a/stripe");
    // The decorative icon must not pollute the accessible name.
    expect(link).toHaveAccessibleName(expect.stringContaining("Stripe"));
  });
});

describe("CatalogListing", () => {
  const PERMISSIONS = [
    { scope: "connectors.write", description: "Create and update connector credentials" },
    { scope: "invoices.read", description: "Read your invoices and their line items" },
  ];

  it("LEADS WITH WHAT A PERMISSION DOES, not its scope string", () => {
    // `connectors.write` tells an admin nothing about what will happen to their
    // data. An install prompt showing only scopes asks for consent without
    // giving information.
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
      <CatalogShell facets={facets} resultSummary="2 apps">
        <CatalogGallery tiles={TILES} />
        <CatalogListing permissions={PERMISSIONS} aside={<button>Install</button>}>
          <h1>Stripe</h1>
        </CatalogListing>
      </CatalogShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
