import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FeatureRolloutSlider } from "./feature-rollout-slider";

describe("FeatureRolloutSlider", () => {
  it("renders flag key, metrics, and has zero accessibility violations", async () => {
    const { container } = render(
      <FeatureRolloutSlider
        flagKey="billing_instant_settlement"
        description="Instant wire clearance"
        value={25}
        totalAudience={10000}
      />
    );

    expect(screen.getByText("billing_instant_settlement")).toBeInTheDocument();
    expect(screen.getAllByText("25%").length).toBeGreaterThan(0);
    expect(screen.getByText("2,500 / 10,000")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles keyboard navigation on the slider role", () => {
    const handleChange = vi.fn();
    render(
      <FeatureRolloutSlider
        flagKey="test_flag"
        value={50}
        onChange={handleChange}
      />
    );

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    // Arrow Right -> increments by 1 to 51
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(handleChange).toHaveBeenLastCalledWith(51);

    // Arrow Left -> decrements by 1 to 50
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(handleChange).toHaveBeenLastCalledWith(50);

    // End -> 100%
    fireEvent.keyDown(slider, { key: "End" });
    expect(handleChange).toHaveBeenLastCalledWith(100);

    // Home -> 0%
    fireEvent.keyDown(slider, { key: "Home" });
    expect(handleChange).toHaveBeenLastCalledWith(0);
  });

  it("triggers onChange when preset button is clicked", () => {
    const handleChange = vi.fn();
    render(
      <FeatureRolloutSlider
        flagKey="test_flag"
        value={0}
        onChange={handleChange}
      />
    );

    const canaryBtn = screen.getByRole("button", { name: /5% Canary/i });
    fireEvent.click(canaryBtn);
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("supports killswitch toggling and suppresses traffic when active", () => {
    const handleKillswitch = vi.fn();
    render(
      <FeatureRolloutSlider
        flagKey="test_flag"
        value={50}
        isKillswitchActive={true}
        onKillswitchToggle={handleKillswitch}
      />
    );

    expect(screen.getByText("Traffic Cut (0%)")).toBeInTheDocument();
    const killswitchBtn = screen.getByRole("button", {
      name: /KILLSWITCH ACTIVE/i,
    });
    expect(killswitchBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(killswitchBtn);
    expect(handleKillswitch).toHaveBeenCalledWith(false);
  });
});
