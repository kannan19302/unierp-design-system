import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LaunchShell, type LaunchPlate } from "./launch-shell";

const CSS = readFileSync(join(__dirname, "launch-shell.module.css"), "utf8");


const PLATES: LaunchPlate[] = [
  { key: "p1", name: "Marketing Site", href: "/p1", code: "P1" },
  { key: "p3", name: "Tenant Applications", href: "/p3", code: "P3", description: "The ERP" },
  { key: "p8", name: "Developer Platform", href: "/p8", code: "P8" },
  {
    key: "p2",
    name: "Provider Admin OS",
    href: "/p2",
    code: "P2",
    disabled: true,
    disabledReason: "Internal staff only.",
  },
];

describe("LaunchShell", () => {
  it("filters by name, code and description", async () => {
    render(<LaunchShell title="Choose a platform" plates={PLATES} />);
    const box = screen.getByRole("searchbox", { name: "Filter" });

    await userEvent.type(box, "P8");
    expect(screen.getByText("Developer Platform")).toBeInTheDocument();
    expect(screen.queryByText("Marketing Site")).toBeNull();

    await userEvent.clear(box);
    await userEvent.type(box, "the erp");
    expect(screen.getByText("Tenant Applications")).toBeInTheDocument();
  });

  it("says what matched nothing, never a bare 'no results'", async () => {
    render(<LaunchShell title="Choose a platform" plates={PLATES} />);
    await userEvent.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByRole("status")).toHaveTextContent(/Nothing matches/);
  });

  it("shows an unavailable platform with its reason instead of hiding it", () => {
    // A user cannot tell "not entitled" from "outage" if the tile just vanishes.
    render(<LaunchShell title="Choose a platform" plates={PLATES} />);
    expect(screen.getByText("Provider Admin OS")).toBeInTheDocument();
    expect(screen.getByText("Internal staff only.")).toBeInTheDocument();
    // …and it is not a link, so it cannot be opened.
    expect(screen.queryByRole("link", { name: /Provider Admin OS/ })).toBeNull();
  });

  it("THE TWO WIZARDS ARE VISUALLY DISTINCT — hero owns the viewport, shelf does not", () => {
    // The codebase forbids interchanging the Global Platform Wizard and the
    // in-tenant App Wizard. Scale is what makes that visible to a user; a rule
    // that lives only in a comment does not survive a redesign.
    const root = /\.root\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    const shelf = /\.root_shelf\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    expect(root).toMatch(/min-height:\s*100vh/);
    expect(shelf).toMatch(/min-height:\s*0/);

    // The hero title is a fluid clamp; the shelf title drops to the ordinary
    // page-title token the rest of the product uses.
    expect(/\.title\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(/clamp\(/);
    expect(/\.root_shelf \.title\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(
      /font-size:\s*var\(--text-xl\)/,
    );
  });

  it("exposes the variant so a consumer cannot silently render the wrong one", () => {
    const { container, rerender } = render(
      <LaunchShell title="Platforms" plates={PLATES} />,
    );
    expect(container.querySelector("[data-launch-variant]")).toHaveAttribute(
      "data-launch-variant",
      "hero",
    );
    rerender(<LaunchShell variant="shelf" title="Apps" plates={PLATES} />);
    expect(container.querySelector("[data-launch-variant]")).toHaveAttribute(
      "data-launch-variant",
      "shelf",
    );
  });

  it("defaults the filter on for hero and off for shelf", () => {
    const { rerender } = render(<LaunchShell title="Platforms" plates={PLATES} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    rerender(<LaunchShell variant="shelf" title="Apps" plates={PLATES} />);
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("carries the plate accent as an edge, never a filled tile", () => {
    // Ten filled tiles is the rainbow §13.1 exists to prevent.
    const plate = /\.plate\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    expect(plate).toMatch(/border-top:\s*var\(--scope-edge-width\)/);
    expect(plate).toMatch(/background:\s*var\(--color-bg-elevated\)/);
    expect(plate).not.toMatch(/background:\s*var\(--plate-accent/);
  });

  it("has no axe violations in either variant", async () => {
    const hero = render(<LaunchShell title="Choose a platform" plates={PLATES} />);
    expect(await axe(hero.container)).toHaveNoViolations();
    hero.unmount();

    const shelf = render(<LaunchShell variant="shelf" title="Your apps" plates={PLATES} />);
    expect(await axe(shelf.container)).toHaveNoViolations();
  });
});
