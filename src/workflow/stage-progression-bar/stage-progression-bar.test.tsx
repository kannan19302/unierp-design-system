import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StageProgressionBar, type StageItem } from "./stage-progression-bar";

const mockStages: StageItem[] = [
  { id: "draft", label: "Draft", status: "completed" },
  { id: "review", label: "Review", status: "current", duration: "2 days" },
  { id: "post", label: "Posted", status: "upcoming" },
];

describe("StageProgressionBar Component", () => {
  it("renders all stage labels and current step indicator", () => {
    render(<StageProgressionBar stages={mockStages} currentStageId="review" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Posted")).toBeInTheDocument();
    expect(screen.getByText("2 days")).toBeInTheDocument();
  });

  it("handles stage click events", () => {
    const onStageClick = vi.fn();
    render(<StageProgressionBar stages={mockStages} onStageClick={onStageClick} />);

    const stageBtn = screen.getByRole("button", { name: /Step 1: Draft/i });
    fireEvent.click(stageBtn);
    expect(onStageClick).toHaveBeenCalledWith(mockStages[0]);
  });

  it("handles stage advance action click", () => {
    const onAdvance = vi.fn();
    render(
      <StageProgressionBar
        stages={mockStages}
        showAdvanceButton
        advanceButtonLabel="Approve Voucher"
        onAdvanceStage={onAdvance}
      />
    );

    const advanceBtn = screen.getByRole("button", { name: /Approve Voucher/i });
    fireEvent.click(advanceBtn);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StageProgressionBar
        stages={mockStages}
        currentStageId="review"
        showAdvanceButton
        onAdvanceStage={() => {}}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
