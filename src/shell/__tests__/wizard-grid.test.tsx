import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PlatformWizardGrid, AppWizardGrid, type WizardTile } from "../wizard-grid";

const tiles: WizardTile[] = [
  { key: "p3", name: "Tenant Applications", href: "http://localhost:4003/" },
  { key: "p7", name: "Marketplace", href: "http://localhost:4007/" },
];

describe("PlatformWizardGrid and AppWizardGrid", () => {
  it("render a tile per entry, linking to its href", () => {
    render(<PlatformWizardGrid tiles={tiles} />);
    const link = screen.getByRole("link", { name: /Tenant Applications/ });
    expect(link).toHaveAttribute("href", "http://localhost:4003/");
    expect(screen.getByRole("link", { name: /Marketplace/ })).toBeInTheDocument();
  });

  it("shows a loading state and no tiles while loading", () => {
    render(<PlatformWizardGrid tiles={tiles} loading />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows an error state with retry, and does not render tiles underneath", () => {
    const onRetry = vi.fn();
    render(<PlatformWizardGrid tiles={tiles} error="Could not load platforms" onRetry={onRetry} />);
    expect(screen.getByText("Could not load platforms")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows a distinct forbidden state rather than a plain empty state when the caller holds nothing", () => {
    render(<PlatformWizardGrid tiles={[]} forbidden />);
    expect(screen.getByText(/restricted/i)).toBeInTheDocument();
  });

  it("shows a platform-specific empty message by default", () => {
    render(<PlatformWizardGrid tiles={[]} />);
    expect(screen.getByText(/No platforms available/i)).toBeInTheDocument();
  });

  it("shows an app-specific empty message by default — distinct wording from the platform wizard", () => {
    render(<AppWizardGrid tiles={[]} />);
    expect(screen.getByText(/No applications installed/i)).toBeInTheDocument();
  });

  it("allows a caller to override the empty-state copy", () => {
    render(
      <AppWizardGrid
        tiles={[]}
        emptyTitle="Nothing installed for this tenant"
        emptyDescription="Ask an admin to install a module."
      />,
    );
    expect(screen.getByText("Nothing installed for this tenant")).toBeInTheDocument();
  });

  it("renders a disabled, non-navigable tile for an entitled-but-locked entry", () => {
    render(
      <PlatformWizardGrid
        tiles={[
          {
            key: "p5",
            name: "Web Studio",
            href: "http://localhost:4005/",
            disabled: true,
            badge: <span>Upgrade required</span>,
          },
        ]}
      />,
    );
    expect(screen.queryByRole("link", { name: /Web Studio/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Web Studio (not available)")).toBeInTheDocument();
    expect(screen.getByText("Upgrade required")).toBeInTheDocument();
  });

  it("has no axe violations with a populated grid", async () => {
    const { container } = render(<PlatformWizardGrid tiles={tiles} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the empty state", async () => {
    const { container } = render(<AppWizardGrid tiles={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
