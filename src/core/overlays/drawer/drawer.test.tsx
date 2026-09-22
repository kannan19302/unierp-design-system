import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Drawer } from "./drawer";

describe("Drawer Primitive", () => {
  it("renders drawer panel when open", () => {
    render(
      <Drawer open={true} onClose={() => {}} title="Audit Panel">
        Drawer content
      </Drawer>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Audit Panel")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<Drawer open={true} onClose={onClose} title="Panel" />);
    fireEvent.click(screen.getByLabelText("Close drawer"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Drawer open={true} onClose={() => {}} title="Accessible Drawer">
        Content
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
