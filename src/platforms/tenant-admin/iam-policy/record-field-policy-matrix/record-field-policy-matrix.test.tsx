import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RecordFieldPolicyMatrix } from "./record-field-policy-matrix";

describe("RecordFieldPolicyMatrix Component", () => {
  const fields = [{ id: "f1", name: "tax_id", isPii: true }];
  const roles = [{ id: "r1", name: "Auditor" }];
  const matrix = { f1: { r1: "READ_ONLY" as const } };

  it("renders matrix fields and updates permission level", () => {
    const onChange = vi.fn();
    render(
      <RecordFieldPolicyMatrix
        fields={fields}
        roles={roles}
        matrix={matrix}
        onChangePermission={onChange}
      />
    );

    expect(screen.getByText("tax_id")).toBeInTheDocument();
    expect(screen.getByText("PII")).toBeInTheDocument();
    expect(screen.getByText("Auditor")).toBeInTheDocument();

    const select = screen.getByLabelText("Permission for tax_id in role Auditor");
    fireEvent.change(select, { target: { value: "MASKED" } });
    expect(onChange).toHaveBeenCalledWith("f1", "r1", "MASKED");
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RecordFieldPolicyMatrix
        ref={ref}
        fields={fields}
        roles={roles}
        matrix={matrix}
        onChangePermission={() => {}}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RecordFieldPolicyMatrix
        fields={fields}
        roles={roles}
        matrix={matrix}
        onChangePermission={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
