"use client";

import { type FC, type ReactNode } from "react";
import styles from "./auth-shell.module.css";

export type AuthVariant =
  | "login"
  | "register"
  | "forgot-password"
  | "verify-otp"
  | "reset-password";

export interface AuthShellProps {
  /** Which authentication flow is active — drives heading & layout hints. */
  variant: AuthVariant;
  /** Brand logo rendered above the form. */
  brandLogo?: ReactNode;
  /** Tenant or organization name shown beneath the logo. */
  tenantName?: string;
  /** Illustration or brand visual for the right panel (desktop only). */
  illustration?: ReactNode;
  /** The authentication form content. */
  children: ReactNode;
  /** Legal links footer (Terms, Privacy, etc.). */
  footer?: ReactNode;
  className?: string;
}

const VARIANT_HEADINGS: Record<AuthVariant, { title: string; subtitle: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your account to continue",
  },
  register: {
    title: "Create your account",
    subtitle: "Get started with your organization",
  },
  "forgot-password": {
    title: "Reset your password",
    subtitle: "We'll send you a reset link",
  },
  "verify-otp": {
    title: "Verify your identity",
    subtitle: "Enter the code we sent you",
  },
  "reset-password": {
    title: "Set new password",
    subtitle: "Choose a strong password for your account",
  },
};

/**
 * `<AuthShell>` — Split-panel authentication layout.
 *
 * Anatomy: `[Form Panel (left)] | [Brand Illustration (right)]`
 *
 * The left panel centers the auth form on a white surface; the right
 * panel renders a brand illustration on the Strata canvas. The right
 * panel collapses below 768px for mobile-first responsiveness.
 */
export const AuthShell: FC<AuthShellProps> = ({
  variant,
  brandLogo,
  tenantName,
  illustration,
  children,
  footer,
  className = "",
}) => {
  const { title, subtitle } = VARIANT_HEADINGS[variant];

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {/* ── Form Panel ── */}
      <main className={styles.formPanel} id="unierp-main" aria-label="Authentication">
        <div className={styles.formContainer}>
          {brandLogo && <div className={styles.logo}>{brandLogo}</div>}
          {tenantName && <p className={styles.tenantName}>{tenantName}</p>}

          <h1 className={styles.heading}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.formContent}>{children}</div>
        </div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </main>

      {/* ── Illustration Panel ── */}
      {illustration && (
        <aside className={styles.illustrationPanel} aria-hidden="true">
          <div className={styles.illustrationContent}>{illustration}</div>
        </aside>
      )}
    </div>
  );
};
