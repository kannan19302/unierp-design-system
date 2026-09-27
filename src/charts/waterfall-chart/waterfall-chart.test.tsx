import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { WaterfallChart } from "./waterfall-chart";

const SAMPLE_DATA = [
  { label: "Starting Cash", value: 100000, isTotal: true },
  { label: "Revenue", value: 45000 },
];

describe("WaterfallChart", () => {
  it("renders without crashing", () => {
    render(<WaterfallChart data={SAMPLE_DATA} />);
    expect(screen.getByRole("img", { name: /waterfall chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<WaterfallChart ref={ref} data={SAMPLE_DATA} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WaterfallChart data={SAMPLE_DATA} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
