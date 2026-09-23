import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RegistrationFlow } from "./registration-flow";

describe("RegistrationFlow Block (REG-001 through REG-004)", () => {
  it("renders Step 1 (REG-001) Account Setup with form fields", () => {
    render(
      <RegistrationFlow
        step={1}
        initialEmail="alex@company.com"
        initialName="Alex Chen"
        initialOrgName="Acme Corp"
        initialSubdomain="acme"
      />
    );

    expect(screen.getByRole("heading", { name: "Start Your Sovereign UniERP Cloud", level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId("reg-email")).toHaveValue("alex@company.com");
    expect(screen.getByTestId("reg-name")).toHaveValue("Alex Chen");
    expect(screen.getByTestId("reg-org")).toHaveValue("Acme Corp");
    expect(screen.getByTestId("reg-subdomain")).toHaveValue("acme");
    expect(screen.getByTestId("reg-region")).toBeInTheDocument();
    expect(screen.getByTestId("reg-password")).toBeInTheDocument();
    expect(screen.getByTestId("reg-btn-step1")).toBeInTheDocument();
  });

  it("renders Step 2 (REG-002) Identity & OTP Verification with 6-digit slots", () => {
    const onVerifyOtp = vi.fn();
    render(
      <RegistrationFlow
        step={2}
        initialEmail="alex@company.com"
        onVerifyOtp={onVerifyOtp}
      />
    );

    expect(screen.getByRole("heading", { name: "Verify Your Identity", level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId("otp-digit-0")).toBeInTheDocument();
    expect(screen.getByTestId("otp-digit-5")).toBeInTheDocument();

    const verifyBtn = screen.getByTestId("reg-btn-verify");
    expect(verifyBtn).toBeDisabled();

    // Fill 6 digits
    for (let i = 0; i < 6; i++) {
      fireEvent.change(screen.getByTestId(`otp-digit-${i}`), { target: { value: String(i + 1) } });
    }

    expect(verifyBtn).toBeEnabled();
    fireEvent.click(verifyBtn);
    expect(onVerifyOtp).toHaveBeenCalledWith("123456");
  });

  it("renders Step 3 (REG-003) Sovereign Provisioning Engine with progress checklist and terminal", () => {
    render(
      <RegistrationFlow
        step={3}
        provisioningProgress={85}
      />
    );

    expect(screen.getByRole("heading", { name: "Provisioning Sovereign Partition", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Initializing Tenant Vault & Envelope Encryption Keys")).toBeInTheDocument();
    expect(screen.getByText("Allocating Isolated PostgreSQL RLS Partition & Schema Migrations")).toBeInTheDocument();
    expect(screen.getByText("provisioning-orchestrator.log")).toBeInTheDocument();
  });

  it("renders Step 4 (REG-004) Domain Collision & SSO Redirection", () => {
    const onSsoRedirect = vi.fn();
    render(
      <RegistrationFlow
        step={4}
        collisionDomain="company.com"
        collisionOrgName="Acme Technologies"
        collisionIdpName="Okta SSO"
        onSsoRedirect={onSsoRedirect}
      />
    );

    expect(screen.getByRole("heading", { name: "Organization Already Registered", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Self-service tenant creation is disabled for email domain @company.com/)).toBeInTheDocument();
    expect(screen.getByText("Acme Technologies")).toBeInTheDocument();

    const ssoBtn = screen.getByTestId("reg-btn-sso-redirect");
    expect(ssoBtn).toBeInTheDocument();
    fireEvent.click(ssoBtn);
    expect(onSsoRedirect).toHaveBeenCalledTimes(1);
  });

  it("passes WCAG 2.2 accessibility validation via vitest-axe", async () => {
    const { container } = render(
      <RegistrationFlow
        step={1}
        initialEmail="alex@company.com"
        initialName="Alex Chen"
        initialOrgName="Acme Corp"
        initialSubdomain="acme"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
