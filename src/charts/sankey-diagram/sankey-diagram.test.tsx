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
  it("renders without crashing", () => {
    render(<SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />);
    expect(screen.getByRole("img", { name: /sankey diagram/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SankeyDiagram ref={ref} nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
