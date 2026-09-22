import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DetailPageTemplate, type DetailTab } from "./detail-page-template";

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

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DetailPageTemplate title="Record Details" tabs={MOCK_TABS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
