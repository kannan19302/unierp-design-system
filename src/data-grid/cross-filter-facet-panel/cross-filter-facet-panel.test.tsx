import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CrossFilterFacetPanel } from "./cross-filter-facet-panel";

const TEST_CATEGORIES = [
  {
    id: "region",
    name: "Region",
    options: [
      { id: "reg-na", label: "North America", count: 1200 },
      { id: "reg-eu", label: "Europe", count: 800 },
      { id: "reg-ap", label: "Asia Pacific", count: 500 },
      { id: "reg-sa", label: "South America", count: 200 },
      { id: "reg-me", label: "Middle East", count: 150 },
    ],
  },
  {
    id: "status",
    name: "Status",
    options: [
      { id: "stat-act", label: "Active", count: 2500 },
      { id: "stat-deliq", label: "Delinquent", count: 150 },
    ],
  },
];

describe("CrossFilterFacetPanel", () => {
  it("renders facet categories and options with zero accessibility violations", async () => {
    const { container } = render(
      <CrossFilterFacetPanel
        title="Ledger Filters"
        categories={TEST_CATEGORIES}
        selectedIds={["reg-na"]}
      />
    );

    expect(screen.getByText("Ledger Filters")).toBeInTheDocument();
    expect(screen.getAllByText("North America").length).toBeGreaterThan(0);
    expect(screen.getByText("Europe")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles option checkbox selection toggling", () => {
    const handleSelection = vi.fn();
    render(
      <CrossFilterFacetPanel
        categories={TEST_CATEGORIES}
        selectedIds={["reg-na"]}
        onSelectionChange={handleSelection}
      />
    );

    const euCheckbox = screen.getByRole("checkbox", { name: /Europe/i });
    fireEvent.click(euCheckbox);
    expect(handleSelection).toHaveBeenCalledWith(["reg-na", "reg-eu"]);

    const naCheckbox = screen.getByRole("checkbox", { name: /North America/i });
    fireEvent.click(naCheckbox);
    expect(handleSelection).toHaveBeenCalledWith([]);
  });

  it("supports category search filtering", () => {
    render(
      <CrossFilterFacetPanel
        categories={TEST_CATEGORIES}
        selectedIds={[]}
      />
    );

    const searchInput = screen.getByLabelText("Search options in Region");
    fireEvent.change(searchInput, { target: { value: "Asia" } });

    expect(screen.getByText("Asia Pacific")).toBeInTheDocument();
    expect(screen.queryByText("North America")).not.toBeInTheDocument();
  });

  it("supports selecting all and resetting category selections", () => {
    const handleSelection = vi.fn();
    render(
      <CrossFilterFacetPanel
        categories={TEST_CATEGORIES}
        selectedIds={["stat-act"]}
        onSelectionChange={handleSelection}
      />
    );

    const allBtn = screen.getAllByRole("button", { name: /^All$/i })[0];
    if (allBtn) {
      fireEvent.click(allBtn);
      expect(handleSelection).toHaveBeenCalledWith(
        expect.arrayContaining(["reg-na", "reg-eu", "reg-ap", "reg-sa", "reg-me", "stat-act"])
      );
    }
  });

  it("clears all active filters when Clear All is clicked", () => {
    const handleSelection = vi.fn();
    const handleClearAll = vi.fn();
    render(
      <CrossFilterFacetPanel
        categories={TEST_CATEGORIES}
        selectedIds={["reg-na", "stat-act"]}
        onSelectionChange={handleSelection}
        onClearAll={handleClearAll}
      />
    );

    const clearAllBtn = screen.getByRole("button", { name: /Clear all/i });
    fireEvent.click(clearAllBtn);
    expect(handleSelection).toHaveBeenCalledWith([]);
    expect(handleClearAll).toHaveBeenCalled();
  });
});
