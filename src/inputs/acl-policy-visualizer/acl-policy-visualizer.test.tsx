import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AclPolicyVisualizer } from "./acl-policy-visualizer";

describe("AclPolicyVisualizer", () => {
  it("renders policy statements and has zero accessibility violations", async () => {
    const { container } = render(
      <AclPolicyVisualizer policyName="TestPolicy" />
    );

    expect(screen.getByText("TestPolicy")).toBeInTheDocument();
    expect(screen.getByText("TenantSubledgerWriteAccess")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("toggles statement effect from Allow to Deny", () => {
    const handleChange = vi.fn();
    render(
      <AclPolicyVisualizer
        policyName="TestPolicy"
        onChange={handleChange}
      />
    );

    const allowBtn = screen.getByRole("button", { name: /^ALLOW$/i });
    fireEvent.click(allowBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ sid: "TenantSubledgerWriteAccess", effect: "deny" }),
      ])
    );
  });

  it("switches to JSON view mode and renders formatted AST", () => {
    render(<AclPolicyVisualizer policyName="TestPolicy" />);

    const jsonBtn = screen.getByRole("button", { name: /JSON AST/i });
    fireEvent.click(jsonBtn);

    expect(screen.getByText(/"PolicyName": "TestPolicy"/i)).toBeInTheDocument();
  });
});
