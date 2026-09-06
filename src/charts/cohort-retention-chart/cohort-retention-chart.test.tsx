import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CohortRetentionChart } from "./cohort-retention-chart";

describe("CohortRetentionChart", () => {
  it("renders without crashing", () => {
    const cohorts = [
    { label: 'Jan 2026', initialSize: 1200, retentionPcts: [100, 72, 58, 45, 38, 32] },
    { label: 'Feb 2026', initialSize: 1450, retentionPcts: [100, 68, 52, 40, 34] },
    { label: 'Mar 2026', initialSize: 1100, retentionPcts: [100, 75, 60, 48] },
    { label: 'Apr 2026', initialSize: 1380, retentionPcts: [100, 70, 55] },
    { label: 'May 2026', initialSize: 1600, retentionPcts: [100, 73] },
  ];
    render(<CohortRetentionChart cohorts={cohorts} />);
    expect(screen.getByRole('table', { name: /cohort retention chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const cohorts = [
    { label: 'Jan 2026', initialSize: 1200, retentionPcts: [100, 72, 58, 45, 38, 32] },
    { label: 'Feb 2026', initialSize: 1450, retentionPcts: [100, 68, 52, 40, 34] },
    { label: 'Mar 2026', initialSize: 1100, retentionPcts: [100, 75, 60, 48] },
    { label: 'Apr 2026', initialSize: 1380, retentionPcts: [100, 70, 55] },
    { label: 'May 2026', initialSize: 1600, retentionPcts: [100, 73] },
  ];
    const { container } = render(<CohortRetentionChart cohorts={cohorts} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
