import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DetailPageTemplate, type DetailTab } from "./detail-page";

const MOCK_TABS: DetailTab[] = [
  { key: "overview", label: "Overview", content: <div>Overview Content</div> },
  { key: "audit", label: "Audit Log", content: <div>Audit Log Content</div>, count: 5 },
];

describe("DetailPageTemplate Primitive", () => {
  it("renders header, back button, and switches tab panels", () => {
    const onBack = vi.fn();
    render(
      <DetailPageTemplate
        title="Invoice #INV-2026-01"
        subtitle="Customer: Acme Corp"
        onBack={onBack}
        tabs={MOCK_TABS}
      />
    );

    expect(screen.getByText("Invoice #INV-2026-01")).toBeInTheDocument();
    expect(screen.getByText("Customer: Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Overview Content")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Audit Log/));
    expect(screen.getByText("Audit Log Content")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back/));
    expect(onBack).toHaveBeenCalled();
  });

  it("annotates slots with data-slot attributes", () => {
    const { container } = render(
      <DetailPageTemplate
        title="Record Details"
        subtitle="Subtitle"
        onBack={() => {}}
        meta={<span>Active</span>}
        above={<div>Above</div>}
        tabs={MOCK_TABS}
        contextRail={<div>Rail</div>}
      />
    );

    expect(container.querySelector('[data-slot="detail-page"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-back-btn"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-header-area"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-meta"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-above"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-tab-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-panel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="detail-page-rail"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <DetailPageTemplate title="Record" tabs={MOCK_TABS} density="compact" />
    );
    const root = container.querySelector('[data-slot="detail-page"]');
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root?.className).toContain("density_compact");

    rerender(<DetailPageTemplate title="Record" tabs={MOCK_TABS} density="ultra-compact" />);
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("density_ultra_compact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DetailPageTemplate title="Record Details" tabs={MOCK_TABS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

