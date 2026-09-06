import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { FeatureFlagTargetingRuleBuilder } from "./feature-flag-targeting-rule-builder";

describe("FeatureFlagTargetingRuleBuilder", () => {
  const sampleVariations = [
    { id: "var-true", name: "Enabled (True)", value: true },
    { id: "var-false", name: "Disabled (False)", value: false },
  ];

  const sampleRules = [
    {
      id: "rule-enterprise",
      name: "Enterprise Early Access Tier",
      clauses: [
        {
          id: "c-1",
          attribute: "subscription_tier",
          operator: "is_one_of" as const,
          values: ["ENTERPRISE"],
        },
      ],
      serveVariationId: "var-true",
    },
  ];

  const defaultProps = {
    flagKey: "release-v2-finance-settlement",
    flagName: "V2 High-Throughput Settlement Engine",
    enabled: true,
    variations: sampleVariations,
    rules: sampleRules,
    defaultOffVariationId: "var-false",
    onSaveRules: vi.fn(),
    onToggleEnabled: vi.fn(),
  };

  it("renders feature flag header, key, and targeting rules", () => {
    render(<FeatureFlagTargetingRuleBuilder {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: /V2 High-Throughput Settlement Engine/i })
    ).toBeDefined();
    expect(screen.getByText("release-v2-finance-settlement")).toBeDefined();
    expect(screen.getByText("Enterprise Early Access Tier")).toBeDefined();
  });

  it("toggles flag status when toggle button is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <FeatureFlagTargetingRuleBuilder
        {...defaultProps}
        onToggleEnabled={handleToggle}
      />
    );
    const toggleBtn = screen.getByRole("button", { name: /toggle flag off/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it("adds a new targeting rule when clicking add rule button", () => {
    render(<FeatureFlagTargetingRuleBuilder {...defaultProps} />);
    const addBtn = screen.getByRole("button", { name: /\+ add targeting rule/i });
    fireEvent.click(addBtn);
    expect(screen.getByText("Targeting Rule #2")).toBeDefined();
  });

  it("simulates evaluation for user context", () => {
    render(<FeatureFlagTargetingRuleBuilder {...defaultProps} />);
    const simBtn = screen.getByRole("button", { name: /evaluate targeting rule/i });
    fireEvent.click(simBtn);
    expect(screen.getByText(/Matched \[Enterprise Early Access Tier\]/i)).toBeDefined();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<FeatureFlagTargetingRuleBuilder {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
