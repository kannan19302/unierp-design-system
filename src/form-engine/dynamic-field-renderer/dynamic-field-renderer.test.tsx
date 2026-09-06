import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DynamicFieldRenderer } from "./dynamic-field-renderer";

const defaultProps = {} as any;

describe("DynamicFieldRenderer", () => {
  it("renders without crashing", () => {
    render(<DynamicFieldRenderer {...defaultProps} schema={[{ key: 'name', label: 'Full Name', type: 'text', required: true }, { key: 'email', label: 'Email', type: 'text', required: true }, { key: 'dept', label: 'Department', type: 'select', options: ['Engineering', 'Sales', 'Finance'] }, { key: 'startDate', label: 'Start Date', type: 'date' }, { key: 'notes', label: 'Notes', type: 'textarea' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DynamicFieldRenderer {...defaultProps} schema={[{ key: 'name', label: 'Full Name', type: 'text', required: true }, { key: 'email', label: 'Email', type: 'text', required: true }, { key: 'dept', label: 'Department', type: 'select', options: ['Engineering', 'Sales', 'Finance'] }, { key: 'startDate', label: 'Start Date', type: 'date' }, { key: 'notes', label: 'Notes', type: 'textarea' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
