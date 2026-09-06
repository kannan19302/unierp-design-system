import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RedlineDiffViewer } from "./redline-diff-viewer";

const sampleOriginal = `Line 1: Unchanged
Line 2: Original content`;

const sampleRevised = `Line 1: Unchanged
Line 2: Revised content with additions`;

describe("RedlineDiffViewer", () => {
  it("renders diff viewer with split original and revised panes", () => {
    render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
        documentTitle="Test Contract"
      />
    );

    expect(screen.getByText("Test Contract")).toBeInTheDocument();
    expect(screen.getByText("Original Document")).toBeInTheDocument();
    expect(screen.getByText("Revised with Redlines")).toBeInTheDocument();
    expect(screen.getByText(/Original content/)).toBeInTheDocument();
    expect(screen.getByText(/Revised content with additions/)).toBeInTheDocument();
  });

  it("toggles between split and unified view mode", () => {
    render(
      <RedlineDiffViewer
        originalText={sampleOriginal}
        revisedText={sampleRevised}
      />
    );

    expect(screen.getByText("Original Document")).toBeInTheDocument();

    const unifiedBtn = screen.getByRole("button", { name: /Unified/i });
    fireEvent.click(unifiedBtn);

    // In unified view, the separate pane header is not present
    expect(screen.queryByText("Original Document")).not.toBeInTheDocument();

    const splitBtn = screen.getByRole("button", { name: /Split/i });
    fireEvent.click(splitBtn);
    expect(screen.getByText("Original Document")).toBeInTheDocument();
  });

  it("triggers accept and reject callbacks on active change", () => {
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

    const acceptBtn = screen.getByRole("button", { name: /Accept/i });
    fireEvent.click(acceptBtn);
    expect(onAccept).toHaveBeenCalledTimes(1);

    const rejectBtn = screen.getByRole("button", { name: /Reject/i });
    fireEvent.click(rejectBtn);
    expect(onReject).toHaveBeenCalledTimes(1);
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
