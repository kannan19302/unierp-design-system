import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { HierarchicalPickerForm } from "./hierarchical-picker-form";

const defaultProps = {} as any;

describe("HierarchicalPickerForm", () => {
  it("renders without crashing", () => {
    render(<HierarchicalPickerForm {...defaultProps} levels={[{ label: 'Department', options: { _root: ['Engineering', 'Sales', 'Finance'] } }, { label: 'Team', options: { Engineering: ['Frontend', 'Backend', 'DevOps'], Sales: ['Enterprise', 'SMB'], Finance: ['AP', 'AR', 'Treasury'] } }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<HierarchicalPickerForm {...defaultProps} levels={[{ label: 'Department', options: { _root: ['Engineering', 'Sales', 'Finance'] } }, { label: 'Team', options: { Engineering: ['Frontend', 'Backend', 'DevOps'], Sales: ['Enterprise', 'SMB'], Finance: ['AP', 'AR', 'Treasury'] } }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
