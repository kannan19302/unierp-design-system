import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AllocationRuleBuilder } from "./allocation-rule-builder";

describe("AllocationRuleBuilder", () => {
  it("renders cost pool, targets, and has zero accessibility violations", async () => {
    const { container } = render(
      <AllocationRuleBuilder
        poolName="Facilities Overhead"
        poolAmount={1000000}
        basisType="percentage"
      />
    );

    expect(screen.getByText("Facilities Overhead")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000.00")).toBeInTheDocument();
    expect(screen.getByText("✓ Perfectly Balanced")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles adding a new target entity row", () => {
    const handleChange = vi.fn();
    render(
      <AllocationRuleBuilder
        poolName="Facilities Overhead"
        poolAmount={1000000}
        onChangeTargets={handleChange}
      />
    );

    const addBtn = screen.getByRole("button", { name: /\+ Add Target Entity/i });
    fireEvent.click(addBtn);

    expect(screen.getByDisplayValue("New Cost Center Entity")).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalled();
  });

  it("triggers auto-balance remainder when clicked", () => {
    const handleChange = vi.fn();
    render(
      <AllocationRuleBuilder
        poolName="Facilities Overhead"
        poolAmount={1000000}
        basisType="percentage"
        initialTargets={[
          { id: "t1", entityName: "Dept A", costCenterCode: "CC-1", basisValue: 40 },
          { id: "t2", entityName: "Dept B", costCenterCode: "CC-2", basisValue: 30 },
        ]}
        onChangeTargets={handleChange}
      />
    );

    // Current sum is 70%, remaining is +30.00
    const autoBalanceBtn = screen.getByRole("button", { name: /Auto-Balance Remainder/i });
    fireEvent.click(autoBalanceBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "t1", basisValue: 40 }),
        expect.objectContaining({ id: "t2", basisValue: 60 }),
      ]),
      true
    );
  });

  it("switches allocation basis between percentage and fixed currency", () => {
    render(
      <AllocationRuleBuilder
        poolName="Facilities Overhead"
        poolAmount={1000000}
      />
    );

    const fixedBtn = screen.getByRole("button", { name: /Fixed Currency/i });
    fireEvent.click(fixedBtn);

    expect(screen.getByText("Total Allocated:")).toBeInTheDocument();
  });
});
