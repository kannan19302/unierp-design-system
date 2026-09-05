import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  RegistrationCard,
  EmailVerificationCard,
  RegionProvisioningCard,
  DomainCollisionCard,
  OnboardingWizard,
} from "./onboarding-wizard";

describe("OnboardingWizard & Registration Flows (Penpot Page 04)", () => {
  describe("RegistrationCard (REG-001)", () => {
    it("renders workspace registration form inputs", () => {
      render(
        <RegistrationCard
          initialOrgName="Acme Global Inc."
          initialFirstName="Kannan"
          initialLastName="Rajagopal"
          initialEmail="kannan@acme-global.com"
        />
      );

      expect(screen.getByRole("heading", { name: "Create your workspace" })).toBeInTheDocument();
      expect(screen.getByLabelText(/Organization Legal Name/i)).toHaveValue("Acme Global Inc.");
      expect(screen.getByLabelText(/First Name/i)).toHaveValue("Kannan");
      expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Rajagopal");
      expect(screen.getByLabelText(/Corporate Work Email/i)).toHaveValue("kannan@acme-global.com");
      expect(screen.getByLabelText(/Master Encryption Password/i)).toBeInTheDocument();
    });

    it("has zero accessibility violations", async () => {
      const { container } = render(
        <RegistrationCard
          initialOrgName="Acme Global Inc."
          initialFirstName="Kannan"
          initialLastName="Rajagopal"
          initialEmail="kannan@acme-global.com"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("handles form submission when required fields and terms accepted", () => {
      const handleSubmit = vi.fn();
      render(
        <RegistrationCard
          initialOrgName="Acme Global Inc."
          initialFirstName="Kannan"
          initialLastName="Rajagopal"
          initialEmail="kannan@acme-global.com"
          onSubmitRegistration={handleSubmit}
        />
      );

      const passwordInput = screen.getByLabelText(/Master Encryption Password/i);
      fireEvent.change(passwordInput, { target: { value: "SecretPassword123!" } });

      const termsCheckbox = screen.getByRole("checkbox");
      fireEvent.click(termsCheckbox);

      const submitBtn = screen.getByRole("button", { name: /Create Workspace/i });
      expect(submitBtn).not.toBeDisabled();
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalledWith({
        orgName: "Acme Global Inc.",
        firstName: "Kannan",
        lastName: "Rajagopal",
        email: "kannan@acme-global.com",
        password: "SecretPassword123!",
        termsAccepted: true,
      });
    });
  });

  describe("EmailVerificationCard (REG-002)", () => {
    it("renders OTP verification inputs and timer notice", () => {
      render(<EmailVerificationCard email="kannan@acme-global.com" />);

      expect(screen.getByRole("heading", { name: "Verify your work email" })).toBeInTheDocument();
      expect(screen.getByText("kannan@acme-global.com")).toBeInTheDocument();
      expect(screen.getByLabelText("Digit 1 of verification code")).toBeInTheDocument();
      expect(screen.getByText(/Code expires in/i)).toBeInTheDocument();
    });

    it("has zero accessibility violations", async () => {
      const { container } = render(
        <EmailVerificationCard email="kannan@acme-global.com" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("allows entering 6-digit OTP code and submitting", () => {
      const handleVerify = vi.fn();
      render(
        <EmailVerificationCard
          email="kannan@acme-global.com"
          onVerifyOtp={handleVerify}
        />
      );

      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`Digit ${i} of verification code`);
        fireEvent.change(input, { target: { value: `${i}` } });
      }

      const verifyBtn = screen.getByRole("button", { name: /Verify & Continue/i });
      expect(verifyBtn).not.toBeDisabled();
      fireEvent.click(verifyBtn);

      expect(handleVerify).toHaveBeenCalledWith("123456");
    });
  });

  describe("RegionProvisioningCard (REG-003)", () => {
    it("renders sovereign regions with active status", () => {
      render(<RegionProvisioningCard />);

      expect(screen.getByRole("heading", { name: "Your workspace is ready" })).toBeInTheDocument();
      expect(screen.getByText("US East (N. Virginia)")).toBeInTheDocument();
      expect(screen.getByText("EU Central (Frankfurt)")).toBeInTheDocument();
      expect(screen.getByText("India (Mumbai)")).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    });

    it("has zero accessibility violations", async () => {
      const { container } = render(<RegionProvisioningCard />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("triggers launch workspace callback", () => {
      const handleLaunch = vi.fn();
      render(<RegionProvisioningCard onLaunchWorkspace={handleLaunch} />);

      const launchBtn = screen.getByRole("button", { name: /Launch Workspace/i });
      fireEvent.click(launchBtn);

      expect(handleLaunch).toHaveBeenCalledWith("us-east-1");
    });
  });

  describe("DomainCollisionCard (REG-004)", () => {
    it("renders collision detection and sso button", () => {
      render(<DomainCollisionCard organizationName="Acme Global Inc." />);

      expect(
        screen.getByRole("heading", { name: "Acme Global Inc. is on UniERP" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Sign in with Corporate SSO \(Okta\)/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /Request Access from Workspace Administrator/i,
        })
      ).toBeInTheDocument();
    });

    it("has zero accessibility violations", async () => {
      const { container } = render(
        <DomainCollisionCard organizationName="Acme Global Inc." />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Orchestrated OnboardingWizard", () => {
    it("advances step by step through the registration flow", () => {
      render(
        <OnboardingWizard
          registrationProps={{
            initialOrgName: "Acme Global Inc.",
            initialFirstName: "Kannan",
            initialLastName: "Rajagopal",
            initialEmail: "kannan@acme-global.com",
          }}
        />
      );

      // Step 1: Registration
      expect(screen.getByRole("heading", { name: "Create your workspace" })).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText(/Master Encryption Password/i), {
        target: { value: "SecretPassword123!" },
      });
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByRole("button", { name: /Create Workspace/i }));

      // Step 2: Email verification
      expect(screen.getByRole("heading", { name: "Verify your work email" })).toBeInTheDocument();
      for (let i = 1; i <= 6; i++) {
        const input = screen.getByLabelText(`Digit ${i} of verification code`);
        fireEvent.change(input, { target: { value: `${i}` } });
      }
      fireEvent.click(screen.getByRole("button", { name: /Verify & Continue/i }));

      // Step 3: Sovereign Cloud Provisioning
      expect(screen.getByRole("heading", { name: "Your workspace is ready" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Launch Workspace/i })).toBeInTheDocument();
    });
  });
});
