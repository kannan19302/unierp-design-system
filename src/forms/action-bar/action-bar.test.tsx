import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ActionBar } from "./action-bar";

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

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ActionBar primaryAction={{ key: "1", label: "Submit" }} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
