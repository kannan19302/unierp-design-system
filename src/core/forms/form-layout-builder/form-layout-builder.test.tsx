import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FormLayoutBuilder } from "./form-layout-builder";

const defaultProps = {} as any;

describe("FormLayoutBuilder", () => {
  it("renders without crashing", () => {
    render(<FormLayoutBuilder {...defaultProps} sections={[{ id: 's1', label: 'Contact Info', columns: 2, fields: ['First Name', 'Last Name', 'Email', 'Phone'] }, { id: 's2', label: 'Address', columns: 3, fields: ['Street', 'City', 'State', 'ZIP', 'Country'] }, { id: 's3', label: 'Notes', columns: 1, fields: ['Internal Notes'] }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FormLayoutBuilder {...defaultProps} sections={[{ id: 's1', label: 'Contact Info', columns: 2, fields: ['First Name', 'Last Name', 'Email', 'Phone'] }, { id: 's2', label: 'Address', columns: 3, fields: ['Street', 'City', 'State', 'ZIP', 'Country'] }, { id: 's3', label: 'Notes', columns: 1, fields: ['Internal Notes'] }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
