import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SparklineGrid } from "./sparkline-grid";

const SAMPLE_ROWS = [
  { label: "Revenue", values: [100, 120, 115, 140, 160], current: "$160k", change: 14.2 },
];

describe("SparklineGrid", () => {
  it("renders without crashing", () => {
    render(<SparklineGrid rows={SAMPLE_ROWS} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$160k")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SparklineGrid ref={ref} rows={SAMPLE_ROWS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SparklineGrid rows={SAMPLE_ROWS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
