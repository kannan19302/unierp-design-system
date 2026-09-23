import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PolicySimulatorInspector } from "./policy-simulator-inspector";

describe("PolicySimulatorInspector Component", () => {
  it("renders form inputs and triggers onSimulate", () => {
    const onSimulate = vi.fn();
    render(
      <PolicySimulatorInspector
        defaultSubject="admin@acme.com"
        defaultResource="Invoices"
        defaultAction="READ"
        onSimulate={onSimulate}
      />
    );

    expect(screen.getByText("Policy Evaluation Simulator")).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: "Simulate policy evaluation" });
    fireEvent.click(submitBtn);

    expect(onSimulate).toHaveBeenCalledWith({
      subject: "admin@acme.com",
      resource: "Invoices",
      action: "READ",
    });
  });

  it("renders simulation results with decision badge and matched rule", () => {
    render(
      <PolicySimulatorInspector
        onSimulate={() => {}}
        result={{
          decision: "ALLOW",
          matchedRule: "RULE_01",
          tenantScoped: true,
          maskedFields: ["tax_id"],
        }}
      />
    );

    expect(screen.getByText("ALLOW")).toBeInTheDocument();
    expect(screen.getByText("RULE_01")).toBeInTheDocument();
    expect(screen.getByText("tax_id")).toBeInTheDocument();
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<PolicySimulatorInspector ref={ref} onSimulate={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PolicySimulatorInspector
        onSimulate={() => {}}
        result={{
          decision: "ALLOW",
          matchedRule: "RULE_01",
          tenantScoped: true,
        }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
