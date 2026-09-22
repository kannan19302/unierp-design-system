import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SessionExpiryModal } from "./session-expiry-modal";

describe("SessionExpiryModal Component", () => {
  it("renders dialog with countdown", () => {
    render(<SessionExpiryModal remainingSeconds={75} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Session Timeout Warning/i)).toBeInTheDocument();
    expect(screen.getByText("1:15")).toBeInTheDocument();
  });

  it("calls onExtendSession when button clicked", () => {
    const onExtend = vi.fn();
    render(<SessionExpiryModal onExtendSession={onExtend} />);
    const btn = screen.getByRole("button", { name: /stay signed in/i });
    fireEvent.click(btn);
    expect(onExtend).toHaveBeenCalled();
  });

  it("calls onSignOut when button clicked", () => {
    const onSignOut = vi.fn();
    render(<SessionExpiryModal onSignOut={onSignOut} />);
    const btn = screen.getByRole("button", { name: /sign out now/i });
    fireEvent.click(btn);
    expect(onSignOut).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SessionExpiryModal />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
