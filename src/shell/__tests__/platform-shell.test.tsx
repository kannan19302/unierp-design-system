import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PlatformShell } from "../platform-shell";

const baseUser = { name: "Ada Lovelace", email: "ada@acme.test" };
const baseTenant = { id: "t1", name: "Acme Corp" };

describe("PlatformShell", () => {
  it("renders the platform name and children", () => {
    render(
      <PlatformShell platformName="Tenant Applications" user={baseUser}>
        <div>page content</div>
      </PlatformShell>,
    );
    expect(screen.getByText("Tenant Applications")).toBeInTheDocument();
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("shows the switch-platform control only when a wizard URL is supplied", () => {
    const { rerender } = render(
      <PlatformShell platformName="X" user={baseUser}>
        <div />
      </PlatformShell>,
    );
    expect(screen.queryByLabelText("Switch platform")).not.toBeInTheDocument();

    rerender(
      <PlatformShell
        platformName="X"
        user={baseUser}
        platformWizardUrl="http://localhost:4000/"
      >
        <div />
      </PlatformShell>,
    );
    const link = screen.getByLabelText("Switch platform");
    expect(link).toHaveAttribute("href", "http://localhost:4000/");
  });

  it("the switch-platform control always points at the wizard, never a second in-app picker", () => {
    // The plan is explicit that the global wizard and the per-platform
    // switcher must stay separate — this is the one link out of a platform,
    // and it must not become configurable to point anywhere else by accident.
    render(
      <PlatformShell
        platformName="X"
        user={baseUser}
        platformWizardUrl="http://localhost:4000/?next=P7"
      >
        <div />
      </PlatformShell>,
    );
    expect(screen.getByLabelText("Switch platform")).toHaveAttribute(
      "href",
      "http://localhost:4000/?next=P7",
    );
  });

  it("opens the tenant switcher and calls onTenantChange with the selected tenant", async () => {
    const onTenantChange = vi.fn();
    render(
      <PlatformShell
        platformName="X"
        user={baseUser}
        tenant={baseTenant}
        availableTenants={[baseTenant, { id: "t2", name: "Globex" }]}
        onTenantChange={onTenantChange}
      >
        <div />
      </PlatformShell>,
    );

    await userEvent.click(screen.getByText("Acme Corp"));
    await userEvent.click(screen.getByRole("menuitem", { name: "Globex" }));

    expect(onTenantChange).toHaveBeenCalledWith("t2");
  });

  it("does not offer a tenant switcher when there is only one tenant to switch to", () => {
    render(
      <PlatformShell
        platformName="X"
        user={baseUser}
        tenant={baseTenant}
        availableTenants={[baseTenant]}
      >
        <div />
      </PlatformShell>,
    );
    // The pill still shows the current tenant name, but has no dropdown affordance.
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("renders sign out in the user menu and calls onSignOut", async () => {
    const onSignOut = vi.fn();
    render(
      <PlatformShell platformName="X" user={baseUser} onSignOut={onSignOut}>
        <div />
      </PlatformShell>,
    );

    await userEvent.click(screen.getByLabelText("Account menu"));
    await userEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it("shows the user's name and email in the account menu", async () => {
    render(
      <PlatformShell platformName="X" user={baseUser}>
        <div />
      </PlatformShell>,
    );
    await userEvent.click(screen.getByLabelText("Account menu"));
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@acme.test")).toBeInTheDocument();
  });

  it("renders no account affordance when there is no signed-in user", () => {
    render(
      <PlatformShell platformName="X" user={null}>
        <div />
      </PlatformShell>,
    );
    expect(screen.queryByLabelText("Account menu")).not.toBeInTheDocument();
  });

  it("renders breadcrumbs when provided", () => {
    render(
      <PlatformShell
        platformName="X"
        user={baseUser}
        breadcrumbs={[
          { key: "home", label: "Home", href: "/" },
          { key: "invoices", label: "Invoices" },
        ]}
      >
        <div />
      </PlatformShell>,
    );
    expect(screen.getByText("Invoices")).toBeInTheDocument();
  });

  it("renders the sidebar slot and its toggle only when a sidebar is supplied", () => {
    const { rerender } = render(
      <PlatformShell platformName="X" user={baseUser}>
        <div />
      </PlatformShell>,
    );
    expect(screen.queryByLabelText("Toggle navigation")).not.toBeInTheDocument();

    rerender(
      <PlatformShell platformName="X" user={baseUser} sidebar={<nav>module nav</nav>}>
        <div />
      </PlatformShell>,
    );
    expect(screen.getByText("module nav")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle navigation")).toBeInTheDocument();
  });

  it("has no axe violations in its default configuration", async () => {
    const { container } = render(
      <PlatformShell
        platformName="Tenant Applications"
        user={baseUser}
        tenant={baseTenant}
        breadcrumbs={[{ key: "home", label: "Home" }]}
        onSignOut={vi.fn()}
      >
        <div>content</div>
      </PlatformShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
