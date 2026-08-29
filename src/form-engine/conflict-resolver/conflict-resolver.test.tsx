import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ConflictResolver, type ConflictFieldDiff } from "./conflict-resolver";

const mockConflicts: ConflictFieldDiff[] = [
  {
    fieldKey: "amount",
    fieldLabel: "Total Amount",
    clientValue: "$100",
    serverValue: "$200",
  },
];

describe("ConflictResolver", () => {
  it("renders when open and displays conflict diffs", () => {
    render(
      <ConflictResolver
        open={true}
        onClose={() => {}}
        conflicts={mockConflicts}
        onResolve={() => {}}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Simultaneous Modification Detected")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("$200")).toBeInTheDocument();
  });

  it("handles resolution selection and application", () => {
    const onResolve = vi.fn();
    const onClose = vi.fn();

    render(
      <ConflictResolver
        open={true}
        onClose={onClose}
        conflicts={mockConflicts}
        onResolve={onResolve}
      />
    );

    // Switch to server version
    fireEvent.click(screen.getByText("Latest Server Version"));

    // Apply
    fireEvent.click(screen.getByText(/Apply Resolutions/i));

    expect(onResolve).toHaveBeenCalledWith({ amount: "$200" });
    expect(onClose).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ConflictResolver
        open={true}
        onClose={() => {}}
        conflicts={mockConflicts}
        onResolve={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
