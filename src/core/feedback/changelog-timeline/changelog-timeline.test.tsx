import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ChangelogTimeline } from "./changelog-timeline";

const defaultProps = {} as any;

describe("ChangelogTimeline", () => {
  it("renders without crashing", () => {
    render(<ChangelogTimeline {...defaultProps} entries={[{ version: 'v3.2.0', date: 'Sep 6, 2026', changes: [{ type: 'feat', text: 'Added AI Copilot for invoice drafting' }, { type: 'feat', text: 'New real-time dashboard widgets' }, { type: 'fix', text: 'Fixed currency rounding in multi-currency ledger' }] }, { version: 'v3.1.0', date: 'Aug 29, 2026', changes: [{ type: 'feat', text: 'Bulk payment approval workflow' }, { type: 'breaking', text: 'Removed legacy v1 API endpoints' }] }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ChangelogTimeline {...defaultProps} entries={[{ version: 'v3.2.0', date: 'Sep 6, 2026', changes: [{ type: 'feat', text: 'Added AI Copilot for invoice drafting' }, { type: 'feat', text: 'New real-time dashboard widgets' }, { type: 'fix', text: 'Fixed currency rounding in multi-currency ledger' }] }, { version: 'v3.1.0', date: 'Aug 29, 2026', changes: [{ type: 'feat', text: 'Bulk payment approval workflow' }, { type: 'breaking', text: 'Removed legacy v1 API endpoints' }] }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
