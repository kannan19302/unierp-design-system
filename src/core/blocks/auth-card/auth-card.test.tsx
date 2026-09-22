import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { AuthCard } from "./auth-card";

describe("AuthCard Block (IAM-001 through IAM-016)", () => {
  it("renders IAM-001 Hosted Sign-In elements correctly", () => {
    render(<AuthCard mode="login" email="kannan@acme-global.com" />);

    expect(screen.getByRole("heading", { name: "Welcome back", level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("kannan@acme-global.com");
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    expect(screen.getByText("Sign in with Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("toggles password visibility when eye button is clicked", () => {
    render(<AuthCard mode="login" />);
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    const toggleBtn = screen.getByLabelText("Show password");

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
  });

  it("renders IAM-002 MFA Challenge with 6 PIN boxes", () => {
    render(<AuthCard mode="mfa" email="kannan@acme-global.com" />);

    expect(screen.getByRole("heading", { name: "Two-step verification", level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 6")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verify code" })).toBeInTheDocument();
  });

  it("renders IAM-005 Workspace Switcher and searches workspaces", () => {
    render(<AuthCard mode="switcher" />);

    expect(screen.getByRole("heading", { name: "Select a workspace", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Acme Global Corporation")).toBeInTheDocument();
    expect(screen.getByText("Starlight Health Systems")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("🔍 Search organizations or domains...");
    fireEvent.change(searchInput, { target: { value: "Apex" } });

    expect(screen.getByText("Apex FinTech Holdings")).toBeInTheDocument();
    expect(screen.queryByText("Starlight Health Systems")).not.toBeInTheDocument();
  });

  it("renders IAM-006 Session Lockout Console with biometric and break-glass triggers", () => {
    render(<AuthCard mode="lockout" userDisplayName="Kannan — Controller (Acme Global)" />);

    expect(screen.getByRole("heading", { name: "Session locked", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/FINRA Rule 4370/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unlock session" })).toBeInTheDocument();
    expect(screen.getByText("Emergency SecOps break-glass console")).toBeInTheDocument();
  });

  it("has zero accessibility violations across modes", async () => {
    const { container } = render(<AuthCard mode="login" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
