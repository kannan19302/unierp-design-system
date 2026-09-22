import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PrivilegedCommandModal } from "./privileged-command-modal";

describe("PrivilegedCommandModal Platform Component", () => {
  it("renders modal preview when open", () => {
    render(
      <PrivilegedCommandModal
        isOpen={true}
        onClose={vi.fn()}
        title="Emergency Flush"
        actionName="Purge Cache"
        appId="SYS"
        targetDescription="Global Redis Cluster"
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Emergency Flush")).toBeInTheDocument();
  });

  it("advances to justification step and validates input", () => {
    render(
      <PrivilegedCommandModal
        isOpen={true}
        onClose={vi.fn()}
        title="Emergency Flush"
        actionName="Purge Cache"
        appId="SYS"
        targetDescription="Global Redis Cluster"
      />
    );
    const proceedBtn = screen.getByRole("button", { name: /Authorize & Proceed/i });
    fireEvent.click(proceedBtn);

    expect(screen.getByText("Audit Justification")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /Confirm & Commit/i });
    fireEvent.click(confirmBtn);

    expect(screen.getByText(/Justification must be at least 8 characters/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PrivilegedCommandModal
        isOpen={true}
        onClose={vi.fn()}
        title="Emergency Flush"
        actionName="Purge Cache"
        appId="SYS"
        targetDescription="Global Redis Cluster"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
