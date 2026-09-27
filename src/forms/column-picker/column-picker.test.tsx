import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ColumnPicker } from "./column-picker";

const MOCK_OPTIONS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Customer Name" },
  { key: "total", label: "Total Amount" },
];

describe("ColumnPicker Primitive", () => {
  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ColumnPicker
        ref={ref}
        options={MOCK_OPTIONS}
        visible={["id", "name"]}
        onChange={() => {}}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("opens menu and toggles column visibility", () => {
    const onChange = vi.fn();
    render(
      <ColumnPicker
        options={MOCK_OPTIONS}
        visible={["id", "name", "total"]}
        onChange={onChange}
      />
    );

    const button = screen.getByRole("button", { name: /columns/i });
    fireEvent.click(button);

    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    const checkbox = screen.getByLabelText("Customer Name");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(["id", "total"]);
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(
      <ColumnPicker
        options={MOCK_OPTIONS}
        visible={["id", "name"]}
        onChange={() => {}}
      />
    );

    expect(container.querySelector('[data-slot="column-picker"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="column-picker-trigger"]')).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /columns/i });
    fireEvent.click(button);

    expect(container.querySelector('[data-slot="column-picker-dropdown"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="column-picker-item"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="column-picker-checkbox"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="column-picker-label"]').length).toBe(3);
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <ColumnPicker
          density={density}
          options={MOCK_OPTIONS}
          visible={["id"]}
          onChange={() => {}}
        />
      );
      const root = container.querySelector('[data-slot="column-picker"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ColumnPicker
        options={MOCK_OPTIONS}
        visible={["id", "name"]}
        onChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
