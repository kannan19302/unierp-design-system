import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { InlineEditableRecord } from "./inline-editable-record";

const defaultProps = {} as any;

describe("InlineEditableRecord", () => {
  it("renders without crashing", () => {
    render(<InlineEditableRecord {...defaultProps} fields={[{ key: 'name', label: 'Company Name', value: 'Acme Corp', editable: true }, { key: 'email', label: 'Contact Email', value: 'billing@acme.com', editable: true }, { key: 'plan', label: 'Plan', value: 'Enterprise', editable: true }, { key: 'id', label: 'Account ID', value: 'ACC-00472', editable: false }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<InlineEditableRecord {...defaultProps} fields={[{ key: 'name', label: 'Company Name', value: 'Acme Corp', editable: true }, { key: 'email', label: 'Contact Email', value: 'billing@acme.com', editable: true }, { key: 'plan', label: 'Plan', value: 'Enterprise', editable: true }, { key: 'id', label: 'Account ID', value: 'ACC-00472', editable: false }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
