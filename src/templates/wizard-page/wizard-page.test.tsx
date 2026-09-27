import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MultiStepWizard, WizardPageTemplate } from "./wizard-page";

describe("MultiStepWizard Component", () => {
  it("renders wizard with enterprise data slots", () => {
    const { container } = render(<MultiStepWizard />);
    expect(screen.getByRole("region", { name: /multi-step wizard form/i })).toBeInTheDocument();
    expect(screen.getByText("General Info")).toBeInTheDocument();

    const root = container.querySelector('[data-slot="wizard-page"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-density", "standard");
    expect(container.querySelector('[data-slot="wizard-page-stepper"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="wizard-page-step-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="wizard-page-content-area"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="wizard-page-action-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="wizard-page-back-button"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="wizard-page-next-button"]')).toBeInTheDocument();
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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<MultiStepWizard density="ultra-compact" />);
    let root = container.querySelector('[data-slot="wizard-page"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("densityUltraCompact");

    rerender(<MultiStepWizard density="comfortable" />);
    root = container.querySelector('[data-slot="wizard-page"]');
    expect(root).toHaveAttribute("data-density", "comfortable");
    expect(root?.className).toContain("densityComfortable");
  });

  it("exports WizardPageTemplate alias successfully", () => {
    expect(WizardPageTemplate).toBe(MultiStepWizard);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MultiStepWizard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
