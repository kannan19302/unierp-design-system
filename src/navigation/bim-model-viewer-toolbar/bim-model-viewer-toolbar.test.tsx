import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { BimModelViewerToolbar } from "./bim-model-viewer-toolbar";

describe("BimModelViewerToolbar", () => {
  it("renders model name and primary camera tools", () => {
    render(
      <BimModelViewerToolbar modelName="Tower-12-Framing.ifc" />
    );

    expect(screen.getByText("Tower-12-Framing.ifc")).toBeDefined();
    expect(screen.getByRole("button", { name: /Orbit Camera/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Pan Camera/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Walkthrough/i })).toBeDefined();
  });

  it("switches camera mode when pan button is clicked", () => {
    const handleCameraChange = vi.fn();

    render(
      <BimModelViewerToolbar
        modelName="Tower-12-Framing.ifc"
        onCameraModeChange={handleCameraChange}
      />
    );

    const panBtn = screen.getByRole("button", { name: /Pan Camera/i });
    fireEvent.click(panBtn);

    expect(handleCameraChange).toHaveBeenCalledWith("pan");
  });

  it("toggles discipline visibility", () => {
    const handleDisciplineToggle = vi.fn();

    render(
      <BimModelViewerToolbar
        modelName="Tower-12-Framing.ifc"
        onDisciplineToggle={handleDisciplineToggle}
      />
    );

    const mepBtn = screen.getByRole("button", { name: /Toggle MEP Layer/i });
    fireEvent.click(mepBtn);

    expect(handleDisciplineToggle).toHaveBeenCalledWith("mep", false);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BimModelViewerToolbar modelName="Tower-12-Framing.ifc" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
