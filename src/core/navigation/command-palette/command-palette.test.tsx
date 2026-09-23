import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByRole("combobox", { name: "Search commands" })).toHaveAttribute(
      "aria-controls",
    );
    expect(screen.getAllByRole("option")).toHaveLength(2);

    const input = screen.getByPlaceholderText("Search routes, records, or executive commands...");
    fireEvent.change(input, { target: { value: "Invoice" } });
    expect(screen.getByText("Create Invoice")).toBeInTheDocument();
    expect(screen.queryByText("General Ledger")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Create Invoice"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("navigates options with arrow keys and closes after keyboard selection", () => {
    const first = vi.fn();
    const second = vi.fn();
    const onClose = vi.fn();
    render(
      <CommandPalette
        open
        onClose={onClose}
        items={[
          { id: "first", category: "Actions", title: "Create order", onSelect: first },
          { id: "second", category: "Navigation", title: "Open orders", onSelect: second },
        ]}
      />,
    );

    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /Open orders/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the dialog element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CommandPalette
        ref={ref}
        open={true}
        onClose={() => {}}
        items={[{ id: "1", category: "General", title: "Help", onSelect: () => {} }]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    render(
      <CommandPalette
        open={true}
        onClose={() => {}}
        items={[{ id: "1", category: "General", title: "Help", onSelect: () => {} }]}
      />
    );
    const results = await axe(screen.getByRole("dialog"));
    expect(results).toHaveNoViolations();
  });

  it("does not execute a command when Close is activated with Enter", async () => {
    const select = vi.fn();
    const close = vi.fn();
    render(<CommandPalette open onClose={close} items={[{ id: "a", title: "Archive", category: "Actions", onSelect: select }]} />);
    screen.getByRole("button", { name: "Close command palette" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(close).toHaveBeenCalledTimes(1);
    expect(select).not.toHaveBeenCalled();
  });

  it("restores the launcher after typing and closing with Escape", async () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return <><button onClick={() => setOpen(true)}>Find commands</button><CommandPalette open={open} onClose={() => setOpen(false)} items={[{ id: "a", title: "Help", category: "General", onSelect: () => {} }]} /></>;
    }
    render(<Harness />);
    const launcher = screen.getByRole("button", { name: "Find commands" });
    await userEvent.click(launcher);
    expect(screen.getByRole("combobox")).toHaveFocus();
    await userEvent.type(screen.getByRole("combobox"), "Help");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();
  });

  it("keeps an active result when the available items shrink", () => {
    const select = vi.fn();
    const items = ["First", "Second"].map((title) => ({ id: title, title, category: "Actions", onSelect: select }));
    const { rerender } = render(<CommandPalette open onClose={() => {}} items={items} />);
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    rerender(<CommandPalette open onClose={() => {}} items={items.slice(0, 1)} />);
    const option = screen.getByRole("option");
    expect(option).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-activedescendant", option.id);
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
    expect(select).toHaveBeenCalledTimes(1);
  });
});
