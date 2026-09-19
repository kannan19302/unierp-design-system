import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PermissionMatrixForm } from "./permission-matrix-form";

const roles = ["Admin", "Editor", "Viewer"];
const resources = ["Users", "Invoices", "Reports", "Settings"];
const permissions = {
  Admin: { Users: true, Invoices: true, Reports: true, Settings: true },
  Editor: { Users: false, Invoices: true, Reports: true, Settings: false },
  Viewer: { Users: false, Invoices: false, Reports: true, Settings: false },
};

describe("PermissionMatrixForm", () => {
  it("renders without crashing", () => {
    render(
      <PermissionMatrixForm
        roles={roles}
        resources={resources}
        permissions={permissions}
      />
    );
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PermissionMatrixForm
        ref={ref}
        roles={roles}
        resources={resources}
        permissions={permissions}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PermissionMatrixForm
        roles={roles}
        resources={resources}
        permissions={permissions}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
