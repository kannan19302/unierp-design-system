import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CohortRetentionChart } from "./cohort-retention-chart";

const SAMPLE_COHORTS = [
  { label: "Jan 2024", initialSize: 1200, retentionPcts: [100, 75, 60] },
  { label: "Feb 2024", initialSize: 1450, retentionPcts: [100, 80] },
];

describe("CohortRetentionChart", () => {
  it("renders cohort table rows", () => {
    render(<CohortRetentionChart cohorts={SAMPLE_COHORTS} />);
    expect(screen.getByText("Jan 2024")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CohortRetentionChart ref={ref} cohorts={SAMPLE_COHORTS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <CohortRetentionChart cohorts={SAMPLE_COHORTS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
