import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { WorkspaceShell, type WorkspaceNavItem } from "./workspace-shell";

const MOCK_NAV: WorkspaceNavItem[] = [
  { key: "canvas", label: "Page Canvas", href: "/canvas", active: true },
  { key: "theme", label: "Theme Variables", href: "/theme" },
];

describe("WorkspaceShell Primitive", () => {
  it("renders back link, workspace identity, and nav items", () => {
    render(
      <WorkspaceShell
        backHref="/apps"
        backLabel="Back to Applications"
        identity={{ name: "Portal Designer", kindLabel: "App Workspace" }}
        nav={MOCK_NAV}
      >
        <div>Canvas Workspace Area</div>
      </WorkspaceShell>
    );

    expect(screen.getByText("Back to Applications")).toBeInTheDocument();
    expect(screen.getByText("Portal Designer")).toBeInTheDocument();
    expect(screen.getByText("Page Canvas")).toBeInTheDocument();
    expect(screen.getByText("Canvas Workspace Area")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WorkspaceShell
        backHref="/apps"
        backLabel="Back to Applications"
        identity={{ name: "Portal Designer", kindLabel: "App Workspace" }}
        nav={MOCK_NAV}
      >
        <div>Content</div>
      </WorkspaceShell>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
