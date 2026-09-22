import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FilterChipGroup } from "./filter-chip-group";

describe("FilterChipGroup Component", () => {
  it("renders active filter chips", () => {
    render(<FilterChipGroup />);
    expect(screen.getByRole("group", { name: /active filters/i })).toBeInTheDocument();
    expect(screen.getByTestId("filter-chip-c1")).toBeInTheDocument();
  });

  it("calls onRemoveChip when remove button clicked", () => {
    const onRemove = vi.fn();
    render(<FilterChipGroup onRemoveChip={onRemove} />);
    const removeBtn = screen.getByRole("button", { name: /remove filter for status/i });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith("c1");
  });

  it("calls onClearAll when clear button clicked", () => {
    const onClearAll = vi.fn();
    render(<FilterChipGroup onClearAll={onClearAll} />);
    const clearBtn = screen.getByRole("button", { name: /clear all/i });
    fireEvent.click(clearBtn);
    expect(onClearAll).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FilterChipGroup />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
