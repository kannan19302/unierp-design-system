import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DetailViewTemplate } from "./detail-view-template";

describe("DetailViewTemplate Component", () => {
  it("renders main landmark with title and identifier", () => {
    render(
      <DetailViewTemplate
        entityType="Invoice"
        title="INV-2026-009"
        identifier="INV-009"
      />
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("INV-2026-009")).toBeInTheDocument();
    expect(screen.getByText("INV-009")).toBeInTheDocument();
  });

  it("renders sidebar content when provided", () => {
    render(
      <DetailViewTemplate
        entityType="Order"
        title="ORD-101"
        identifier="ORD-101"
        sidebarContent={<div>Sidebar Timeline</div>}
      />
    );
    expect(screen.getByText("Sidebar Timeline")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DetailViewTemplate
        entityType="Vendor"
        title="Global Freight"
        identifier="VND-771"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
