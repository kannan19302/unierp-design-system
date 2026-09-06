import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { StagePathNavigator } from "./stage-path-navigator";

const sampleStages = [
  { id: "prospect", label: "Prospecting", status: "completed" as const },
  { id: "proposal", label: "Proposal / Quote", status: "current" as const },
  { id: "closed", label: "Closed Won", status: "upcoming" as const },
];

describe("StagePathNavigator", () => {
  it("renders stages and action button", () => {
    const handleAction = vi.fn();
    render(
      <StagePathNavigator
        stages={sampleStages}
        activeStageId="proposal"
        actionLabel="Advance Stage"
        onActionClick={handleAction}
      />
    );

    expect(screen.getByRole("button", { name: /Prospecting/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Proposal \/ Quote/i })).toBeInTheDocument();
    const actionBtn = screen.getByRole("button", { name: /Advance Stage/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalled();
  });

  it("handles stage selection", () => {
    const handleSelect = vi.fn();
    render(
      <StagePathNavigator
        stages={sampleStages}
        onStageSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Prospecting/i }));
    expect(handleSelect).toHaveBeenCalledWith("prospect");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <StagePathNavigator
        stages={sampleStages}
        activeStageId="proposal"
        actionLabel="Advance"
        onActionClick={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
