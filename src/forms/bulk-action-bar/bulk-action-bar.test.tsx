import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BulkActionBar, ContextualSaveBar } from "./bulk-action-bar";

describe("BulkActionBar & ContextualSaveBar Primitive", () => {
  it("renders bulk action bar with count and actions", () => {
    const onClear = vi.fn();
    render(
      <BulkActionBar
        selectedCount={3}
        onClearSelection={onClear}
        actions={<button>Delete</button>}
      />
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByText("3 items selected")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Clear selection"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("handles save and discard on ContextualSaveBar", () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();
    render(
      <ContextualSaveBar
        visible={true}
        onSave={onSave}
        onDiscard={onDiscard}
      />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Save changes"));
    expect(onSave).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Discard"));
    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={<button>Act</button>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
