import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OpsShell, type OpsRailItem } from "./ops-shell";

const CSS = readFileSync(join(__dirname, "ops-shell.module.css"), "utf8");


const RAIL: OpsRailItem[] = [
  { id: "overview", icon: <svg aria-hidden="true" />, label: "Overview", href: "/overview" },
  { id: "tenants", icon: <svg aria-hidden="true" />, label: "Tenants", href: "/tenants" },
];

const METRICS = [
  { label: "Tenants", value: "1,284" },
  { label: "Error rate", value: "0.02%" },
];

const DOMAINS = [
  { id: "billing", label: "Billing", href: "/billing" },
  { id: "ops", label: "Operations", href: "/ops" },
];

describe("OpsShell", () => {
  it("gives every icon-rail item an accessible name", () => {
    // An icon rail with no names is a row of mystery meat — design law 1.
    render(<OpsShell rail={RAIL} activeRailId="tenants">body</OpsShell>);
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tenants" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps the rail at a fixed icon width — never expanded, never zero", () => {
    const rail = /\.root\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    expect(rail).toMatch(/grid-template-columns:\s*var\(--sidebar-collapsed-width\)/);
    // The shape the provider console shipped with was `width: open ? 264 : 0`,
    // which takes the domain switcher off screen entirely.
    expect(CSS).not.toMatch(/\.rail\s*\{[^}]*width:\s*0/);
  });

  it("renders the status strip as a live region, not just colour", () => {
    // §3.5: colour is never the sole carrier of meaning. A degraded platform
    // has to be announced too.
    const { container } = render(
      <OpsShell metrics={METRICS} health="degraded">body</OpsShell>,
    );
    const strip = container.querySelector("[data-health]");
    expect(strip).toHaveAttribute("data-health", "degraded");
    expect(strip).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("1,284")).toBeInTheDocument();
  });

  it("recolours the WHOLE strip on degradation, not one chip inside it", () => {
    // An operator scanning a wall of numbers should not have to find the red one.
    expect(/\.strip_degraded\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(
      /background:\s*var\(--color-warning-light\)/,
    );
    expect(/\.strip_down\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(
      /background:\s*var\(--color-danger-light\)/,
    );
  });

  it("uses tabular figures for metric values", () => {
    // §4.1 — a metric that jitters as its digits change is one nobody trusts.
    expect(/\.metric_value\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(
      /font-variant-numeric:\s*tabular-nums/,
    );
  });

  it("KEEPS THE CONSOLE COUNTS ON THE COLLAPSED BAR", async () => {
    // §12.4's rule, applied to the operational console: collapsing must never
    // be able to hide a failure.
    render(
      <OpsShell console={<p>details</p>} consoleErrors={3} consoleWarnings={2}>
        body
      </OpsShell>,
    );

    const toggle = screen.getByRole("button", { name: /Console/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    // Counts visible while shut.
    expect(screen.getByText("3 errors")).toBeInTheDocument();
    expect(screen.getByText("2 warnings")).toBeInTheDocument();
    expect(screen.queryByText("details")).toBeNull();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("details")).toBeInTheDocument();
    // …and still visible while open.
    expect(screen.getByText("3 errors")).toBeInTheDocument();
  });

  it("singularises the counts", () => {
    render(<OpsShell console={<p>d</p>} consoleErrors={1} consoleWarnings={1}>body</OpsShell>);
    expect(screen.getByText("1 error")).toBeInTheDocument();
    expect(screen.getByText("1 warning")).toBeInTheDocument();
  });

  it("omits count chips entirely at zero", () => {
    render(<OpsShell console={<p>d</p>}>body</OpsShell>);
    expect(screen.queryByText(/0 errors/)).toBeNull();
    // Design law 4: a console with nothing wrong is quiet.
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <OpsShell
        rail={RAIL}
        activeRailId="overview"
        metrics={METRICS}
        health="degraded"
        domains={DOMAINS}
        activeDomainId="ops"
        console={<p>details</p>}
        consoleErrors={2}
      >
        <table>
          <caption>Tenants</caption>
          <tbody>
            <tr>
              <td>acme</td>
            </tr>
          </tbody>
        </table>
      </OpsShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
