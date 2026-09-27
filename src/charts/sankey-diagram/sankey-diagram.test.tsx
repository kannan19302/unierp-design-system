import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SankeyDiagram } from "./sankey-diagram";

const SAMPLE_NODES = [
  { id: "organic", label: "Organic Search" },
  { id: "landing", label: "Landing Page" },
];

const SAMPLE_LINKS = [
  { source: "organic", target: "landing", value: 500 },
];

describe("SankeyDiagram", () => {
  it("renders without crashing and displays nodes", () => {
    render(<SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />);
    expect(screen.getByRole("img", { name: /sankey diagram/i })).toBeInTheDocument();
    expect(screen.getByText("Organic Search")).toBeInTheDocument();
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SankeyDiagram ref={ref} nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />
    );
    expect(container.querySelector('[data-slot="sankey-diagram"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-columns"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-node-column"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-node"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-node-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-node-value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-flow-area"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sankey-diagram-flow-band"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <SankeyDiagram
          density={density}
          nodes={SAMPLE_NODES}
          links={SAMPLE_LINKS}
        />
      );
      const root = container.querySelector('[data-slot="sankey-diagram"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
