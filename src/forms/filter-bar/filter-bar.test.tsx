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

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FilterBar>
        <FilterTag label="Period" value="2026" />
      </FilterBar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
