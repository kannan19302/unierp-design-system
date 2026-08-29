import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { EntityLineage, type LineageItem } from "../entity-lineage";

const mockLineage: LineageItem[] = [
  { id: "1", documentType: "PO", documentNumber: "PO-100", status: "approved" },
  { id: "2", documentType: "INV", documentNumber: "INV-200", status: "pending", isCurrent: true },
];

describe("EntityLineage Primitive", () => {
  it("renders lineage items with document numbers", () => {
    render(<EntityLineage items={mockLineage} />);

    expect(screen.getByText("PO-100")).toBeInTheDocument();
    expect(screen.getByText("INV-200")).toBeInTheDocument();
  });

  it("handles item click callbacks", () => {
    const onItemClick = vi.fn();
    render(<EntityLineage items={mockLineage} onItemClick={onItemClick} />);

    const item1 = screen.getByLabelText("PO PO-100");
    fireEvent.click(item1);

    expect(onItemClick).toHaveBeenCalledWith(mockLineage[0]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<EntityLineage items={mockLineage} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
