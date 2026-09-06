import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FactBoxNavDrawer } from "./fact-box-nav-drawer";

const sampleCards = [
  {
    id: "cust-stats",
    title: "Customer Statistics",
    badge: "Tier 1",
    metrics: [{ label: "Credit Limit", value: "$250,000" }],
    drilldownLabel: "View Ledger",
    onDrilldown: vi.fn(),
  },
];

describe("FactBoxNavDrawer", () => {
  it("renders cards and handles drilldown", () => {
    render(<FactBoxNavDrawer cards={sampleCards} />);

    expect(screen.getByText("Customer Statistics")).toBeInTheDocument();
    expect(screen.getByText("Credit Limit")).toBeInTheDocument();
    expect(screen.getByText("$250,000")).toBeInTheDocument();

    const drilldownBtn = screen.getByRole("button", { name: /Drilldown to Customer Statistics/i });
    fireEvent.click(drilldownBtn);
    expect(sampleCards[0].onDrilldown).toHaveBeenCalled();
  });

  it("handles collapse toggle", () => {
    const handleToggle = vi.fn();
    render(
      <FactBoxNavDrawer
        cards={sampleCards}
        onToggleCollapse={handleToggle}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /Collapse FactBox drawer/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalled();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <FactBoxNavDrawer cards={sampleCards} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
