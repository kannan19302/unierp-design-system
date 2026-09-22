import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MultiSelect } from "./multi-select";

describe("MultiSelect Primitive", () => {
  it("opens dropdown and selects option", () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        value={["a"]}
        onChange={onChange}
      />
    );
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const betaOption = screen.getByText("Beta");
    fireEvent.click(betaOption);
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MultiSelect
        options={[{ value: "1", label: "One" }]}
        value={["1"]}
        onChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
