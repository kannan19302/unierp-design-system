import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { EmptyState, emptyStateVariants } from "./empty-state";
import { FilteredEmptyState, ErrorState, ForbiddenState, LoadingState } from "./six-states";

describe("EmptyState & SixStates Component", () => {
  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="No items" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "empty-state");
  });

  it("renders empty state with title and action", () => {
    render(<EmptyState title="No items" description="Please create one" action={<button>Add</button>} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("renders data-slot annotations throughout anatomy", () => {
    const { container } = render(
      <EmptyState
        icon={<span>Icon</span>}
        title="Empty Title"
        description="Empty Description"
        action={<button>Action</button>}
      />
    );
    expect(container.querySelector('[data-slot="empty-state"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state-action"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <EmptyState title="Dense" density={density} />
      );
      const root = container.querySelector('[data-slot="empty-state"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = emptyStateVariants({ density: "compact" });
    expect(classes).toContain("densityCompact");
  });

  it("handles retry in ErrorState", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders LoadingState and ForbiddenState", () => {
    const { container: forbiddenContainer } = render(<ForbiddenState />);
    expect(screen.getByText("Access restricted")).toBeInTheDocument();
    expect(forbiddenContainer.querySelector('[data-slot="forbidden-state"]')).toBeInTheDocument();

    const { container: loadingContainer } = render(<LoadingState message="Loading ledger..." />);
    expect(screen.getByText("Loading ledger...")).toBeInTheDocument();
    expect(loadingContainer.querySelector('[data-slot="loading-state"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <EmptyState title="Empty" description="Description" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
