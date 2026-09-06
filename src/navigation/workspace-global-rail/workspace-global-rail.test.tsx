import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { WorkspaceGlobalRail } from "./workspace-global-rail";

describe("WorkspaceGlobalRail", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<WorkspaceGlobalRail />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders organization button and suite items", () => {
    render(<WorkspaceGlobalRail currentOrgName="Acme Corp" currentOrgAbbr="AC" />);
    expect(screen.getByTitle("Acme Corp")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Enterprise Resource Planning/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Customer Relationship Management/i })).toBeInTheDocument();
  });

  it("handles selecting suite and org button click", () => {
    const onSelectSuite = vi.fn();
    const onSelectOrg = vi.fn();
    render(<WorkspaceGlobalRail onSelectSuite={onSelectSuite} onSelectOrg={onSelectOrg} />);

    const crmButton = screen.getByRole("menuitem", { name: /Customer Relationship Management/i });
    fireEvent.click(crmButton);
    expect(onSelectSuite).toHaveBeenCalledWith("suite_crm");

    const orgButton = screen.getByTitle("Apex Global Holdings");
    fireEvent.click(orgButton);
    expect(onSelectOrg).toHaveBeenCalled();
  });
});
