import type { Meta, StoryObj } from "@storybook/react";
import { AuthShell } from "./auth-shell";

const meta: Meta<typeof AuthShell> = {
  title: "Shell/AuthShell",
  component: AuthShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["login", "register", "forgot-password", "verify-otp", "reset-password"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthShell>;

const MockForm = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}>
      Email
      <input
        type="email"
        placeholder="you@company.com"
        style={{
          display: "block",
          width: "100%",
          marginTop: "var(--space-1)",
          padding: "var(--space-2) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-sm)",
          fontFamily: "var(--font-sans)",
          background: "var(--color-bg-elevated)",
          color: "var(--color-text)",
        }}
      />
    </label>
    <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}>
      Password
      <input
        type="password"
        placeholder="••••••••"
        style={{
          display: "block",
          width: "100%",
          marginTop: "var(--space-1)",
          padding: "var(--space-2) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-sm)",
          fontFamily: "var(--font-sans)",
          background: "var(--color-bg-elevated)",
          color: "var(--color-text)",
        }}
      />
    </label>
    <button
      type="button"
      style={{
        padding: "var(--space-2) var(--space-4)",
        background: "var(--color-primary)",
        color: "var(--on-primary, #fff)",
        border: "none",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)",
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
      }}
    >
      Sign in
    </button>
  </div>
);

const MockIllustration = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "320px",
      borderRadius: "var(--radius-xl)",
      background: "var(--color-primary-light)",
      color: "var(--color-primary)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-semibold)",
    }}
  >
    Enterprise ERP Platform
  </div>
);

export const Login: Story = {
  args: {
    variant: "login",
    tenantName: "Acme Corporation",
    children: <MockForm />,
    illustration: <MockIllustration />,
    footer: <span>© 2026 UniERP. All rights reserved.</span>,
  },
};

export const Register: Story = {
  args: {
    variant: "register",
    tenantName: "Acme Corporation",
    children: <MockForm />,
    illustration: <MockIllustration />,
  },
};

export const ForgotPassword: Story = {
  args: {
    variant: "forgot-password",
    children: <MockForm />,
  },
};

export const VerifyOTP: Story = {
  args: {
    variant: "verify-otp",
    children: <MockForm />,
  },
};

export const MobileView: Story = {
  args: {
    variant: "login",
    tenantName: "Acme Corporation",
    children: <MockForm />,
    illustration: <MockIllustration />,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
