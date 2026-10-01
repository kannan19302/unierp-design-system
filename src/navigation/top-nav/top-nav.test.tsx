import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TopNav, type TopNavProps } from "./top-nav";

const baseUser = { name: "Alex Chen", email: "alex@acme.example" };
const baseTenant = { id: "acme", name: "Acme Inc" };
const availableTenants = [
  { id: "acme", name: "Acme Inc" },
  { id: "stark", name: "Stark Industries" },
];

const baseProps: TopNavProps = {
  platformName: "Business Suite",
  user: baseUser,
  tenant: baseTenant,
  availableTenants,
  environmentLabel: "Demo",
  breadcrumbs: [
    { key: "home", label: "Home", href: "#home" },
    { key: "workspace", label: "Workspace" },
  ],
};

describe("TopNav", () => {
  it("renders platform identity, breadcrumbs, and scope", () => {
    render(<TopNav {...baseProps} />);
    expect(screen.getByText("Business Suite")).toBeInTheDocument();
    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Acme Inc")).toBeInTheDocument();
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("handles sidebar toggle interactions", async () => {
    const user = userEvent.setup();
    const onToggleSidebar = vi.fn();
    render(<TopNav {...baseProps} onToggleSidebar={onToggleSidebar} sidebarControlsId="main-sidebar" />);

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("aria-controls", "main-sidebar");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("opens tenant menu and selects an alternate tenant", async () => {
    const user = userEvent.setup();
    const onTenantChange = vi.fn();
    render(<TopNav {...baseProps} onTenantChange={onTenantChange} />);

    const scopeButton = screen.getByRole("button", { name: "Current operating scope" });
    expect(scopeButton).toHaveAttribute("aria-expanded", "false");

    await user.click(scopeButton);
    expect(scopeButton).toHaveAttribute("aria-expanded", "true");

    const starkOption = screen.getByRole("menuitem", { name: "Stark Industries" });
    await user.click(starkOption);

    expect(onTenantChange).toHaveBeenCalledWith("stark");
    expect(screen.queryByRole("menu", { name: /tenant/i })).not.toBeInTheDocument();
  });

  it("opens user menu and triggers sign out", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<TopNav {...baseProps} onSignOut={onSignOut} accountCenterUrl="/account" />);

    const userButton = screen.getByRole("button", { name: "Account menu" });
    await user.click(userButton);

    expect(screen.getByText("Alex Chen")).toBeInTheDocument();
    expect(screen.getByText("alex@acme.example")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Account Center/i })).toBeInTheDocument();

    const signOut = screen.getByRole("menuitem", { name: /Sign out/i });
    await user.click(signOut);

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("renders horizontal navigation items and selects them", async () => {
    const user = userEvent.setup();
    const onItemSelect = vi.fn();
    const items = [
      { id: "overview", label: "Overview", active: true },
      { id: "orders", label: "Work orders" },
      { id: "inventory", label: "Inventory" },
    ];

    render(<TopNav {...baseProps} items={items} onItemSelect={onItemSelect} />);

    const overview = screen.getByRole("button", { name: "Overview" });
    expect(overview).toHaveAttribute("aria-current", "page");

    const orders = screen.getByRole("button", { name: "Work orders" });
    expect(orders).not.toHaveAttribute("aria-current");

    await user.click(orders);
    expect(onItemSelect).toHaveBeenCalledWith(items[1]);
  });

  it("closes open menus when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<TopNav {...baseProps} />);

    const scopeButton = screen.getByRole("button", { name: "Current operating scope" });
    await user.click(scopeButton);
    expect(scopeButton).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(scopeButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(<TopNav {...baseProps} density={density} />);
      const root = container.querySelector('[data-slot="top-nav"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero axe accessibility violations", async () => {
    const { container } = render(
      <TopNav
        {...baseProps}
        onToggleSidebar={vi.fn()}
        onSignOut={vi.fn()}
        items={[
          { id: "overview", label: "Overview", active: true },
          { id: "reports", label: "Reports" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
