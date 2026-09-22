import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ContextMenu } from "./context-menu";

describe("ContextMenu Primitive", () => {
  it("opens context menu on right click and handles click", () => {
    const onAction = vi.fn();
    render(
      <ContextMenu items={[{ key: "1", label: "Inspect Row", onClick: onAction }]}>
        <div>Target Element</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Target Element"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Inspect Row"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ContextMenu items={[{ key: "1", label: "Inspect" }]}>
        <div>Target</div>
      </ContextMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
