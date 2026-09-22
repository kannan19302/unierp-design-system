import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BreakGlassAction } from "./break-glass-action";

describe("BreakGlassAction Platform Component", () => {
  it("renders trigger button and opens justification modal", () => {
    render(<BreakGlassAction buttonLabel="Emergency Action" onConfirm={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: "Emergency Action" });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Audit Justification")).toBeInTheDocument();
  });

  it("validates minimum justification length before allowing confirm", () => {
    const onConfirm = vi.fn();
    render(
      <BreakGlassAction
        buttonLabel="Emergency Action"
        minimumJustificationLength={10}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Emergency Action" }));

    const input = screen.getByPlaceholderText(/e\.g\. TICK-1234/i);
    fireEvent.change(input, { target: { value: "Short" } });

    const confirmBtn = screen.getByRole("button", { name: "Confirm Action" });
    expect(confirmBtn).toBeDisabled();

    fireEvent.change(input, { target: { value: "Detailed emergency justification string" } });
    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BreakGlassAction buttonLabel="Emergency Action" onConfirm={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
