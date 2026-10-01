import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DashboardShell, type DashboardShellProps } from "./dashboard-shell";

const base: DashboardShellProps = {
  platformName: "Business Suite",
  user: { name: "Sample User", email: "sample@example.test" },
  navigation: {
    navigationLabel: "Business navigation",
    header: "Example workspace",
    sections: [{ key: "pages", title: "Pages", items: [
      { key: "dashboard", label: "Dashboard", href: "#dashboard", active: true },
      { key: "orders", label: "Orders", href: "#orders" },
    ] }],
  },
  intro: <h1>Overview</h1>,
  metrics: <section aria-label="Summary metrics">Three metrics</section>,
  primary: <section aria-label="Product insights">Product insights</section>,
  secondary: <section aria-label="Sales metrics">Sales metrics</section>,
  records: <table><caption>Recent transactions</caption><tbody><tr><td>Sample order</td></tr></tbody></table>,
};

describe("DashboardShell", () => {
  it.each(["standard", "inset", "floating", "analytics", "operations"] as const)(
    "renders the %s variant with the existing SideNav and all supplied regions",
    (variant) => {
      const { container } = render(<DashboardShell {...base} variant={variant} />);
      const shell = container.querySelector('[data-slot="dashboard-shell"]');
      expect(shell).toHaveAttribute("data-variant", variant);
      expect(within(screen.getByTestId("side-nav")).getByRole("navigation", { name: "Business navigation" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: "Summary metrics" })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: "Product insights" })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: "Sales metrics" })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: "Recent transactions" })).toBeInTheDocument();
    },
  );

  it("lets users collapse and expand the real SideNav", async () => {
    const user = userEvent.setup();
    render(<DashboardShell {...base} />);
    const nav = screen.getByTestId("side-nav");
    await user.click(screen.getByRole("button", { name: /Collapse sidebar/ }));
    expect(nav).toHaveAttribute("data-collapsed", "true");
    await user.click(screen.getByRole("button", { name: /Expand sidebar/ }));
    expect(nav).toHaveAttribute("data-collapsed", "false");
  });

  it("preserves consumer controlled collapse and forwards the requested state", async () => {
    const onToggleCollapse = vi.fn();
    const user = userEvent.setup();
    render(<DashboardShell {...base} navigation={{ ...base.navigation, collapsed: true, onToggleCollapse }} />);
    await user.click(screen.getByRole("button", { name: /Expand sidebar/ }));
    expect(onToggleCollapse).toHaveBeenCalledWith(false);
    expect(screen.getByTestId("side-nav")).toHaveAttribute("data-collapsed", "true");
  });

  it("uses a consumer supplied sidebar in place of the navigation configuration", () => {
    const { container } = render(
      <DashboardShell {...base} headerPlacement="workspace" sidebar={<aside aria-label="Shared Strata sidebar">Shared navigation</aside>} />,
    );
    expect(screen.getByLabelText("Shared Strata sidebar")).toBeInTheDocument();
    expect(screen.queryByTestId("side-nav")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="app-shell"]')).toHaveAttribute("data-header-placement", "workspace");
  });

  it("has no automated accessibility violations in its composed baseline", async () => {
    const { container } = render(<DashboardShell {...base} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
