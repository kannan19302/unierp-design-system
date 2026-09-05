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
  parameters: {
    layout: "fullscreen",
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
