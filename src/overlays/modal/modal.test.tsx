import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Modal } from "./modal";
import { ConfirmDialog } from "./confirm-dialog";

describe("Modal Primitive", () => {
  it("renders modal dialog and title when open", () => {
    render(
      <Modal open={true} onClose={() => {}} title="Reconciliation">
        <p>Reconciliation body</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Reconciliation")).toBeInTheDocument();
    expect(screen.getByText("Reconciliation body")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Dialog Title">
        Content
      </Modal>
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("handles confirm button click in ConfirmDialog", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Confirm Delete"
        message="Are you sure?"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} title="Accessible Modal">
        <p>Accessible content</p>
      </Modal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
