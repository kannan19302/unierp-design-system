import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ChangelogSection } from "./changelog-section";

const defaultProps = {} as any;

describe("ChangelogSection", () => {
  it("renders without crashing", () => {
    render(<ChangelogSection {...defaultProps} entries={[{ version: 'v3.2.0', date: 'Sep 2026', title: 'AI Copilot & Dashboard Widgets', items: ['AI-powered invoice drafting', 'New real-time dashboard widgets', 'Improved multi-currency support'] }, { version: 'v3.1.0', date: 'Aug 2026', title: 'Bulk Payment Approvals', items: ['Batch payment workflow', 'Enhanced audit trail'] }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ChangelogSection {...defaultProps} entries={[{ version: 'v3.2.0', date: 'Sep 2026', title: 'AI Copilot & Dashboard Widgets', items: ['AI-powered invoice drafting', 'New real-time dashboard widgets', 'Improved multi-currency support'] }, { version: 'v3.1.0', date: 'Aug 2026', title: 'Bulk Payment Approvals', items: ['Batch payment workflow', 'Enhanced audit trail'] }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
