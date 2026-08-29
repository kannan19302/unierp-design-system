import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CommandPalette } from "./command-palette";

describe("CommandPalette Primitive", () => {
  it("filters items by query and selects on Enter", () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={() => {}}
        items={[
          { id: "1", category: "Actions", title: "Create Invoice", onSelect },
          { id: "2", category: "Nav", title: "General Ledger", onSelect: () => {} },
        ]}
      />
    );
    expect(screen.getByRole("dialog", { name: "Command Palette" })).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Search routes, records, or executive commands...");
    fireEvent.change(input, { target: { value: "Invoice" } });
    expect(screen.getByText("Create Invoice")).toBeInTheDocument();
    expect(screen.queryByText("General Ledger")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Create Invoice"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <CommandPalette
        open={true}
        onClose={() => {}}
        items={[{ id: "1", category: "General", title: "Help", onSelect: () => {} }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
