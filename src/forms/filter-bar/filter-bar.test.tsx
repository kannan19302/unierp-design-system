import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FilterBar, FilterTag } from "./filter-bar";

describe("FilterBar Primitive", () => {
  it("renders active filters and triggers clear all", () => {
    const onClear = vi.fn();
    render(
      <FilterBar onClearAll={onClear}>
        <FilterTag label="Type" value="Invoice" />
      </FilterBar>
    );
    expect(screen.getByRole("region", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByText("Invoice")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear all"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("handles tag removal", () => {
    const onRemove = vi.fn();
    render(<FilterTag label="Type" value="Invoice" onRemove={onRemove} />);

    const removeBtn = screen.getByRole("button", { name: "Remove filter Type" });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("forwards ref correctly to FilterBar and FilterTag elements", () => {
    const barRef = React.createRef<HTMLDivElement>();
    const tagRef = React.createRef<HTMLSpanElement>();

    render(
      <FilterBar ref={barRef}>
        <FilterTag ref={tagRef} label="Status" value="Open" />
      </FilterBar>
    );

    expect(barRef.current).toBeInstanceOf(HTMLDivElement);
    expect(barRef.current).toHaveAttribute("role", "region");
    expect(tagRef.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FilterBar>
        <FilterTag label="Period" value="2026" onRemove={() => {}} />
      </FilterBar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
