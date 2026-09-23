import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TeamGrid } from "./team-grid";

const defaultProps = {} as any;

describe("TeamGrid", () => {
  it("renders without crashing", () => {
    render(<TeamGrid {...defaultProps} members={[{ name: 'Sarah Chen', role: 'CEO', initials: 'SC' }, { name: 'James Park', role: 'CTO', initials: 'JP' }, { name: 'Maria Garcia', role: 'VP Engineering', initials: 'MG' }, { name: 'David Kim', role: 'Head of Design', initials: 'DK' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<TeamGrid {...defaultProps} members={[{ name: 'Sarah Chen', role: 'CEO', initials: 'SC' }, { name: 'James Park', role: 'CTO', initials: 'JP' }, { name: 'Maria Garcia', role: 'VP Engineering', initials: 'MG' }, { name: 'David Kim', role: 'Head of Design', initials: 'DK' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
