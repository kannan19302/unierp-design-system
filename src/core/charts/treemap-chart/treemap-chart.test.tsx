import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TreemapChart } from "./treemap-chart";

const SAMPLE_NODES = [
  { label: "Engineering", value: 450 },
];

describe("TreemapChart", () => {
  it("renders without crashing", () => {
    render(<TreemapChart data={SAMPLE_NODES} />);
    expect(screen.getByRole("img", { name: /treemap chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TreemapChart ref={ref} data={SAMPLE_NODES} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <TreemapChart data={SAMPLE_NODES} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
