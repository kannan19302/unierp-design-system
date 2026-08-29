import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Stepper } from "./stepper";

describe("Stepper Primitive", () => {
  it("renders steps and marks active step", () => {
    render(
      <Stepper
        current={1}
        steps={[
          { title: "Step 1" },
          { title: "Step 2" },
          { title: "Step 3" },
        ]}
      />
    );
    expect(screen.getByRole("navigation", { name: "Progress Stepper" })).toBeInTheDocument();
    expect(screen.getByText("Step 2").closest("li")).toHaveAttribute("aria-current", "step");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Stepper
        current={0}
        steps={[{ title: "Setup" }, { title: "Confirm" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
