import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { QualityGatesTable, type QualityGateRow } from "./quality-gates-table";

describe("QualityGatesTable Component", () => {
  const sampleGates: QualityGateRow[] = [
    {
      id: "qg-1",
      name: "PostgreSQL RLS",
      category: "security",
      required: true,
      status: "passed",
      evidence: "Isolation verified",
      duration: "5s",
    },
  ];

  it("renders gate details accurately", () => {
    const onViewDetails = vi.fn();
    const onRerun = vi.fn();

    render(
      <QualityGatesTable
        gates={sampleGates}
        onViewDetails={onViewDetails}
        onRerun={onRerun}
      />
    );

    expect(screen.getByText("PostgreSQL RLS")).toBeInTheDocument();
    expect(screen.getByText("Security & RLS")).toBeInTheDocument();
    expect(screen.getByText("Mandatory")).toBeInTheDocument();
    expect(screen.getByText("Isolation verified")).toBeInTheDocument();

    const detailsBtn = screen.getByRole("button", { name: "View details for PostgreSQL RLS" });
    fireEvent.click(detailsBtn);
    expect(onViewDetails).toHaveBeenCalledWith(sampleGates[0]);

    const rerunBtn = screen.getByRole("button", { name: "Re-run PostgreSQL RLS" });
    fireEvent.click(rerunBtn);
    expect(onRerun).toHaveBeenCalledWith(sampleGates[0]);
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<QualityGatesTable ref={ref} gates={sampleGates} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <QualityGatesTable gates={sampleGates} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
