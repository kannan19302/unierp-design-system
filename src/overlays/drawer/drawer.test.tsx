import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Drawer, Sheet } from "./drawer";

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

  it("renders anatomy data-slot attributes correctly", () => {
    render(
      <Drawer
        open={true}
        onClose={() => {}}
        title="Audit Panel"
        footer={<button>Save</button>}
      >
        Drawer content
      </Drawer>
    );
    expect(document.querySelector('[data-slot="drawer-backdrop"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="drawer"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="drawer-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="drawer-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="drawer-close"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="drawer-body"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="drawer-footer"]')).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<Drawer open={true} onClose={onClose} title="Panel" />);
    fireEvent.click(screen.getByLabelText("Close drawer"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supports side variants and Sheet alias", () => {
    const { rerender } = render(
      <Sheet open={true} onClose={() => {}} side="left" title="Left Panel" />
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");

    rerender(<Drawer open={true} onClose={() => {}} side="bottom" title="Bottom Panel" />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "bottom");
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
