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
