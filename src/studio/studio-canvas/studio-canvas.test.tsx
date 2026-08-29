import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StudioCanvas } from "./studio-canvas";

describe("StudioCanvas Primitive", () => {
  it("renders canvas and handles selection key events", () => {
    const onSelect = vi.fn();
    render(
      <StudioCanvas
        label="Form Layout Canvas"
        selectedId="field-1"
        onSelect={onSelect}
      >
        <div id="field-1">Field 1</div>
      </StudioCanvas>
    );

    const canvas = screen.getByRole("group", { name: "Form Layout Canvas" });
    expect(canvas).toBeInTheDocument();
    fireEvent.keyDown(canvas, { key: "Escape" });
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StudioCanvas label="Spatial Flow Canvas" variant="spatial">
        <div>Flow Nodes</div>
      </StudioCanvas>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
