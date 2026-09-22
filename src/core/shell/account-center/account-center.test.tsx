import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { AccountCenterShell, type AccountSection } from "./account-center";

const sections: AccountSection[] = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security", badge: "2FA" },
  { id: "sessions", label: "Sessions", badge: 2 },
];

describe("AccountCenterShell", () => {
  it("renders user information and navigation items", () => {
    const onNavigate = vi.fn();
    render(
      <AccountCenterShell
        user={{
          name: "Marcus Vance",
          email: "marcus@unierp.io",
          role: "System Admin",
          tenantName: "Acme Corp",
        }}
        sections={sections}
        activeSection="profile"
        onNavigate={onNavigate}
      >
        <div>Account Content Pane</div>
      </AccountCenterShell>
    );

    expect(screen.getByText("Marcus Vance")).toBeInTheDocument();
    expect(screen.getByText("marcus@unierp.io")).toBeInTheDocument();
    expect(screen.getByText("System Admin")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Account Content Pane")).toBeInTheDocument();
  });

  it("triggers onNavigate when a section button is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <AccountCenterShell
        user={{ name: "Marcus Vance", email: "marcus@unierp.io" }}
        sections={sections}
        activeSection="profile"
        onNavigate={onNavigate}
      >
        <div>Content</div>
      </AccountCenterShell>
    );

    fireEvent.click(screen.getByRole("button", { name: /Security/i }));
    expect(onNavigate).toHaveBeenCalledWith("security");
  });

  it("has zero accessibility violations", async () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <AccountCenterShell
        user={{ name: "Marcus Vance", email: "marcus@unierp.io" }}
        sections={sections}
        activeSection="profile"
        onNavigate={onNavigate}
      >
        <div>Accessible Content</div>
      </AccountCenterShell>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
