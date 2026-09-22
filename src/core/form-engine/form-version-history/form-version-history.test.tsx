import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FormVersionHistory } from "./form-version-history";

const defaultProps = {} as any;

describe("FormVersionHistory", () => {
  it("renders without crashing", () => {
    render(<FormVersionHistory {...defaultProps} versions={[{ id: 'v3', timestamp: '2026-09-06 12:00', author: 'John Smith', changes: 'Updated payment terms to Net 30', isCurrent: true }, { id: 'v2', timestamp: '2026-09-05 15:30', author: 'Jane Doe', changes: 'Added line items 4-6' }, { id: 'v1', timestamp: '2026-09-04 09:00', author: 'John Smith', changes: 'Initial creation' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FormVersionHistory {...defaultProps} versions={[{ id: 'v3', timestamp: '2026-09-06 12:00', author: 'John Smith', changes: 'Updated payment terms to Net 30', isCurrent: true }, { id: 'v2', timestamp: '2026-09-05 15:30', author: 'Jane Doe', changes: 'Added line items 4-6' }, { id: 'v1', timestamp: '2026-09-04 09:00', author: 'John Smith', changes: 'Initial creation' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
