import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RedlineDiffViewer, DiffViewer, diffViewerVariants } from "./diff-viewer";

const sampleOriginal = `Clause 1: Service Scope
Vendor provides 99.9% uptime.
Clause 2: Payment Terms
Payment net 30 days.`;

const sampleRevised = `Clause 1: Service Scope
Vendor provides 99.95% uptime SLA.
Clause 2: Payment Terms
Payment net 45 days.`;

describe("RedlineDiffViewer / DiffViewer Component", () => {
  it("renders comparison header, document title, and change counts", () => {
    render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
        documentTitle="Enterprise SLA Master Agreement"
      />
    );

    expect(screen.getByText("Enterprise SLA Master Agreement")).toBeInTheDocument();
    expect(screen.getByText("2 changes")).toBeInTheDocument();
    expect(screen.getByText("Original Document")).toBeInTheDocument();
    expect(screen.getByText("Revised with Redlines")).toBeInTheDocument();
  });

  it("navigates changes with next/prev buttons", () => {
    render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
      />
    );

    expect(screen.getByText("Change 1 of 2")).toBeInTheDocument();
    const nextBtn = screen.getByLabelText("Next difference");
    fireEvent.click(nextBtn);
    expect(screen.getByText("Change 2 of 2")).toBeInTheDocument();
  });

  it("switches between split and unified view modes", () => {
    render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
      />
    );

    const unifiedBtn = screen.getByTitle("Unified stacked view");
    fireEvent.click(unifiedBtn);
    expect(screen.getByTitle("Unified stacked view")).toHaveAttribute("aria-pressed", "true");
  });

  it("triggers accept and reject callbacks", () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();

    render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
        onAcceptChange={onAccept}
        onRejectChange={onReject}
      />
    );

    const acceptBtn = screen.getByTitle("Accept change");
    fireEvent.click(acceptBtn);
    expect(onAccept).toHaveBeenCalled();

    const rejectBtn = screen.getByTitle("Reject change");
    fireEvent.click(rejectBtn);
    expect(onReject).toHaveBeenCalled();
  });

  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RedlineDiffViewer
        ref={ref}
        originalText={sampleOriginal}
        revisedText={sampleRevised}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
      />
    );
    expect(container.querySelector('[data-slot="diff-viewer"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="diff-viewer-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="diff-viewer-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="diff-viewer-badge"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="diff-viewer-split"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <RedlineDiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          density={density}
        />
      );
      const root = container.querySelector('[data-slot="diff-viewer"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("aliases DiffViewer to RedlineDiffViewer", () => {
    expect(DiffViewer).toBe(RedlineDiffViewer);
    const classes = diffViewerVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
