import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { AlertRuleConditionBuilder } from "./alert-rule-condition-builder";

describe("AlertRuleConditionBuilder", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(<AlertRuleConditionBuilder />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders form fields and initial rule values", () => {
    render(<AlertRuleConditionBuilder />);
    expect(
      screen.getByText("Observability Alert Rule & Routing Policy Builder")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("High API Error Rate Alert")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http_server_errors_total")).toBeInTheDocument();
  });

  it("toggles notification channels", () => {
    render(<AlertRuleConditionBuilder />);
    const emailCheckbox = screen.getByLabelText("Infra Security Distribution List");

    expect(emailCheckbox).not.toBeChecked();
    fireEvent.click(emailCheckbox);
    expect(emailCheckbox).toBeChecked();
  });

  it("runs simulation test and displays result banner", () => {
    const handleTest = vi.fn();
    render(<AlertRuleConditionBuilder onTestTrigger={handleTest} />);

    const testBtn = screen.getByRole("button", { name: /simulate alert rule evaluation/i });
    fireEvent.click(testBtn);

    expect(handleTest).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Simulation Output:/i)).toBeInTheDocument();
  });

  it("submits rule and calls onSaveRule callback", () => {
    const handleSave = vi.fn();
    render(<AlertRuleConditionBuilder onSaveRule={handleSave} />);

    const saveBtn = screen.getByRole("button", { name: /save and deploy alert policy/i });
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
