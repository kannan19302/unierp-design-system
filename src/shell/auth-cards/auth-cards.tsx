"use client";

import React, { useState, type FC, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Building2,
  ArrowRight,
  Fingerprint,
  Copy,
  Download,
  Check,
  AlertTriangle,
} from "lucide-react";
import styles from "./auth-cards.module.css";

/* ─────────────────────────────────────────────────
   1. SignInCard (IAM-001)
   ───────────────────────────────────────────────── */
export interface SignInCardProps {
  title?: string;
  subtitle?: string;
  defaultEmail?: string;
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => void;
  onForgotPassword?: () => void;
  onSsoSelect?: (provider: "microsoft" | "google" | "saml") => void;
  onRegisterClick?: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  className?: string;
}

export const SignInCard: FC<SignInCardProps> = ({
  title = "Enterprise Sign In",
  subtitle = "Sign in with your corporate identity credentials",
  defaultEmail = "",
  onSubmit,
  onForgotPassword,
  onSsoSelect,
  onRegisterClick,
  isLoading = false,
  errorMessage,
  className = "",
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password, remember });
  };

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {errorMessage && (
        <div className={styles.alertBox} role="alert">
          <AlertTriangle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {onSsoSelect && (
        <>
          <div className={styles.ssoGroup}>
            <button
              type="button"
              className={styles.ssoButton}
              onClick={() => onSsoSelect("microsoft")}
            >
              <span>Sign in with Microsoft</span>
            </button>
            <button
              type="button"
              className={styles.ssoButton}
              onClick={() => onSsoSelect("saml")}
            >
              <Building2 size={16} />
              <span>Sign in with Enterprise SAML</span>
            </button>
          </div>
          <div className={styles.divider}>or with email</div>
        </>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="signin-email" className={styles.label}>
            Work Email
          </label>
          <input
            id="signin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className={styles.input}
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="signin-password" className={styles.label}>
              Password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                className={styles.link}
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`${styles.input} ${styles.inputWithIcon}`}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className={styles.checkbox}
          />
          <span>Remember this device for 30 days</span>
        </label>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading}
        >
          <span>{isLoading ? "Signing in..." : "Sign in to Workspace"}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {onRegisterClick && (
        <div style={{ textAlign: "center", fontSize: "var(--text-xs)" }}>
          <span style={{ color: "var(--color-text-secondary)" }}>
            Don't have a workspace?{" "}
          </span>
          <button
            type="button"
            className={styles.link}
            onClick={onRegisterClick}
          >
            Create one →
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   2. MfaChallengeCard (IAM-002)
   ───────────────────────────────────────────────── */
export interface MfaChallengeCardProps {
  email?: string;
  onSubmitOtp?: (code: string) => void;
  onUsePasskey?: () => void;
  onUseRecoveryCode?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const MfaChallengeCard: FC<MfaChallengeCardProps> = ({
  email,
  onSubmitOtp,
  onUsePasskey,
  onUseRecoveryCode,
  isLoading = false,
  className = "",
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitOtp?.(code.join(""));
  };

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>Two-Factor Authentication</h2>
        <p className={styles.subtitle}>
          {email
            ? `Enter the 6-digit security code from your authenticator app for ${email}`
            : "Enter the 6-digit code from your authenticator app"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.otpRow} role="group" aria-label="One-time passcode">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={styles.otpInput}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading || code.some((d) => !d)}
        >
          <span>{isLoading ? "Verifying..." : "Verify Code"}</span>
        </button>
      </form>

      {onUsePasskey && (
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onUsePasskey}
        >
          <Fingerprint size={16} />
          <span>Verify with FIDO2 Passkey / Touch ID</span>
        </button>
      )}

      {onUseRecoveryCode && (
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className={styles.link}
            onClick={onUseRecoveryCode}
          >
            Use emergency backup recovery code
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   3. SsoDiscoveryCard (IAM-003)
   ───────────────────────────────────────────────── */
export interface SsoDiscoveryCardProps {
  onDiscover?: (email: string) => void;
  onBackToPassword?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const SsoDiscoveryCard: FC<SsoDiscoveryCardProps> = ({
  onDiscover,
  onBackToPassword,
  isLoading = false,
  className = "",
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onDiscover?.(email);
  };

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>Enterprise Single Sign-On</h2>
        <p className={styles.subtitle}>
          Enter your organization email to automatically route to your identity provider (Okta, Azure AD, SAML 2.0).
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="sso-email" className={styles.label}>
            Enterprise Work Email
          </label>
          <input
            id="sso-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading}
        >
          <span>Continue with SSO</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {onBackToPassword && (
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className={styles.link}
            onClick={onBackToPassword}
          >
            ← Back to sign in with password
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   4. PasswordRecoveryCard (IAM-004)
   ───────────────────────────────────────────────── */
export interface PasswordRecoveryCardProps {
  onSubmit?: (email: string) => void;
  onBackToSignIn?: () => void;
  isLoading?: boolean;
  isSent?: boolean;
  className?: string;
}

export const PasswordRecoveryCard: FC<PasswordRecoveryCardProps> = ({
  onSubmit,
  onBackToSignIn,
  isLoading = false,
  isSent = false,
  className = "",
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
  };

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>Password Recovery</h2>
        <p className={styles.subtitle}>
          {isSent
            ? `Check your inbox at ${email}. We dispatched a cryptographically signed recovery link.`
            : "Enter your enterprise email to receive an access recovery link."}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="recovery-email" className={styles.label}>
              Work Email
            </label>
            <input
              id="recovery-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={styles.input}
            />
          </div>

          <div className={styles.alertBox}>
            <ShieldCheck size={16} />
            <span>⏱ This secure cryptographic link expires in 15 minutes.</span>
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isLoading}
          >
            <span>{isLoading ? "Sending..." : "Send Recovery Link"}</span>
          </button>
        </form>
      ) : (
        <div className={styles.alertBox}>
          <Check size={16} />
          <span>
            Instructions sent. If an active tenant user matches this address, you will receive an email shortly.
          </span>
        </div>
      )}

      {onBackToSignIn && (
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className={styles.link}
            onClick={onBackToSignIn}
          >
            ← Back to sign in
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   5. ResetPasswordCard (IAM-010)
   ───────────────────────────────────────────────── */
export interface ResetPasswordCardProps {
  onSubmit?: (password: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const ResetPasswordCard: FC<ResetPasswordCardProps> = ({
  onSubmit,
  isLoading = false,
  className = "",
}) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const hasLength = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const matches = password.length > 0 && password === confirm;
  const isValid = hasLength && hasUpper && hasDigit && hasSpecial && matches;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit?.(password);
  };

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>Update Password</h2>
        <p className={styles.subtitle}>
          Set a new master encryption password meeting enterprise security standards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="new-password" className={styles.label}>
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm-password" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.input}
          />
        </div>

        <ul className={styles.checklist} aria-label="Password requirements">
          <li className={`${styles.checklistItem} ${hasLength ? styles.valid : ""}`}>
            <Check size={14} />
            <span>At least 12 characters</span>
          </li>
          <li className={`${styles.checklistItem} ${hasUpper ? styles.valid : ""}`}>
            <Check size={14} />
            <span>At least one uppercase letter</span>
          </li>
          <li className={`${styles.checklistItem} ${hasDigit ? styles.valid : ""}`}>
            <Check size={14} />
            <span>At least one number</span>
          </li>
          <li className={`${styles.checklistItem} ${hasSpecial ? styles.valid : ""}`}>
            <Check size={14} />
            <span>At least one special character</span>
          </li>
          <li className={`${styles.checklistItem} ${matches ? styles.valid : ""}`}>
            <Check size={14} />
            <span>Passwords match</span>
          </li>
        </ul>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading || !isValid}
        >
          <span>{isLoading ? "Updating..." : "Update password and sign in"}</span>
        </button>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   6. SessionLockoutCard (IAM-006)
   ───────────────────────────────────────────────── */
export interface SessionLockoutCardProps {
  user: { name: string; email: string; role?: string; avatarUrl?: string };
  onUnlock?: (password: string) => void;
  onSwitchAccount?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const SessionLockoutCard: FC<SessionLockoutCardProps> = ({
  user,
  onUnlock,
  onSwitchAccount,
  isLoading = false,
  className = "",
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUnlock?.(password);
  };

  const initials = user.name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>Session Locked</h2>
        <p className={styles.subtitle}>
          Your session was locked due to inactivity. Enter your password to resume.
        </p>
      </div>

      <div className={styles.userBanner}>
        <div className={styles.userBannerAvatar} aria-hidden="true">
          {initials}
        </div>
        <div className={styles.userBannerInfo}>
          <span className={styles.userBannerName}>{user.name}</span>
          <span className={styles.userBannerRole}>
            {user.role ? `${user.role} • ` : ""}
            {user.email}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="unlock-password" className={styles.label}>
            Password or Security PIN
          </label>
          <input
            id="unlock-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••••••"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading || !password}
        >
          <Lock size={16} />
          <span>{isLoading ? "Unlocking..." : "Unlock Session"}</span>
        </button>
      </form>

      {onSwitchAccount && (
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className={styles.link}
            onClick={onSwitchAccount}
          >
            Sign in as a different user →
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   7. RecoveryCodesCard (IAM-009)
   ───────────────────────────────────────────────── */
export interface RecoveryCodesCardProps {
  codes: string[];
  onConfirmStored?: () => void;
  className?: string;
}

export const RecoveryCodesCard: FC<RecoveryCodesCardProps> = ({
  codes,
  onConfirmStored,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unierp-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>Emergency Recovery Codes</h2>
        <p className={styles.subtitle}>
          Each one-time code can be used once if you lose access to your primary MFA device.
        </p>
      </div>

      <div className={styles.codesGrid} role="list" aria-label="Backup recovery codes">
        {codes.map((code, idx) => (
          <div key={idx} className={styles.codeItem} role="listitem">
            {code}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleCopy}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? "Copied!" : "Copy All Codes"}</span>
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleDownload}
        >
          <Download size={16} />
          <span>Download .txt</span>
        </button>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className={styles.checkbox}
        />
        <span>I have saved these recovery codes in a secure password manager</span>
      </label>

      {onConfirmStored && (
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!acknowledged}
          onClick={onConfirmStored}
        >
          <span>Continue to Workspace</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};
