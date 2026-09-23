import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CssPropertiesInspector } from "./css-properties-inspector";

describe("CssPropertiesInspector Component", () => {
  it("renders inspector sections and handles inputs", () => {
    const onChange = vi.fn();
    render(
      <CssPropertiesInspector
        values={{ display: "flex", gap: "1rem", width: "100%" }}
        onChange={onChange}
      />
    );

    expect(screen.getByRole("region", { name: "Styles & Layout" })).toBeInTheDocument();

    const gapInput = screen.getByLabelText("Gap");
    fireEvent.change(gapInput, { target: { value: "2rem" } });
    expect(onChange).toHaveBeenCalledWith("gap", "2rem");

    const displaySelect = screen.getByLabelText("Display");
    fireEvent.change(displaySelect, { target: { value: "grid" } });
    expect(onChange).toHaveBeenCalledWith("display", "grid");
  });

  it("handles accordion collapse and expansion", () => {
    render(
      <CssPropertiesInspector
        values={{}}
        onChange={() => {}}
      />
    );

    const layoutBtn = screen.getByRole("button", { name: /Layout & Alignment/ });
    expect(layoutBtn).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(layoutBtn);
    expect(layoutBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CssPropertiesInspector ref={ref} values={{}} onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <CssPropertiesInspector
        values={{ display: "flex", width: "100%" }}
        onChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
