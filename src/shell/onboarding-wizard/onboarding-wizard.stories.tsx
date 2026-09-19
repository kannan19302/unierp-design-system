import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  RegistrationCard,
  EmailVerificationCard,
  RegionProvisioningCard,
  DomainCollisionCard,
  OnboardingWizard,
} from "./onboarding-wizard";
import { AuthShell } from "../auth-shell";

const meta: Meta<typeof OnboardingWizard> = {
  title: "Shell/OnboardingWizard",
  component: OnboardingWizard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    currentStep: {
      control: "select",
      options: [1, 2, 3, "collision"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OnboardingWizard>;

export const InteractiveWizard: Story = {
  render: () => (
    <AuthShell
      logoText="UniERP Enterprise"
      eyebrowText="SOVEREIGN ONBOARDING"
      headline="Provision your sovereign enterprise cloud in seconds."
      subtext="Global data residency compliance with dedicated KMS keyrings across AWS, Azure, and GCP."
    >
      <OnboardingWizard />
    </AuthShell>
  ),
};

export const RegistrationStep: Story = {
  render: () => (
    <AuthShell
      logoText="UniERP Enterprise"
      eyebrowText="WORKSPACE SETUP"
      headline="Register your multi-tenant organization."
    >
      <RegistrationCard
        initialOrgName="Acme Global Inc."
        initialFirstName="Kannan"
        initialLastName="Rajagopal"
        initialEmail="kannan@acme-global.com"
      />
    </AuthShell>
  ),
};

export const EmailVerificationStep: Story = {
  render: () => (
    <AuthShell
      logoText="UniERP Enterprise"
      eyebrowText="ZERO-TRUST IDENTITY"
      headline="Verify work email with time-based security OTP."
    >
      <EmailVerificationCard email="kannan@acme-global.com" />
    </AuthShell>
  ),
};

export const RegionProvisioningStep: Story = {
  render: () => (
    <AuthShell
      logoText="UniERP Enterprise"
      eyebrowText="SOVEREIGN REGIONS"
      headline="Automated infrastructure deployment and KMS initialization."
    >
      <RegionProvisioningCard />
    </AuthShell>
  ),
};

export const DomainCollisionRouter: Story = {
  render: () => (
    <AuthShell
      logoText="UniERP Enterprise"
      eyebrowText="DOMAIN DISCOVERY"
      headline="Detected existing SSO realm for Acme Global Inc."
    >
      <DomainCollisionCard organizationName="Acme Global Inc." />
    </AuthShell>
  ),
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  render: () => (
    <AuthShell
      logoText="UniERP Enterprise"
      eyebrowText="SOVEREIGN ONBOARDING"
      headline="Provision your sovereign enterprise cloud in seconds."
      subtext="Global data residency compliance with dedicated KMS keyrings across AWS, Azure, and GCP."
    >
      <OnboardingWizard currentStep={1} />
    </AuthShell>
  ),
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Step 1: Registration Card</h4>
        <RegistrationCard
          initialOrgName="Acme Global Inc."
          initialFirstName="Kannan"
          initialLastName="Rajagopal"
          initialEmail="kannan@acme-global.com"
        />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Step 2: Email & MFA Verification</h4>
        <EmailVerificationCard email="kannan@acme-global.com" />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Step 3: Sovereign Cloud Region Selection & Provisioning</h4>
        <RegionProvisioningCard selectedRegionId="eu-central" />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Step 4: Domain Collision Alert State</h4>
        <DomainCollisionCard organizationName="Acme Global Inc." />
      </div>
    </div>
  ),
};
