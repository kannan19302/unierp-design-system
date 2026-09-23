import type { Meta, StoryObj } from "@storybook/react";
import {
  SignInCard,
  MfaChallengeCard,
  SsoDiscoveryCard,
  PasswordRecoveryCard,
  ResetPasswordCard,
  SessionLockoutCard,
  RecoveryCodesCard,
} from "./auth-cards";

const meta: Meta<typeof SignInCard> = {
  title: "Platforms/Identity/AuthCards",
  component: SignInCard,
  parameters: {
    layout: "centered",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

export const SignIn: StoryObj<typeof SignInCard> = {
  render: () => (
    <SignInCard
      onForgotPassword={() => alert("Forgot password clicked")}
      onSsoSelect={(p) => alert(`SSO provider: ${p}`)}
      onRegisterClick={() => alert("Register clicked")}
    />
  ),
};

export const MfaChallenge: StoryObj<typeof MfaChallengeCard> = {
  render: () => (
    <MfaChallengeCard
      email="kannan@acme-global.com"
      onUsePasskey={() => alert("Passkey biometric prompt")}
      onUseRecoveryCode={() => alert("Recovery code prompt")}
    />
  ),
};

export const SsoDiscovery: StoryObj<typeof SsoDiscoveryCard> = {
  render: () => (
    <SsoDiscoveryCard
      onBackToPassword={() => alert("Back to password")}
      onDiscover={(email) => alert(`Discovered realm for: ${email}`)}
    />
  ),
};

export const PasswordRecovery: StoryObj<typeof PasswordRecoveryCard> = {
  render: () => (
    <PasswordRecoveryCard
      onBackToSignIn={() => alert("Back to sign in")}
      onSubmit={(email) => alert(`Recovery link dispatched to: ${email}`)}
    />
  ),
};

export const ResetPassword: StoryObj<typeof ResetPasswordCard> = {
  render: () => (
    <ResetPasswordCard onSubmit={(pwd) => alert(`Password updated!`)} />
  ),
};

export const SessionLockout: StoryObj<typeof SessionLockoutCard> = {
  render: () => (
    <SessionLockoutCard
      user={{
        name: "Kannan Rajagopal",
        email: "kannan@acme-global.com",
        role: "Financial Controller",
      }}
      onUnlock={(pwd) => alert("Unlocked")}
      onSwitchAccount={() => alert("Switch account")}
    />
  ),
};

export const RecoveryCodes: StoryObj<typeof RecoveryCodesCard> = {
  render: () => (
    <RecoveryCodesCard
      codes={[
        "E5V4-G1L7",
        "8K9M-2P4Q",
        "J3N6-7T1X",
        "A9C2-D4F8",
        "H5J7-K1L3",
        "M8P0-Q2R4",
        "S6T8-U0V2",
        "W4X6-Y8Z0",
      ]}
      onConfirmStored={() => alert("Confirmed and saved!")}
    />
  ),
};

export const AnatomyAndComposition: StoryObj<typeof SignInCard> = {
  name: "Anatomy & Composition",
  render: () => (
    <SignInCard
      defaultEmail="admin@acme-corp.com"
      onForgotPassword={() => {}}
      onSsoSelect={() => {}}
    />
  ),
};

export const AllStatesGallery: StoryObj<typeof SignInCard> = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>1. Sign In Card</h4>
        <SignInCard defaultEmail="admin@acme-corp.com" />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>2. MFA Challenge Card</h4>
        <MfaChallengeCard email="admin@acme-corp.com" />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>3. SSO Discovery Card</h4>
        <SsoDiscoveryCard />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>4. Session Lockout Card</h4>
        <SessionLockoutCard
          user={{
            name: "Kannan Rajagopal",
            email: "kannan@acme-global.com",
            role: "Financial Controller",
          }}
        />
      </div>
    </div>
  ),
};

