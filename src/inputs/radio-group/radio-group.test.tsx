import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "./radio-group";

describe("RadioGroup Primitive", () => {
  it("handles selection changes", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        value="opt1"
        onChange={onChange}
        options={[
          { value: "opt1", label: "Option 1" },
          { value: "opt2", label: "Option 2" },
        ]}
      />
    );
    const radio2 = screen.getByLabelText("Option 2");
    fireEvent.click(radio2);
    expect(onChange).toHaveBeenCalledWith("opt2");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RadioGroup
        value="a"
        options={[
          { value: "a", label: "Choice A" },
          { value: "b", label: "Choice B" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
