import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { IamPermissionMatrixAuditor } from "./iam-permission-matrix-auditor";

describe("IamPermissionMatrixAuditor", () => {
  const samplePrincipals = [
    { id: "usr-1", name: "elena.rostova@unierp.internal", type: "user" as const, department: "SecOps Core" },
    { id: "usr-2", name: "marcus.vance@unierp.internal", type: "user" as const, department: "Finance Engineering" },
  ];

  const samplePermissions = [
    { id: "p-1", service: "S3", action: "GetObject", riskLevel: "low" as const, description: "Read bucket objects" },
    { id: "p-2", service: "IAM", action: "CreateAccessKey", riskLevel: "critical" as const, description: "Generate credentials" },
  ];

  const sampleMatrix = {
    "usr-1__p-1": { decision: "allow" as const, policySource: "SecOpsReadOnlyPolicy" },
    "usr-1__p-2": { decision: "explicit_deny" as const, policySource: "OrgSCP" },
  };

  const defaultProps = {
    principals: samplePrincipals,
    permissions: samplePermissions,
    matrix: sampleMatrix,
    selectedPrincipalId: "usr-1",
    onSimulateEvaluation: vi.fn(),
    onRevokePermission: vi.fn(),
  };

  it("renders auditor title, metrics, and permissions table", () => {
    render(<IamPermissionMatrixAuditor {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /IAM Effective Permissions Matrix & Auditor/i })).toBeDefined();
    expect(screen.getByText("GetObject")).toBeDefined();
    expect(screen.getByText("CreateAccessKey")).toBeDefined();
    expect(screen.getByText("DENY (SCP)")).toBeDefined();
  });

  it("simulates policy evaluation when clicking simulate button", () => {
    const handleSimulate = vi.fn();
    render(<IamPermissionMatrixAuditor {...defaultProps} onSimulateEvaluation={handleSimulate} />);
    const simulateBtns = screen.getAllByRole("button", { name: /simulate policy evaluation/i });
    expect(simulateBtns.length).toBeGreaterThan(0);
    fireEvent.click(simulateBtns[0]);
    expect(handleSimulate).toHaveBeenCalledWith("usr-1", "p-1");
  });

  it("switches principal and updates state", () => {
    const handleSelect = vi.fn();
    render(<IamPermissionMatrixAuditor {...defaultProps} onSelectPrincipal={handleSelect} />);
    const select = screen.getByLabelText(/Target Principal:/i);
    fireEvent.change(select, { target: { value: "usr-2" } });
    expect(handleSelect).toHaveBeenCalledWith("usr-2");
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<IamPermissionMatrixAuditor {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
