import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MultiSelect } from "./multi-select";

describe("MultiSelect Primitive", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
    { value: "c", label: "Gamma", disabled: true },
    { value: "d", label: "Delta" },
  ];

  it("opens dropdown and selects option via mouse", () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={["a"]} onChange={onChange} />);

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const betaOption = screen.getByText("Beta");
    fireEvent.click(betaOption);
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("navigates options via keyboard Arrow keys, Home, End, and toggles with Space/Enter", () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={["a"]} onChange={onChange} />);

    const trigger = screen.getByRole("combobox");
    trigger.focus();

    // Open via ArrowDown
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-0"));

    // Navigate to Beta (index 1)
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-1"));

    // Toggle Beta with Enter
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);

    // ArrowDown skips disabled option 'c' (index 2) directly to 'd' (index 3)
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-3"));

    // Home goes back to first enabled option 'a' (index 0)
    fireEvent.keyDown(trigger, { key: "Home" });
    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-0"));

    // End goes to last enabled option 'd' (index 3)
    fireEvent.keyDown(trigger, { key: "End" });
    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-3"));

    // Toggle Delta with Space
    fireEvent.keyDown(trigger, { key: " " });
    expect(onChange).toHaveBeenCalledWith(["a", "d"]);
  });

  it("closes on Escape and restores focus to trigger", () => {
    render(<MultiSelect options={options} value={[]} onChange={() => {}} />);

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("removes a tag when clicking remove button", () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={["a", "b"]} onChange={onChange} />);

    const removeBtn = screen.getByLabelText("Remove Alpha");
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["b"]);
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <MultiSelect density="compact" options={[{ value: "1", label: "One" }]} value={["1"]} onChange={() => {}} />
    );
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(
      <MultiSelect density="ultra-compact" options={[{ value: "1", label: "One" }]} value={["1"]} onChange={() => {}} />
    );
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(
      <MultiSelect density="comfortable" options={[{ value: "1", label: "One" }]} value={["1"]} onChange={() => {}} />
    );
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("generates stable unique per-instance IDs for identical labeled components on the same page", () => {
    render(
      <>
        <MultiSelect label="Roles" options={options} value={["a"]} onChange={() => {}} />
        <MultiSelect label="Roles" options={options} value={["b"]} onChange={() => {}} />
      </>
    );

    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes).toHaveLength(2);
    expect(comboboxes[0]?.id).not.toBe(comboboxes[1]?.id);

    const labels = screen.getAllByText("Roles");
    expect(labels[0]).toHaveAttribute("for", comboboxes[0]?.id);
    expect(labels[1]).toHaveAttribute("for", comboboxes[1]?.id);
  });

  it("handles invalid state and displays error message", () => {
    render(
      <MultiSelect
        label="Regional Hubs"
        options={[{ value: "1", label: "One" }]}
        value={[]}
        onChange={() => {}}
        invalid
        error="Select at least one hub"
      />
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Select at least one hub");
  });

  it("has zero accessibility violations in closed state", async () => {
    const { container } = render(
      <MultiSelect
        label="Categories"
        options={options}
        value={["a"]}
        onChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in open state with active keyboard focus", async () => {
    const { container } = render(
      <MultiSelect
        label="Categories"
        options={options}
        value={["a"]}
        onChange={() => {}}
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
