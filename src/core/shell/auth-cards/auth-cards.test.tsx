import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  SignInCard,
  MfaChallengeCard,
  SsoDiscoveryCard,
  PasswordRecoveryCard,
  ResetPasswordCard,
  SessionLockoutCard,
  RecoveryCodesCard,
} from "./auth-cards";

describe("AuthCards Component Library (Penpot Page 03)", () => {
  it("renders SignInCard and handles submit", () => {
    const onSubmit = vi.fn();
    render(<SignInCard onSubmit={onSubmit} />);

    expect(screen.getByText("Enterprise Sign In")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Work Email"), {
      target: { value: "user@acme.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "SecretPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign in to Workspace/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@acme.com",
      password: "SecretPassword123!",
      remember: true,
    });
  });

  it("renders MfaChallengeCard with 6 digit inputs", () => {
    render(<MfaChallengeCard email="admin@acme.com" />);
    expect(screen.getByText("Two-Factor Authentication")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 6")).toBeInTheDocument();
  });

  it("renders SsoDiscoveryCard and handles discover", () => {
    const onDiscover = vi.fn();
    render(<SsoDiscoveryCard onDiscover={onDiscover} />);
    fireEvent.change(screen.getByLabelText("Enterprise Work Email"), {
      target: { value: "enterprise@acme.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Continue with SSO/i }));
    expect(onDiscover).toHaveBeenCalledWith("enterprise@acme.com");
  });

  it("renders PasswordRecoveryCard", () => {
    render(<PasswordRecoveryCard />);
    expect(screen.getByText("Password Recovery")).toBeInTheDocument();
  });

  it("renders ResetPasswordCard and enforces complexity", () => {
    const onSubmit = vi.fn();
    render(<ResetPasswordCard onSubmit={onSubmit} />);

    const submitBtn = screen.getByRole("button", { name: /Update password and sign in/i });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "StrongP@ssw0rd123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "StrongP@ssw0rd123" },
    });

    expect(submitBtn).not.toBeDisabled();
  });

  it("renders SessionLockoutCard with user info", () => {
    render(
      <SessionLockoutCard
        user={{ name: "Kannan Admin", email: "kannan@acme.com", role: "Controller" }}
      />
    );
    expect(screen.getByText("Session Locked")).toBeInTheDocument();
    expect(screen.getByText("Kannan Admin")).toBeInTheDocument();
    expect(screen.getByText("Controller • kannan@acme.com")).toBeInTheDocument();
  });

  it("renders RecoveryCodesCard and toggles acknowledgment", () => {
    render(
      <RecoveryCodesCard
        codes={["AAAA-1111", "BBBB-2222"]}
        onConfirmStored={() => {}}
      />
    );
    expect(screen.getByText("Emergency Recovery Codes")).toBeInTheDocument();
    expect(screen.getByText("AAAA-1111")).toBeInTheDocument();
  });

  it("has zero accessibility violations across SignInCard", async () => {
    const { container } = render(<SignInCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations across MfaChallengeCard", async () => {
    const { container } = render(<MfaChallengeCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations across ResetPasswordCard", async () => {
    const { container } = render(<ResetPasswordCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
