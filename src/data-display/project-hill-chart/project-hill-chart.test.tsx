import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { ProjectHillChart, HillChartScope } from "./project-hill-chart";

const mockScopes: HillChartScope[] = [
  {
    id: "scope-1",
    name: "Keycloak Migration",
    position: 25,
    assignee: "Alex",
  },
  {
    id: "scope-2",
    name: "Stripe Billing",
    position: 80,
    assignee: "Elena",
  },
];

describe("ProjectHillChart", () => {
  it("renders scopes on the hill chart", () => {
    render(<ProjectHillChart scopes={mockScopes} />);
    expect(screen.getByText("Project Certainty Hill Chart")).toBeInTheDocument();
    // Scope name is rendered in SVG and in detail pane
    expect(screen.getAllByText("Keycloak Migration").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stripe Billing").length).toBeGreaterThan(0);
  });

  it("triggers scope selection callback when marker clicked", () => {
    const onSelect = vi.fn();
    render(<ProjectHillChart scopes={mockScopes} onScopeSelect={onSelect} />);

    const stripeMarker = screen.getByRole("button", {
      name: /Stripe Billing: 80% complete/i,
    });
    fireEvent.click(stripeMarker);
    expect(onSelect).toHaveBeenCalledWith("scope-2");
  });

  it("handles keyboard navigation on markers", () => {
    const onMove = vi.fn();
    render(<ProjectHillChart scopes={mockScopes} onScopeMove={onMove} />);

    const marker = screen.getByRole("button", {
      name: /Keycloak Migration: 25% complete/i,
    });
    fireEvent.keyDown(marker, { key: "ArrowRight" });
    expect(onMove).toHaveBeenCalledWith("scope-1", 30);

    fireEvent.keyDown(marker, { key: "ArrowLeft" });
    expect(onMove).toHaveBeenCalledWith("scope-1", 20);
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(<ProjectHillChart scopes={mockScopes} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
