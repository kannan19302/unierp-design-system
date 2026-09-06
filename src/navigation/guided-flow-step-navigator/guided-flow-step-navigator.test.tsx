import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { GuidedFlowStepNavigator } from "./guided-flow-step-navigator";

const sampleSteps = [
  {
    id: "step1",
    title: "Corporate Details",
    status: "completed" as const,
  },
  {
    id: "step2",
    title: "Chart of Accounts Mapping",
    status: "in-progress" as const,
  },
  {
    id: "step3",
    title: "Activation",
    status: "locked" as const,
  },
];

describe("GuidedFlowStepNavigator", () => {
  it("renders steps and handles non-locked step click", () => {
    const handleStepClick = vi.fn();
    render(
      <GuidedFlowStepNavigator
        steps={sampleSteps}
        activeStepId="step2"
        onStepClick={handleStepClick}
      />
    );

    expect(screen.getByText("Corporate Details")).toBeInTheDocument();
    expect(screen.getByText("Chart of Accounts Mapping")).toBeInTheDocument();

    const step1Btn = screen.getByRole("button", { name: /Corporate Details/i });
    fireEvent.click(step1Btn);
    expect(handleStepClick).toHaveBeenCalledWith("step1");

    const lockedBtn = screen.getByRole("button", { name: /Activation/i });
    expect(lockedBtn).toBeDisabled();
    fireEvent.click(lockedBtn);
    expect(handleStepClick).not.toHaveBeenCalledWith("step3");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <GuidedFlowStepNavigator
        steps={sampleSteps}
        activeStepId="step2"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
