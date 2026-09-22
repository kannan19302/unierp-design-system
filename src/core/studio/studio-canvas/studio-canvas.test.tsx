import { createRef } from "react";
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

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <StudioCanvas ref={ref} label="Ref Canvas">
        <div>Content</div>
      </StudioCanvas>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute("aria-label")).toBe("Ref Canvas");
  });

  it("renders empty slot when isEmpty is true", () => {
    render(
      <StudioCanvas
        label="Empty Canvas"
        isEmpty={true}
        empty={<div>No items found</div>}
      >
        <div>Hidden Children</div>
      </StudioCanvas>
    );
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.queryByText("Hidden Children")).not.toBeInTheDocument();
  });

  it("renders bottom dock and selection overlay if provided", () => {
    render(
      <StudioCanvas
        label="Docked Canvas"
        bottomDock={<div data-testid="bottom-dock">Console Output</div>}
        selectionOverlay={<div data-testid="selection-overlay">Overlay Ring</div>}
      >
        <div>Canvas Item</div>
      </StudioCanvas>
    );
    expect(screen.getByTestId("bottom-dock")).toBeInTheDocument();
    expect(screen.getByTestId("selection-overlay")).toBeInTheDocument();
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
