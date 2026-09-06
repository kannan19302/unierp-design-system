import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DatabaseGrantPrivilegeMatrix } from "./database-grant-privilege-matrix";

const mockObjects = [
  {
    id: "obj_1",
    name: "DB_CORE",
    type: "DATABASE" as const,
    privileges: {
      USAGE: "GRANTED" as const,
      SELECT: "NONE" as const,
      INSERT: "NONE" as const,
      UPDATE: "NONE" as const,
      DELETE: "NONE" as const,
      OWNERSHIP: "NONE" as const,
    },
  },
];

describe("DatabaseGrantPrivilegeMatrix", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <DatabaseGrantPrivilegeMatrix
        currentRole="ANALYST"
        roles={["SYSADMIN", "ANALYST"]}
        objects={mockObjects}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header, active role, and catalog object name", () => {
    render(
      <DatabaseGrantPrivilegeMatrix
        currentRole="ANALYST"
        roles={["SYSADMIN", "ANALYST"]}
        objects={mockObjects}
      />
    );
    expect(
      screen.getByText("Role-Based Database Catalog Privilege Matrix")
    ).toBeInTheDocument();
    expect(screen.getByText("DB_CORE")).toBeInTheDocument();
    expect(screen.getByText("PRIVILEGES SYNCHRONIZED")).toBeInTheDocument();
  });

  it("toggles privilege state and applies modifications", () => {
    const handleApply = vi.fn();
    render(
      <DatabaseGrantPrivilegeMatrix
        currentRole="ANALYST"
        roles={["SYSADMIN", "ANALYST"]}
        objects={mockObjects}
        onApplyPrivileges={handleApply}
      />
    );

    const selectBtn = screen.getByLabelText(
      "Toggle SELECT privilege on DB_CORE (currently NONE)"
    );
    fireEvent.click(selectBtn);

    expect(screen.getByText("1 UNCOMMITTED CHANGES")).toBeInTheDocument();

    const applyBtn = screen.getByRole("button", {
      name: /apply uncommitted privilege modifications/i,
    });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith([
      {
        role: "ANALYST",
        objectId: "obj_1",
        privilege: "SELECT",
        newState: "GRANTED",
      },
    ]);
  });
});
