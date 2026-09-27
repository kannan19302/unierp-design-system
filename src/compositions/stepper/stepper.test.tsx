import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Stepper, Steps, stepperVariants } from "./stepper";

describe("Stepper Component", () => {
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

  it("handles step change click", () => {
    const onChange = vi.fn();
    render(
      <Stepper
        current={1}
        onChange={onChange}
        steps={[
          { title: "Step 1" },
          { title: "Step 2" },
          { title: "Step 3" },
        ]}
      />
    );

    const step1Btn = screen.getByText("Step 1").closest("button");
    if (step1Btn) fireEvent.click(step1Btn);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <Stepper
        current={0}
        steps={[{ title: "Setup", description: "Configuring environment" }]}
      />
    );
    expect(container.querySelector('[data-slot="stepper"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper-btn"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper-indicator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper-description"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <Stepper
          density={density}
          current={0}
          steps={[{ title: "Setup" }]}
        />
      );
      const root = container.querySelector('[data-slot="stepper"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = stepperVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("aliases Steps to Stepper", () => {
    expect(Steps).toBe(Stepper);
  });

  it("forwards ref to the nav element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Stepper
        ref={ref}
        current={0}
        steps={[{ title: "Setup" }]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute("data-slot", "stepper");
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
