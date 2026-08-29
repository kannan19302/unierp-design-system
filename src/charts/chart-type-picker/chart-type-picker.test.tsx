import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ChartTypePicker } from "./chart-type-picker";

describe("ChartTypePicker Primitive", () => {
  it("opens menu and changes selected chart type", () => {
    const onChange = vi.fn();
    render(<ChartTypePicker value="bar" onChange={onChange} />);

    const trigger = screen.getByRole("button", { name: /bar chart/i });
    fireEvent.click(trigger);

    expect(screen.getByText("Line Chart")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Line Chart"));
    expect(onChange).toHaveBeenCalledWith("line");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ChartTypePicker value="bar" onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
