import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { LookupFieldResolver } from "./lookup-field-resolver";

const defaultProps = {} as any;

describe("LookupFieldResolver", () => {
  it("renders without crashing", () => {
    render(<LookupFieldResolver {...defaultProps} label="Customer" placeholder="Search customers..." results={[{ id: '1', label: 'Acme Corporation', subtitle: 'ACC-001 • Enterprise' }, { id: '2', label: 'GlobalTech Inc', subtitle: 'ACC-002 • SMB' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<LookupFieldResolver {...defaultProps} label="Customer" placeholder="Search customers..." results={[{ id: '1', label: 'Acme Corporation', subtitle: 'ACC-001 • Enterprise' }, { id: '2', label: 'GlobalTech Inc', subtitle: 'ACC-002 • SMB' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
