import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TenantHierarchyScopeSelector } from "./tenant-hierarchy-scope-selector";

describe("TenantHierarchyScopeSelector", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<TenantHierarchyScopeSelector isOpenByDefault={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders active scope button and opens hierarchy selector", () => {
    render(<TenantHierarchyScopeSelector />);
    const button = screen.getByRole("button", { name: /Current Tenant Scope/i });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByRole("dialog", { name: "Select Corporate & Facility Scope" })).toBeInTheDocument();
    expect(screen.getByText("Corporate Tenant & Scope Hierarchy")).toBeInTheDocument();
  });

  it("filters scopes by search query and triggers selection", () => {
    const onSelect = vi.fn();
    render(<TenantHierarchyScopeSelector isOpenByDefault={true} onSelectScope={onSelect} />);

    const searchInput = screen.getByPlaceholderText(/Search subsidiary/i);
    fireEvent.change(searchInput, { target: { value: "Semiconductor" } });

    expect(screen.getByText(/Apex Semiconductor Inc/i)).toBeInTheDocument();
    expect(screen.queryByText(/Munich Assembly Center/i)).not.toBeInTheDocument();

    const scopeOption = screen.getByRole("option", { name: /Apex Semiconductor Inc/i });
    fireEvent.click(scopeOption);

    expect(onSelect).toHaveBeenCalledWith("scope_apex_semi_ca_prod");
  });
});
