import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AssessmentRubricMatrix, RubricCriterion } from "./assessment-rubric-matrix";

const TEST_CRITERIA: RubricCriterion[] = [
  {
    id: "c1",
    title: "Code Architecture",
    levels: [
      { id: "c1-1", points: 1, label: "Needs Improvement", description: "Tangled code" },
      { id: "c1-2", points: 3, label: "Meets Standards", description: "Good design" },
      { id: "c1-3", points: 5, label: "Exceeds Standards", description: "Flawless modularity" },
    ],
  },
];

describe("AssessmentRubricMatrix", () => {
  it("renders rubric criteria, levels, and has zero accessibility violations", async () => {
    const { container } = render(
      <AssessmentRubricMatrix
        title="Engineering Evaluation"
        subjectName="Alice Smith"
        criteria={TEST_CRITERIA}
        initialSelections={{ c1: "c1-2" }}
      />
    );

    expect(screen.getByText("Engineering Evaluation")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Code Architecture")).toBeInTheDocument();
    expect(screen.getByText("Meets Standards")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles scoring selection and fires callback with updated percentages", () => {
    const handleScore = vi.fn();
    render(
      <AssessmentRubricMatrix
        title="Engineering Evaluation"
        criteria={TEST_CRITERIA}
        onScoreChange={handleScore}
      />
    );

    const levelBtn = screen.getByRole("radio", { name: /Exceeds Standards/i });
    fireEvent.click(levelBtn);

    expect(handleScore).toHaveBeenCalledWith({
      totalPoints: 5,
      maxPoints: 5,
      percentage: 100,
      selections: { c1: "c1-3" },
    });
  });
});
