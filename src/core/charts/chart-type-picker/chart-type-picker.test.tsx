import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ChartTypePicker } from "./chart-type-picker";

describe("ChartTypePicker", () => {
  it("renders trigger button with active chart label", () => {
    render(<ChartTypePicker value="bar" onChange={() => {}} />);
    expect(screen.getByText("Bar Chart")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ChartTypePicker ref={ref} value="bar" onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ChartTypePicker value="bar" onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
