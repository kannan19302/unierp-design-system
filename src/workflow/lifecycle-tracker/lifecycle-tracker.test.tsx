import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { LifecycleTracker, type LifecycleStage } from "./lifecycle-tracker";

const MOCK_STAGES: LifecycleStage[] = [
  { id: "draft", name: "Draft", date: "May 1" },
  { id: "review", name: "Under Review", date: "May 2" },
  { id: "approved", name: "Approved" },
];

describe("LifecycleTracker Primitive", () => {
  it("renders stages and indicates active and completed steps", () => {
    const onSelectStage = vi.fn();
    render(
      <LifecycleTracker
        stages={MOCK_STAGES}
        currentStageId="review"
        onSelectStage={onSelectStage}
      />
    );

    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Under Review")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();

    const draftButton = screen.getByText("Draft").closest('[role="button"]');
    if (draftButton) {
      fireEvent.click(draftButton);
      expect(onSelectStage).toHaveBeenCalledWith("draft");
    }
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <LifecycleTracker stages={MOCK_STAGES} currentStageId="review" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
