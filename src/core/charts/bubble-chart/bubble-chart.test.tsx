import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BubbleChart } from "./bubble-chart";

const SAMPLE_BUBBLES = [
  { x: 10, y: 20, size: 30, label: "Alpha" },
  { x: 25, y: 50, size: 80, label: "Beta" },
];

describe("BubbleChart", () => {
  it("renders without crashing", () => {
    render(<BubbleChart data={SAMPLE_BUBBLES} />);
    expect(screen.getByRole("img", { name: /bubble chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BubbleChart ref={ref} data={SAMPLE_BUBBLES} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BubbleChart data={SAMPLE_BUBBLES} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
