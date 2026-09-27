import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BulletChart } from "./bullet-chart";

describe("BulletChart", () => {
  it("renders without crashing and displays label", () => {
    render(
      <BulletChart
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
      />
    );
    expect(
      screen.getByRole("img", { name: /revenue bullet chart/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <BulletChart
        ref={ref}
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <BulletChart
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
      />
    );
    expect(container.querySelector('[data-slot="bullet-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="bullet-chart-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="bullet-chart-track"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="bullet-chart-range"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="bullet-chart-actual"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="bullet-chart-marker"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="bullet-chart-values"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <BulletChart
          density={density}
          label="Revenue"
          actual={275}
          target={300}
          ranges={[150, 225, 350]}
        />
      );
      const root = container.querySelector('[data-slot="bullet-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BulletChart
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
