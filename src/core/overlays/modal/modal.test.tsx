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

  it("assigns distinct stable IDs to two simultaneous modal instances", () => {
    render(
      <>
        <Modal open={true} onClose={() => {}} title="Modal One">
          <p>Body One</p>
        </Modal>
        <Modal open={true} onClose={() => {}} title="Modal Two">
          <p>Body Two</p>
        </Modal>
      </>,
    );

    const dialogs = screen.getAllByRole("dialog");
    expect(dialogs).toHaveLength(2);

    const id1 = dialogs[0].getAttribute("aria-labelledby");
    const id2 = dialogs[1].getAttribute("aria-labelledby");

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it("associates description via aria-describedby", () => {
    render(
      <Modal
        open={true}
        onClose={() => {}}
        title="Payment Confirmation"
        description="This will execute immediately."
      >
        <p>Details</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    const descElement = document.getElementById(descId!);
    expect(descElement).toHaveTextContent("This will execute immediately.");
  });

  it("supports aria-label when no visible title exists", () => {
    render(
      <Modal open={true} onClose={() => {}} aria-label="Borderless Inspector">
        <p>Raw content</p>
      </Modal>,
    );

    expect(
      screen.getByRole("dialog", { name: "Borderless Inspector" }),
    ).toBeInTheDocument();
  });
});
