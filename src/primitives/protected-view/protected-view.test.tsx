import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ProtectedComponent, ProtectedField, PermissionContext } from "./protected-view";

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

  it("exposes data-slot and handles AccessDeniedCard with cva", () => {
    const { container } = render(
      <PermissionContext.Provider value={{ permissions: [], resolvedAccess: null }}>
        <ProtectedComponent permission="admin.billing" showAccessDenied />
      </PermissionContext.Provider>
    );

    const card = container.querySelector('[data-slot="access-denied-card"]');
    expect(card).toBeInTheDocument();
    expect(container.querySelector('[data-slot="access-denied-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="access-denied-badge"]')).toBeInTheDocument();
  });

  it("handles ProtectedField FLS hidden and readonly states", () => {
    const { container, rerender } = render(
      <PermissionContext.Provider
        value={{
          permissions: [],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { Account: { ssn: "hidden" } },
            recordFilters: {},
          },
        }}
      >
        <ProtectedField entity="Account" field="ssn">
          <span>123-45-6789</span>
        </ProtectedField>
      </PermissionContext.Provider>
    );

    expect(container.querySelector('[data-slot="protected-field-mask"]')).toBeInTheDocument();
    expect(screen.getByText("REDACTED BY POLICY")).toBeInTheDocument();

    rerender(
      <PermissionContext.Provider
        value={{
          permissions: [],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { Account: { ssn: "readonly" } },
            recordFilters: {},
          },
        }}
      >
        <ProtectedField entity="Account" field="ssn">
          <span>123-45-6789</span>
        </ProtectedField>
      </PermissionContext.Provider>
    );

    expect(container.querySelector('[data-slot="protected-field"]')).toBeInTheDocument();
    expect(screen.getByText("FLS: READ-ONLY")).toBeInTheDocument();
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
