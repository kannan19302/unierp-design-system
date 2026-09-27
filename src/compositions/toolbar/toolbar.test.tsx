import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ActionBar } from "./toolbar";

describe("ActionBar Primitive", () => {
  it("renders primary and secondary actions", () => {
    const onPrimary = vi.fn();
    render(
      <ActionBar
        primaryAction={{ key: "save", label: "Save", onClick: onPrimary }}
        secondaryActions={[{ key: "cancel", label: "Cancel" }]}
      />
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Save"));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it("renders bulk mode when selectedCount > 0", () => {
    render(<ActionBar selectedCount={5} bulkActions={<button>Batch</button>} />);
    expect(screen.getByText("5 selected")).toBeInTheDocument();
    expect(screen.getByText("Batch")).toBeInTheDocument();
  });

  it("forwards ref correctly to the toolbar container", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ActionBar ref={ref} primaryAction={{ key: "1", label: "Submit" }} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "toolbar");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ActionBar primaryAction={{ key: "1", label: "Submit" }} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <ActionBar primaryAction={{ key: "1", label: "Save" }} density="ultra-compact" />
    );
    const root = container.querySelector('[data-slot="toolbar"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");

    rerender(<ActionBar primaryAction={{ key: "1", label: "Save" }} density="compact" />);
    expect(root).toHaveAttribute("data-density", "compact");

    rerender(<ActionBar primaryAction={{ key: "1", label: "Save" }} density="standard" />);
    expect(root).toHaveAttribute("data-density", "standard");

    rerender(<ActionBar primaryAction={{ key: "1", label: "Save" }} density="comfortable" />);
    expect(root).toHaveAttribute("data-density", "comfortable");
  });

  it("renders data-slot annotations in standard and bulk modes", () => {
    const { container, rerender } = render(
      <ActionBar
        leading={<span>Leading</span>}
        primaryAction={{ key: "save", label: "Save" }}
        secondaryActions={[{ key: "cancel", label: "Cancel" }]}
        aiAction={{ key: "ai", label: "AI Suggest" }}
        overflowActions={[{ key: "more", label: "More" }]}
      />
    );
    expect(container.querySelector('[data-slot="toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-leading"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-actions"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-ai-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-secondary-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-overflow-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-primary-action"]')).toBeInTheDocument();

    rerender(
      <ActionBar
        selectedCount={3}
        onClearSelection={vi.fn()}
        bulkActions={<button>Archive</button>}
      />
    );
    expect(container.querySelector('[data-slot="toolbar-bulk"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-bulk-left"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-bulk-count"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-bulk-deselect"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="toolbar-bulk-right"]')).toBeInTheDocument();
  });
});
