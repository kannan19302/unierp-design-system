import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ProtectedComponent, ProtectedField, PermissionContext } from "./protected-component";

describe("ProtectedComponent Primitive", () => {
  it("renders children when permission is granted", () => {
    render(
      <PermissionContext.Provider value={{ permissions: ["admin.access"], resolvedAccess: null }}>
        <ProtectedComponent permission="admin.access" fallback={<div>Forbidden</div>}>
          <div>Secret Area</div>
        </ProtectedComponent>
      </PermissionContext.Provider>
    );

    expect(screen.getByText("Secret Area")).toBeInTheDocument();
    expect(screen.queryByText("Forbidden")).not.toBeInTheDocument();
  });

  it("renders fallback when permission is denied", () => {
    render(
      <PermissionContext.Provider value={{ permissions: ["user.access"], resolvedAccess: null }}>
        <ProtectedComponent permission="admin.access" fallback={<div>Forbidden</div>}>
          <div>Secret Area</div>
        </ProtectedComponent>
      </PermissionContext.Provider>
    );

    expect(screen.queryByText("Secret Area")).not.toBeInTheDocument();
    expect(screen.getByText("Forbidden")).toBeInTheDocument();
  });

  it("handles wildcard permissions correctly", () => {
    render(
      <PermissionContext.Provider value={{ permissions: ["finance.*"], resolvedAccess: null }}>
        <ProtectedComponent permission="finance.invoice.create">
          <div>Invoice Creator</div>
        </ProtectedComponent>
      </PermissionContext.Provider>
    );

    expect(screen.getByText("Invoice Creator")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PermissionContext.Provider value={{ permissions: ["*"], resolvedAccess: null }}>
        <ProtectedComponent permission="test">
          <div>Accessible Content</div>
        </ProtectedComponent>
      </PermissionContext.Provider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
