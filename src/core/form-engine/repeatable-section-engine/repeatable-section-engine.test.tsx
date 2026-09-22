import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RepeatableSectionEngine } from "./repeatable-section-engine";

const defaultProps = {} as any;

describe("RepeatableSectionEngine", () => {
  it("renders without crashing", () => {
    render(<RepeatableSectionEngine {...defaultProps} sectionLabel="Contact" fieldLabels={['First Name', 'Last Name', 'Email', 'Phone', 'Role']} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<RepeatableSectionEngine {...defaultProps} sectionLabel="Contact" fieldLabels={['First Name', 'Last Name', 'Email', 'Phone', 'Role']} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
