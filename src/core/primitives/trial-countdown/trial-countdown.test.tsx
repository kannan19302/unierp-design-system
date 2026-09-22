import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TrialCountdown } from "./trial-countdown";

describe("TrialCountdown Primitive", () => {
  it("renders active trial message with time", () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    render(<TrialCountdown endsAt={futureDate} />);
    expect(screen.getByText(/Your Free Trial is active/i, { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("renders expired message when date is past", () => {
    const pastDate = new Date(Date.now() - 5000).toISOString();
    render(<TrialCountdown endsAt={pastDate} />);
    expect(screen.getByText("Your Free Trial has ended.")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const { container } = render(<TrialCountdown endsAt={futureDate} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
