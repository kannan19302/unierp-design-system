import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FacetedFilterNavigationRail } from "./faceted-filter-navigation-rail";

const sampleGroups = [
  {
    id: "status",
    title: "Document Status",
    options: [
      { id: "opt-pending", label: "Pending Approval", count: 42 },
      { id: "opt-approved", label: "Approved / Cleared", count: 1240 },
    ],
  },
];

describe("FacetedFilterNavigationRail", () => {
  it("renders facet groups and handles option toggling", () => {
    const handleToggle = vi.fn();
    render(
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["opt-pending"]}
        onToggleOption={handleToggle}
      />
    );

    expect(screen.getByText("Document Status")).toBeInTheDocument();
    expect(screen.getByText("Pending Approval")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", { name: /Pending Approval/i });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(handleToggle).toHaveBeenCalledWith("status", "opt-pending");
  });

  it("handles group collapse and clear all", () => {
    const handleClearAll = vi.fn();
    render(
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["opt-pending"]}
        onToggleOption={() => {}}
        onClearAll={handleClearAll}
      />
    );

    const clearBtn = screen.getByRole("button", { name: /Clear all filter facets/i });
    fireEvent.click(clearBtn);
    expect(handleClearAll).toHaveBeenCalled();

    const groupHeader = screen.getByRole("button", { name: /Document Status facet group/i });
    fireEvent.click(groupHeader);
    expect(screen.queryByText("Pending Approval")).not.toBeInTheDocument();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["opt-pending"]}
        onToggleOption={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
