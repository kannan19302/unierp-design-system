import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { EmptyState } from "./empty-state";
import { FilteredEmptyState, ErrorState, ForbiddenState, LoadingState } from "./six-states";

describe("EmptyState & SixStates Primitive", () => {
  it("renders empty state with title and action", () => {
    render(<EmptyState title="No items" description="Please create one" action={<button>Add</button>} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("handles retry in ErrorState", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders LoadingState and ForbiddenState", () => {
    render(<ForbiddenState />);
    expect(screen.getByText("Access restricted")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <EmptyState title="Empty" description="Description" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
