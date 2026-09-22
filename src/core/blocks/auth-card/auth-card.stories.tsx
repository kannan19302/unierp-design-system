import type { Meta, StoryObj } from "@storybook/react";
import { AuthCard } from "./auth-card";

const meta: Meta<typeof AuthCard> = {
  title: "Blocks/AuthCard",
  component: AuthCard,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const HostedSignIn_IAM001: Story = {
  args: {
    mode: "login",
    email: "kannan@acme-global.com",
  },
};

export const MfaChallenge_IAM002: Story = {
  args: {
    mode: "mfa",
    email: "kannan@acme-global.com",
  },
};

export const EnterpriseSso_IAM003: Story = {
  args: {
    mode: "sso",
    email: "kannan@acme-global.com",
  },
};

export const PasswordRecovery_IAM004: Story = {
  args: {
    mode: "recovery",
    email: "kannan@acme-global.com",
  },
};

export const WorkspaceSwitcher_IAM005: Story = {
  args: {
    mode: "switcher",
    email: "kannan@acme-global.com",
  },
};

export const SessionLockout_IAM006: Story = {
  args: {
    mode: "lockout",
    userDisplayName: "Kannan — Controller (Acme Global)",
  },
};

export const MfaSetup_IAM007: Story = {
  args: {
    mode: "mfa-setup",
  },
};

export const PasskeyEnrollment_IAM008: Story = {
  args: {
    mode: "passkey-enroll",
  },
};

export const BackupRecoveryCodes_IAM009: Story = {
  args: {
    mode: "backup-codes",
  },
};

export const ForcedPasswordChange_IAM010: Story = {
  args: {
    mode: "password-change",
  },
};

export const MagicLinkDispatched_IAM011: Story = {
  args: {
    mode: "magic-link",
    email: "kannan@acme-global.com",
  },
};

export const SuspiciousChallenge_IAM012: Story = {
  args: {
    mode: "suspicious-challenge",
    challengeNumber: 74,
  },
};

export const InvitationAccept_IAM013: Story = {
  args: {
    mode: "invitation",
  },
};

export const OAuthConsent_IAM014: Story = {
  args: {
    mode: "oauth-consent",
  },
};

export const DeviceCode_IAM015: Story = {
  args: {
    mode: "device-code",
  },
};

export const AccountSuspended_IAM016: Story = {
  args: {
    mode: "suspended",
  },
};
