import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ClinicalTrialCohortRandomizer } from "./clinical-trial-cohort-randomizer";

const mockProtocol = {
  protocolId: "PROTO-01",
  studyTitle: "Study Oncology A",
  blinding: "DOUBLE_BLIND" as const,
  targetEnrollment: 100,
  randomizationRatio: "1:1",
  activeArms: [
    { armId: "ARM-A", armName: "Investigational", enrolledCount: 25 },
    { armId: "ARM-B", armName: "Placebo", enrolledCount: 25 },
  ],
};

describe("ClinicalTrialCohortRandomizer", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <ClinicalTrialCohortRandomizer protocol={mockProtocol} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header and protocol metrics", () => {
    render(<ClinicalTrialCohortRandomizer protocol={mockProtocol} />);
    expect(
      screen.getByText("Clinical Trial Double-Blind Cohort Randomization Engine")
    ).toBeInTheDocument();
    expect(screen.getByText("PROTO-01")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("executes randomization and renders dispensation banner", () => {
    const handleRandomize = vi.fn();
    render(
      <ClinicalTrialCohortRandomizer
        protocol={mockProtocol}
        onRandomizeSubject={handleRandomize}
      />
    );

    const subjectInput = screen.getByLabelText("Screened Subject ID:");
    fireEvent.change(subjectInput, { target: { value: "SUBJ-101" } });

    const submitBtn = screen.getByRole("button", {
      name: /randomize subject and allocate masked investigational kit/i,
    });
    fireEvent.click(submitBtn);

    expect(handleRandomize).toHaveBeenCalledTimes(1);
    expect(handleRandomize.mock.calls[0][0].subjectId).toBe("SUBJ-101");
    expect(screen.getByText("DISPENSATION CONFIRMATION")).toBeInTheDocument();
    expect(screen.getByText("SUBJ-101")).toBeInTheDocument();
  });
});
