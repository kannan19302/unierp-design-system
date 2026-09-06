import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  CanaryRolloutProgressVisualizer,
  CanaryMetricComparison,
} from "./canary-rollout-progress-visualizer";

const sampleMetrics: CanaryMetricComparison[] = [
  {
    name: "HTTP 5xx Error Rate",
    unit: "%",
    baselineValue: 0.01,
    canaryValue: 0.02,
    maxThreshold: 0.5,
    status: "pass",
  },
];

describe("CanaryRolloutProgressVisualizer", () => {
  it("renders canary traffic distribution and metrics", () => {
    render(
      <CanaryRolloutProgressVisualizer
        serviceName="payments-orchestration-engine"
        metrics={sampleMetrics}
      />
    );

    expect(screen.getByText("payments-orchestration-engine")).toBeInTheDocument();
    expect(screen.getByText(/ACTIVE CANARY ANALYSIS/i)).toBeInTheDocument();
    expect(screen.getByText(/75% Stable/i)).toBeInTheDocument();
    expect(screen.getByText("HTTP 5xx Error Rate")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Emergency Abort/i })).toBeInTheDocument();
  });

  it("handles emergency abort trigger", () => {
    const onAbort = vi.fn();
    render(
      <CanaryRolloutProgressVisualizer
        metrics={sampleMetrics}
        onAbort={onAbort}
      />
    );

    const abortBtn = screen.getByRole("button", { name: /Emergency Abort/i });
    fireEvent.click(abortBtn);

    expect(onAbort).toHaveBeenCalled();
    expect(screen.getByText(/ROLLED BACK \(ABORTED\)/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <CanaryRolloutProgressVisualizer
        metrics={sampleMetrics}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
