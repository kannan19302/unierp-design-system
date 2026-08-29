import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FormWizard, type WizardStep } from "../form-wizard";

const mockSteps: WizardStep[] = [
  { id: "1", title: "Step One", component: <div>Content One</div> },
  { id: "2", title: "Step Two", component: <div>Content Two</div> },
];

describe("FormWizard Primitive", () => {
  it("renders steps and advances through next action", () => {
    const onComplete = vi.fn();
    render(<FormWizard title="Onboarding" steps={mockSteps} onComplete={onComplete} />);

    expect(screen.getByText("Onboarding")).toBeInTheDocument();
    expect(screen.getByText("Content One")).toBeInTheDocument();

    const nextBtn = screen.getByText("Next Step");
    fireEvent.click(nextBtn);

    expect(screen.getByText("Content Two")).toBeInTheDocument();

    const completeBtn = screen.getByText("Complete Setup");
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FormWizard title="Onboarding" steps={mockSteps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
