import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ChangeHistory, type ChangeEntry } from "./change-history";

const MOCK_ENTRIES: ChangeEntry[] = [
  {
    id: "ch-1",
    userId: "usr-1",
    userName: "Alice Chen",
    action: "CREATE",
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "ch-2",
    userId: "usr-2",
    userName: "Bob Smith",
    action: "UPDATE",
    fieldChanges: [
      { field: "status", label: "Status", oldValue: "DRAFT", newValue: "ACTIVE" },
    ],
    createdAt: "2026-05-02T14:30:00Z",
  },
];

describe("ChangeHistory Primitive", () => {
  it("renders chronological audit entries with diffs", () => {
    render(
      <ChangeHistory
        entityType="invoice"
        entityId="inv-100"
        initialEntries={MOCK_ENTRIES}
      />
    );

    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText(/created this record/i)).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("DRAFT")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ChangeHistory
        entityType="invoice"
        entityId="inv-100"
        initialEntries={MOCK_ENTRIES}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
