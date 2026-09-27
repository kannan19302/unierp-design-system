import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SplitMasterDetailTemplate, SplitDetailPageTemplate } from "./split-detail-page";

describe("SplitMasterDetailTemplate Component", () => {
  it("renders master and detail panes with enterprise data-slots", () => {
    const { container } = render(
      <SplitMasterDetailTemplate
        masterTitle="Accounts"
        masterToolbar={<button type="button">New</button>}
        masterList={<div>Account Item 1</div>}
        detailHeader={<div>Header Info</div>}
        detailBody={<div>Detail Pane Content</div>}
      />
    );
    expect(screen.getByRole("region", { name: /master detail workspace/i })).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Account Item 1")).toBeInTheDocument();
    expect(screen.getByText("Header Info")).toBeInTheDocument();
    expect(screen.getByText("Detail Pane Content")).toBeInTheDocument();

    const root = container.querySelector('[data-slot="split-detail-page"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-density", "standard");
    expect(container.querySelector('[data-slot="split-detail-page-master-pane"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-master-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-master-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-master-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-master-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-detail-pane"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-detail-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-detail-body"]')).toBeInTheDocument();
  });

  it("renders empty state message and slot when isDetailEmpty is true", () => {
    const { container } = render(
      <SplitMasterDetailTemplate
        isDetailEmpty={true}
        emptyDetailMessage="Nothing selected"
      />
    );
    expect(screen.getByText("Nothing selected")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="split-detail-page-empty-state"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <SplitMasterDetailTemplate density="ultra-compact" masterTitle="T1" />
    );
    let root = container.querySelector('[data-slot="split-detail-page"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("densityUltraCompact");

    rerender(<SplitMasterDetailTemplate density="comfortable" masterTitle="T1" />);
    root = container.querySelector('[data-slot="split-detail-page"]');
    expect(root).toHaveAttribute("data-density", "comfortable");
    expect(root?.className).toContain("densityComfortable");
  });

  it("exports SplitDetailPageTemplate alias successfully", () => {
    expect(SplitDetailPageTemplate).toBe(SplitMasterDetailTemplate);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SplitMasterDetailTemplate
        masterTitle="Accessible Pane"
        masterList={<div>Item</div>}
        detailBody={<div>Body</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
