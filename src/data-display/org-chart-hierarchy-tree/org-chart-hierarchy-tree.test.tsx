import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  OrgChartHierarchyTree,
  OrgNode,
} from "./org-chart-hierarchy-tree";

const sampleRoot: OrgNode = {
  id: "emp-ceo",
  name: "Dr. Evelyn Vance",
  title: "Chief Executive Officer",
  department: "Executive Leadership",
  avatarInitials: "EV",
  email: "evelyn.vance@unierp.com",
  directReportsCount: 2,
  children: [
    {
      id: "emp-cto",
      name: "Marcus Thorne",
      title: "CTO",
      department: "Engineering",
      avatarInitials: "MT",
      email: "m.thorne@unierp.com",
      directReportsCount: 0,
    },
  ],
};

describe("OrgChartHierarchyTree", () => {
  it("renders organization structure and employee nodes", () => {
    render(
      <OrgChartHierarchyTree
        rootNode={sampleRoot}
        organizationName="Global Aerospace Corp"
      />
    );

    expect(screen.getByText("Global Aerospace Corp")).toBeInTheDocument();
    expect(screen.getByText("Dr. Evelyn Vance")).toBeInTheDocument();
    expect(screen.getByText("Chief Executive Officer")).toBeInTheDocument();
    expect(screen.getByText("Marcus Thorne")).toBeInTheDocument();
  });

  it("handles node selection and collapse toggle", () => {
    const onSelect = vi.fn();
    render(
      <OrgChartHierarchyTree
        rootNode={sampleRoot}
        onSelectEmployee={onSelect}
      />
    );

    const ctoCard = screen.getByText("Marcus Thorne");
    fireEvent.click(ctoCard);
    expect(onSelect).toHaveBeenCalledWith(sampleRoot.children![0]);


    // Collapse toggle on CEO
    const collapseBtn = screen.getByRole("button", { name: /Collapse direct reports/i });
    fireEvent.click(collapseBtn);
    expect(screen.queryByText("Marcus Thorne")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <OrgChartHierarchyTree
        rootNode={sampleRoot}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
