import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PerspectiveModeSwitcher } from "./perspective-mode-switcher";

const sampleModes = [
  { id: "list", label: "List", count: 142 },
  { id: "kanban", label: "Board", count: 142 },
];

describe("PerspectiveModeSwitcher", () => {
  it("renders modes and handles mode switching", () => {
    const handleModeChange = vi.fn();
    render(
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="list"
        onModeChange={handleModeChange}
      />
    );

    expect(screen.getByRole("tab", { name: /List/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Board/i })).toBeInTheDocument();

    const boardTab = screen.getByRole("tab", { name: /Board/i });
    fireEvent.click(boardTab);
    expect(handleModeChange).toHaveBeenCalledWith("kanban");
  });

  it("handles customize and save view actions", () => {
    const handleCustomize = vi.fn();
    const handleSave = vi.fn();

    render(
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="list"
        onModeChange={() => {}}
        onCustomizeView={handleCustomize}
        onSaveView={handleSave}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Customize View Fields and Sorting/i }));
    expect(handleCustomize).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Save Current View Preset/i }));
    expect(handleSave).toHaveBeenCalled();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="list"
        onModeChange={() => {}}
        onCustomizeView={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
