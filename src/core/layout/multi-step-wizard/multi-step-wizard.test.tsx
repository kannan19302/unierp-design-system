import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MultiStepWizard } from "./multi-step-wizard";

describe("MultiStepWizard Component", () => {
  it("renders wizard with stepper", () => {
    render(<MultiStepWizard />);
    expect(screen.getByRole("region", { name: /multi-step wizard form/i })).toBeInTheDocument();
    expect(screen.getByText("General Info")).toBeInTheDocument();
  });

  it("advances to next step on Continue click", () => {
    const onStepChange = vi.fn();
    render(<MultiStepWizard onStepChange={onStepChange} />);
    const nextBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(nextBtn);
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it("navigates back on Back click", () => {
    const onStepChange = vi.fn();
    render(<MultiStepWizard currentStep={1} onStepChange={onStepChange} />);
    const backBtn = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backBtn);
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MultiStepWizard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
