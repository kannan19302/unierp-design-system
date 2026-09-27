import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CanvasMinimapNavigator } from "./minimap";

describe("CanvasMinimapNavigator", () => {
  it("renders zoom controls and handles clicks", () => {
    const handleZoomIn = vi.fn();
    const handleZoomOut = vi.fn();
    const handleZoomToFit = vi.fn();

    render(
      <CanvasMinimapNavigator
        zoomPercent={100}
        viewfinder={{ x: 10, y: 10, width: 40, height: 40 }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomToFit={handleZoomToFit}
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();

    const zoomInBtn = screen.getByRole("button", { name: /Zoom in/i });
    fireEvent.click(zoomInBtn);
    expect(handleZoomIn).toHaveBeenCalled();

    const zoomOutBtn = screen.getByRole("button", { name: /Zoom out/i });
    fireEvent.click(zoomOutBtn);
    expect(handleZoomOut).toHaveBeenCalled();

    const fitBtn = screen.getByRole("button", { name: /Zoom to fit canvas/i });
    fireEvent.click(fitBtn);
    expect(handleZoomToFit).toHaveBeenCalled();
  });

  it("renders data-slot anatomy correctly", () => {
    render(
      <CanvasMinimapNavigator
        density="compact"
        zoomPercent={120}
        viewfinder={{ x: 10, y: 10, width: 40, height: 40 }}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onZoomReset={() => {}}
        onZoomToFit={() => {}}
      />
    );
    const minimap = document.querySelector('[data-slot="minimap"]');
    expect(minimap).toBeInTheDocument();
    expect(minimap).toHaveAttribute("data-density", "compact");
    expect(document.querySelector('[data-slot="minimap-radar"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="minimap-viewfinder"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="minimap-toolbar"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="minimap-zoom-label"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="minimap-controls"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="minimap-tool-button"]')).toBeInTheDocument();
  });

  it("forwards ref to the root container", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CanvasMinimapNavigator
        ref={ref}
        zoomPercent={100}
        viewfinder={{ x: 10, y: 10, width: 40, height: 40 }}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <CanvasMinimapNavigator
        zoomPercent={100}
        viewfinder={{ x: 10, y: 10, width: 40, height: 40 }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
