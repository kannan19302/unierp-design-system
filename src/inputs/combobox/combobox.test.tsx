import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ComboBox } from "./combobox";

const MOCK_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia", disabled: true },
];

describe("Strata V1 ComboBox Primitive", () => {
  it("opens popover on click and filters options", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        options={MOCK_OPTIONS}
        value="us"
        onChange={onChange}
        aria-label="Country selector"
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(screen.getByPlaceholderText("Search options...")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.change(searchInput, { target: { value: "Can" } });
    expect(screen.getByRole("option", { name: /Canada/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /United States/i })).not.toBeInTheDocument();
  });

  it("selects an option via click and closes dropdown", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        options={MOCK_OPTIONS}
        value="us"
        onChange={onChange}
        aria-label="Country selector"
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const option = screen.getByRole("option", { name: /United Kingdom/i });
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledWith("uk");
  });

  it("supports keyboard arrow navigation, Home, End and Enter selection", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        options={MOCK_OPTIONS}
        value="us"
        onChange={onChange}
        aria-label="Country selector"
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const searchInput = screen.getByPlaceholderText("Search options...");
    // Navigate with ArrowDown
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    // Navigate with End
    fireEvent.keyDown(searchInput, { key: "End" });
    // Navigate with Home
    fireEvent.keyDown(searchInput, { key: "Home" });
    // Select highlighted item
    fireEvent.keyDown(searchInput, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("us");
  });

  it("closes on Escape key press", () => {
    render(
      <ComboBox
        options={MOCK_OPTIONS}
        value="us"
        aria-label="Country selector"
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.keyDown(searchInput, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports multi-selection with removable tag pills", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        options={MOCK_OPTIONS}
        value={["us", "ca"]}
        onChange={onChange}
        aria-label="Country selector"
      />
    );

    const removeBtn = screen.getByLabelText("Remove United States");
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["ca"]);
  });

  it("clears selection when clear button is clicked", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        options={MOCK_OPTIONS}
        value="us"
        onChange={onChange}
        aria-label="Country selector"
      />
    );

    const clearBtn = screen.getByLabelText("Clear selection");
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("prevents interaction when disabled or read-only", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ComboBox
        disabled
        options={MOCK_OPTIONS}
        value="us"
        onChange={onChange}
        aria-label="Country selector"
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    rerender(
      <ComboBox
        readOnly
        options={MOCK_OPTIONS}
        value="us"
        onChange={onChange}
        aria-label="Country selector"
      />
    );
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders loading state with aria-busy and spinner", () => {
    render(
      <ComboBox
        loading
        options={MOCK_OPTIONS}
        aria-label="Loading combobox"
      />
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-busy", "true");
  });

  it("renders invalid state with aria-invalid", () => {
    render(
      <ComboBox
        invalid
        options={MOCK_OPTIONS}
        aria-label="Invalid combobox"
      />
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations across multiple states", async () => {
    const { container, rerender } = render(
      <ComboBox
        options={MOCK_OPTIONS}
        value="us"
        aria-label="Country selection"
      />
    );
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    // Multi-select state
    rerender(
      <ComboBox
        multiple
        options={MOCK_OPTIONS}
        value={["us", "ca"]}
        aria-label="Country selection"
      />
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();

    // Disabled state
    rerender(
      <ComboBox
        disabled
        options={MOCK_OPTIONS}
        value="us"
        aria-label="Country selection"
      />
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("allows keyboard activation on tag remove buttons and clear button", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        clearable
        options={MOCK_OPTIONS}
        value={["us", "ca"]}
        onChange={onChange}
        aria-label="Country selector"
      />
    );

    const removeBtn = screen.getByLabelText("Remove United States");
    expect(removeBtn).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(removeBtn, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["ca"]);

    onChange.mockClear();
    const clearBtn = screen.getByLabelText("Clear selection");
    expect(clearBtn).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(clearBtn, { key: " " });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("removes the last tag on Backspace when search input is empty in multiselect", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        options={MOCK_OPTIONS}
        value={["us", "ca"]}
        onChange={onChange}
        aria-label="Country selector"
      />
    );

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Search options...");
    fireEvent.keyDown(searchInput, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["us"]);
  });

  it("maintains stable unique IDs across multiple identical instances", () => {
    const { container } = render(
      <div>
        <ComboBox label="Country" options={MOCK_OPTIONS} />
        <ComboBox label="Country" options={MOCK_OPTIONS} />
      </div>
    );
    const triggers = screen.getAllByRole("combobox");
    expect(triggers[0].id).toBeTruthy();
    expect(triggers[1].id).toBeTruthy();
    expect(triggers[0].id).not.toBe(triggers[1].id);
  });
});
