import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CanvasMinimapNavigator } from "./canvas-minimap-navigator";

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
