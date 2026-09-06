import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RecordAnchorNavigationStrip } from "./record-anchor-navigation-strip";

const sampleSections = [
  { id: "general", label: "General Header", status: "completed" as const },
  { id: "lines", label: "Invoice Lines", count: 12, status: "completed" as const },
  { id: "compliance", label: "Compliance & VAT", status: "error" as const },
];

describe("RecordAnchorNavigationStrip", () => {
  it("renders section items and counts", () => {
    render(
      <RecordAnchorNavigationStrip
        items={sampleSections}
        title="Sections"
        activeId="general"
      />
    );

    expect(screen.getByText("Sections")).toBeInTheDocument();
    expect(screen.getByText("Invoice Lines")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("handles item selection", () => {
    const handleSelect = vi.fn();
    render(
      <RecordAnchorNavigationStrip
        items={sampleSections}
        onSelect={handleSelect}
      />
    );

    const linesBtn = screen.getByRole("button", { name: /Invoice Lines/i });
    fireEvent.click(linesBtn);
    expect(handleSelect).toHaveBeenCalledWith("lines");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <RecordAnchorNavigationStrip
        items={sampleSections}
        activeId="general"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
