import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { WorkspacePaneLayoutSelector } from "./workspace-pane-layout-selector";

describe("WorkspacePaneLayoutSelector", () => {
  it("renders pane buttons and handles toggle", () => {
    const handleToggle = vi.fn();
    render(
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: true, showRightPane: false, showBottomPane: false }}
        onTogglePane={handleToggle}
      />
    );

    const leftBtn = screen.getByRole("button", { name: /Toggle Primary Navigation Sidebar/i });
    expect(leftBtn).toHaveAttribute("aria-pressed", "true");

    const rightBtn = screen.getByRole("button", { name: /Toggle Right Inspector Panel/i });
    expect(rightBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(rightBtn);
    expect(handleToggle).toHaveBeenCalledWith("right");
  });

  it("handles preset selection", () => {
    const handleSelectPreset = vi.fn();
    render(
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: true, showRightPane: true, showBottomPane: false }}
        onTogglePane={() => {}}
        activePreset="default"
        onSelectPreset={handleSelectPreset}
      />
    );

    const inspectorPreset = screen.getByRole("button", { name: /Layout preset Inspector/i });
    fireEvent.click(inspectorPreset);
    expect(handleSelectPreset).toHaveBeenCalledWith("inspection");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: true, showRightPane: true, showBottomPane: false }}
        onTogglePane={() => {}}
        onSelectPreset={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
