import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { HierarchicalPathDropdownTrail } from "./hierarchical-path-dropdown-trail";

const sampleSegments = [
  {
    id: "org",
    label: "Acme Global Enterprise",
    siblings: [
      { id: "org1", label: "Acme Global Enterprise", isCurrent: true },
      { id: "org2", label: "Starlight Corp UK" },
    ],
    onSelectSibling: vi.fn(),
  },
  {
    id: "ledger",
    label: "FY2026 Q3 Cost Centers",
  },
];

describe("HierarchicalPathDropdownTrail", () => {
  it("renders path segments and opens sibling dropdown", () => {
    render(
      <HierarchicalPathDropdownTrail
        segments={sampleSegments}
        showCopyPath={true}
      />
    );

    expect(screen.getByText("Acme Global Enterprise")).toBeInTheDocument();
    expect(screen.getByText("FY2026 Q3 Cost Centers")).toBeInTheDocument();

    const triggerBtn = screen.getByRole("button", { name: /Acme Global Enterprise/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText("Starlight Corp UK")).toBeInTheDocument();
  });

  it("handles sibling selection", () => {
    const handleSelectSibling = vi.fn();
    const segments = [
      {
        id: "org",
        label: "Acme Global Enterprise",
        siblings: [{ id: "org2", label: "Starlight Corp UK" }],
        onSelectSibling: handleSelectSibling,
      },
    ];

    render(<HierarchicalPathDropdownTrail segments={segments} />);
    fireEvent.click(screen.getByRole("button", { name: /Acme Global Enterprise/i }));

    const siblingBtn = screen.getByRole("button", { name: "Starlight Corp UK" });
    fireEvent.click(siblingBtn);
    expect(handleSelectSibling).toHaveBeenCalledWith("org2");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <HierarchicalPathDropdownTrail
        segments={sampleSegments}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
