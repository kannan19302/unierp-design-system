import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Modal } from "../modal";

describe("Modal", () => {
  it("renders title and children when open", () => {
    render(
      <Modal open title="Confirm delete" onClose={() => {}}>
        <p>Are you sure?</p>
      </Modal>,
    );
    expect(screen.getByText("Confirm delete")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    // Modal returns null when `open` is false, and when it IS open it renders
    // a role="dialog" div through a Portal into document.body — there is no
    // <dialog> element and nothing lands in `container` either way. The old
    // assertion queried container for "dialog", got null, and passed null to
    // .not.toHaveAttribute(), which jest-dom rejects outright ("received value
    // must be an HTMLElement") — so this case failed on a matcher error rather
    // than ever testing the closed state. Assert the observable behaviour
    // instead, via screen (document.body) so the Portal is actually covered.
    render(
      <Modal open={false} title="Hidden" onClose={() => {}}>
        <p>Nope</p>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.queryByText("Nope")).not.toBeInTheDocument();
  });

  it("calls onClose from the close button", async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Closable" onClose={onClose}>
        <p>Body</p>
      </Modal>,
    );
    await userEvent.click(screen.getByLabelText(/close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("has no axe violations when open", async () => {
    const { container } = render(
      <Modal open title="Accessible modal" onClose={() => {}}>
        <p>Body</p>
      </Modal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
