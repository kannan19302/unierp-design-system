import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TopologyDependencyGraph, TopologyNode } from "./topology-dependency-graph";

const TEST_NODES: TopologyNode[] = [
  { id: "n1", name: "Gateway", type: "gateway", health: "healthy", x: 50, y: 50, p99Ms: 10 },
  { id: "n2", name: "AuthService", type: "service", health: "warning", x: 200, y: 50, p99Ms: 80 },
];

describe("TopologyDependencyGraph", () => {
  it("renders graph nodes, inspector, and has zero accessibility violations", async () => {
    const { container } = render(
      <TopologyDependencyGraph
        nodes={TEST_NODES}
        edges={[{ id: "e1", source: "n1", target: "n2" }]}
      />
    );

    expect(screen.getByText("Enterprise Service Topology & Cluster Dependency Graph")).toBeInTheDocument();
    expect(screen.getAllByText(/Gateway/i).length).toBeGreaterThan(0);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles node selection and fires callback", () => {
    const handleSelect = vi.fn();
    render(
      <TopologyDependencyGraph
        nodes={TEST_NODES}
        edges={[]}
        onSelectNode={handleSelect}
      />
    );

    const n1Btn = screen.getByRole("button", { name: /Gateway/i });
    fireEvent.click(n1Btn);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "n1", name: "Gateway" })
    );
  });
});
