import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FeedbackToast } from "./feedback-toast";

describe("FeedbackToast Component", () => {
  it("renders status role with message and description", () => {
    render(
      <FeedbackToast
        message="Invoice saved"
        description="Draft status confirmed"
      />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Invoice saved")).toBeInTheDocument();
    expect(screen.getByText("Draft status confirmed")).toBeInTheDocument();
  });

  it("triggers onAction callback", () => {
    const onAction = vi.fn();
    render(
      <FeedbackToast
        message="Item archived"
        actionLabel="Undo"
        onAction={onAction}
      />
    );
    const btn = screen.getByRole("button", { name: "Undo" });
    fireEvent.click(btn);
    expect(onAction).toHaveBeenCalled();
  });

  it("triggers onClose callback", () => {
    const onClose = vi.fn();
    render(
      <FeedbackToast
        message="Notification"
        onClose={onClose}
      />
    );
    const btn = screen.getByRole("button", { name: /close toast notification/i });
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FeedbackToast message="Accessible Toast" description="Zero violations" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
