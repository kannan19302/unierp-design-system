import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DualControlModal } from "./dual-control-modal";

describe("DualControlModal", () => {
  it("renders modal with operation details when open", () => {
    render(
      <DualControlModal
        open={true}
        operationTitle="Authorize $1M Treasury Transfer"
        operationType="WIRE_TRANSFER"
        targetEntity="Account #9910-CHASE"
        initiatorName="Jane Doe"
        initiatorRole="Lead Accountant"
        onClose={vi.fn()}
        onAuthorize={vi.fn()}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Authorize $1M Treasury Transfer")).toBeInTheDocument();
    expect(screen.getByText("WIRE_TRANSFER")).toBeInTheDocument();
    expect(screen.getByText("Account #9910-CHASE")).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
  });

  it("does not render into DOM when open is false", () => {
    const { container } = render(
      <DualControlModal
        open={false}
        operationTitle="Hidden Operation"
        targetEntity="Account"
        initiatorName="Jane Doe"
        onClose={vi.fn()}
        onAuthorize={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("validates inputs and triggers onAuthorize with complete payload", () => {
    const onAuthorize = vi.fn();
    render(
      <DualControlModal
        open={true}
        operationTitle="Approve GL Unlock"
        targetEntity="Entity 001"
        initiatorName="Bob Vance"
        onClose={vi.fn()}
        onAuthorize={onAuthorize}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Authorize & Sign Transaction/i });
    expect(submitBtn).toBeDisabled();

    // Fill form
    fireEvent.change(
      screen.getByLabelText(/Secondary Reviewer Identifier/i),
      { target: { value: "controller@corp.com" } }
    );
    fireEvent.change(
      screen.getByLabelText(/Security Credential/i),
      { target: { value: "mfa-token-123456" } }
    );
    fireEvent.change(
      screen.getByLabelText(/Policy Justification/i),
      { target: { value: "Authorized per Board audit committee resolution." } }
    );

    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(onAuthorize).toHaveBeenCalledTimes(1);
    expect(onAuthorize).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewerIdentifier: "controller@corp.com",
        securityCredential: "mfa-token-123456",
        justificationReason: "Authorized per Board audit committee resolution.",
      })
    );
  });

  it("calls onClose when Abort Operation button is clicked", () => {
    const onClose = vi.fn();
    render(
      <DualControlModal
        open={true}
        operationTitle="Wire Authorization"
        targetEntity="Entity 001"
        initiatorName="Bob Vance"
        onClose={onClose}
        onAuthorize={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Abort Operation/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DualControlModal
        open={true}
        operationTitle="Authorize Wire Transfer"
        targetEntity="Entity 001"
        initiatorName="Bob Vance"
        onClose={vi.fn()}
        onAuthorize={vi.fn()}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
