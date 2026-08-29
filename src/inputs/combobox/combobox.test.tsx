import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ComboBox } from "./combobox";

describe("ComboBox Primitive", () => {
  it("opens popover on click and filters options", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        options={[
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "ca", label: "Canada" },
        ]}
        value="us"
        onChange={onChange}
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Can" } });
    expect(screen.getByRole("option", { name: "Canada" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "United States" })).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ComboBox
        options={[{ value: "1", label: "One" }]}
        value="1"
        aria-label="Selection"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
