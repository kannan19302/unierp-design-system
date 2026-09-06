import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PermissionMatrixForm } from "./permission-matrix-form";

const defaultProps = {} as any;

describe("PermissionMatrixForm", () => {
  it("renders without crashing", () => {
    render(<PermissionMatrixForm {...defaultProps} roles={['Admin', 'Editor', 'Viewer']} resources={['Users', 'Invoices', 'Reports', 'Settings']} permissions={{ Admin: { Users: true, Invoices: true, Reports: true, Settings: true }, Editor: { Users: false, Invoices: true, Reports: true, Settings: false }, Viewer: { Users: false, Invoices: false, Reports: true, Settings: false } }} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<PermissionMatrixForm {...defaultProps} roles={['Admin', 'Editor', 'Viewer']} resources={['Users', 'Invoices', 'Reports', 'Settings']} permissions={{ Admin: { Users: true, Invoices: true, Reports: true, Settings: true }, Editor: { Users: false, Invoices: true, Reports: true, Settings: false }, Viewer: { Users: false, Invoices: false, Reports: true, Settings: false } }} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
