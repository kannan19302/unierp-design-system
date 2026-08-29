import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SavedViewSwitcher } from "./saved-view-switcher";

describe("SavedViewSwitcher Primitive", () => {
  it("renders select with views and handles changes", () => {
    const onSelect = vi.fn();
    render(
      <SavedViewSwitcher
        activeViewId="view1"
        onSelectView={onSelect}
        views={[
          { id: "view1", name: "Default View" },
          { id: "view2", name: "Executive View" },
        ]}
      />
    );
    const select = screen.getByLabelText("Saved views");
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "view2" } });
    expect(onSelect).toHaveBeenCalledWith("view2");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SavedViewSwitcher
        activeViewId="v1"
        onSelectView={() => {}}
        views={[{ id: "v1", name: "Standard" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
