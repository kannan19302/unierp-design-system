import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  RegistrationCard,
  EmailVerificationCard,
  RegionProvisioningCard,
  DomainCollisionCard,
  OnboardingWizard,
} from "./onboarding-wizard";

function WizardShell({
  children,
  logoText = "UniERP Enterprise",
  eyebrowText,
  headline,
  subtext,
}: {
  children: React.ReactNode;
  logoText?: string;
  eyebrowText?: string;
  headline?: string;
  subtext?: string;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-surface-sunken)", padding: "var(--space-8)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--font-size-lg)", color: "var(--color-text-primary)", marginBottom: "var(--space-4)" }}>
          {logoText}
        </div>
        {eyebrowText && (
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--color-primary-600)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-1)" }}>
            {eyebrowText}
          </div>
        )}
        {headline && (
          <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>
            {headline}
          </h2>
        )}
        {subtext && (
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
            {subtext}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

const meta: Meta<typeof OnboardingWizard> = {
  title: "Platforms/TenantAdmin/Onboarding/OnboardingWizard",
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
    <WizardShell
      logoText="UniERP Enterprise"
      eyebrowText="SOVEREIGN ONBOARDING"
      headline="Provision your sovereign enterprise cloud in seconds."
      subtext="Global data residency compliance with dedicated KMS keyrings across AWS, Azure, and GCP."
    >
      <OnboardingWizard />
    </WizardShell>
  ),
};

export const RegistrationStep: Story = {
  render: () => (
    <WizardShell
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
    </WizardShell>
  ),
};

export const EmailVerificationStep: Story = {
  render: () => (
    <WizardShell
      logoText="UniERP Enterprise"
      eyebrowText="ZERO-TRUST IDENTITY"
      headline="Verify work email with time-based security OTP."
    >
      <EmailVerificationCard email="kannan@acme-global.com" />
    </WizardShell>
  ),
};

export const RegionProvisioningStep: Story = {
  render: () => (
    <WizardShell
      logoText="UniERP Enterprise"
      eyebrowText="SOVEREIGN REGIONS"
      headline="Automated infrastructure deployment and KMS initialization."
    >
      <RegionProvisioningCard />
    </WizardShell>
  ),
};

export const DomainCollisionRouter: Story = {
  render: () => (
    <WizardShell
      logoText="UniERP Enterprise"
      eyebrowText="DOMAIN DISCOVERY"
      headline="Detected existing SSO realm for Acme Global Inc."
    >
      <DomainCollisionCard organizationName="Acme Global Inc." />
    </WizardShell>
  ),
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  render: () => (
    <WizardShell
      logoText="UniERP Enterprise"
      eyebrowText="SOVEREIGN ONBOARDING"
      headline="Provision your sovereign enterprise cloud in seconds."
      subtext="Global data residency compliance with dedicated KMS keyrings across AWS, Azure, and GCP."
    >
      <OnboardingWizard currentStep={1} />
    </WizardShell>
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
