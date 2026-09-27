import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DonutChart } from "./donut-chart";

describe("DonutChart", () => {
  it("renders SVG circle segments", () => {
    const { container } = render(<DonutChart centerValue="85%" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
