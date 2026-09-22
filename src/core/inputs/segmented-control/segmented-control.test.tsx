import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SegmentedControl } from "./segmented-control";

describe("SegmentedControl Component", () => {
  const options = [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
    { value: "opt3", label: "Option 3" },
  ];

  it("renders all segments and identifies selected option", () => {
    render(<SegmentedControl options={options} value="opt2" onChange={() => {}} />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange when clicking a segment", () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={options} value="opt1" onChange={onChange} />);

    fireEvent.click(screen.getByText("Option 3"));
    expect(onChange).toHaveBeenCalledWith("opt3");
  });

  it("supports keyboard arrow navigation", () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={options} value="opt1" onChange={onChange} />);

    const firstRadio = screen.getAllByRole("radio")[0];
    fireEvent.keyDown(firstRadio, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith("opt2");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SegmentedControl
        options={options}
        value="opt1"
        onChange={() => {}}
        aria-label="View switch"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
