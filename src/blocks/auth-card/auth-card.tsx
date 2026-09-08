import React, { useState, useRef, useEffect } from "react";
import styles from "./auth-card.module.css";
import { Logo } from "../../brand/logo/logo";

export type AuthCardMode =
  | "login"
  | "mfa"
  | "sso"
  | "recovery"
  | "switcher"
  | "lockout"
  | "mfa-setup"
  | "passkey-enroll"
  | "backup-codes"
  | "password-change"
  | "magic-link"
  | "suspicious-challenge"
  | "invitation"
  | "oauth-consent"
  | "device-code"
  | "suspended";

export interface WorkspaceOption {
  id: string;
  name: string;
  sub: string;
  letter: string;
  badge?: string;
  active?: boolean;
}

export interface AuthCardProps {
  /** Mode corresponding to one of the 16 IAM Penpot card states */
  mode?: AuthCardMode;
  /** Current email address displayed or prefilled */
  email?: string;
  /** User display name or role subtitle */
  userDisplayName?: string;
  /** Error message string */
  error?: string;
  /** Success message string */
  success?: string;
  /** Workspaces list for workspace switcher (IAM-005) */
  workspaces?: WorkspaceOption[];
  /** Numeric match challenge number for IAM-012 */
  challengeNumber?: number;
  /** Primary callback on form submission */
  onSubmit?: (data: Record<string, unknown>) => void;
  /** Mode switch callback */
  onSwitchMode?: (newMode: AuthCardMode) => void;
  /** Third-party OAuth trigger callback */
  onSocialSignIn?: (provider: "google" | "microsoft" | "github") => void;
  /** Hardware key / Passkey trigger callback */
  onPasskeyClick?: () => void;
  /** Class name override */
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  mode = "login",
  email = "kannan@acme-global.com",
  userDisplayName = "Kannan — Controller (Acme Global)",
  error,
  success,
  workspaces = [
    { id: "1", name: "Acme Global Corporation", sub: "Manufacturing • US-East Cell • Global Admin", letter: "A", badge: "Active ●", active: true },
    { id: "2", name: "Starlight Health Systems", sub: "Healthcare • EU-Central Cell • Auditor", letter: "S", badge: "→" },
    { id: "3", name: "Apex FinTech Holdings", sub: "Finance • AP-South Cell • Treasury Lead", letter: "A", badge: "→" },
    { id: "4", name: "Nova Logistics Global", sub: "Logistics • US-West Cell • Director", letter: "N", badge: "→" },
  ],
  challengeNumber = 74,
  onSubmit,
  onSwitchMode,
  onSocialSignIn,
  onPasskeyClick,
  className = "",
}) => {
  const [currentMode, setCurrentMode] = useState<AuthCardMode>(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [enteredEmail, setEnteredEmail] = useState(email);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [deviceCodeDigits, setDeviceCodeDigits] = useState(["W", "B", "X", "9", "4", "K", "7", "2"]);
  const [searchQuery, setSearchQuery] = useState("");

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const switchMode = (target: AuthCardMode) => {
    setCurrentMode(target);
    onSwitchMode?.(target);
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (clean.length > 1) {
      // Paste handling
      const split = clean.slice(0, 6).split("");
      const next = [...otpDigits];
      split.forEach((digit, i) => {
        if (index + i < 6) next[index + i] = digit;
      });
      setOtpDigits(next);
      const nextFocus = Math.min(index + split.length, 5);
      pinRefs.current[nextFocus]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    if (clean && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      mode: currentMode,
      email: enteredEmail,
      password: enteredPassword,
      rememberMe,
      otp: otpDigits.join(""),
      deviceCode: deviceCodeDigits.join(""),
    });
  };

  return (
    <main className={`${styles.canvas} ${className}`} id="main-content">
      <div className={styles.card} role="region" aria-label="Authentication Card">
        {/* Header with Canonical UniERP Glyph */}
        <header className={styles.header}>
          <Logo variant="glyph" size="lg" className={styles.logoGlyph} />

          {currentMode === "login" && (
            <>
              <h1 className={styles.title}>Welcome back</h1>
              <p className={styles.subtitle}>Enter your enterprise credentials to sign in to your workspace</p>
            </>
          )}

          {currentMode === "mfa" && (
            <>
              <h1 className={styles.title}>Two-step verification</h1>
              <p className={styles.subtitle}>Enter the 6-digit code from your authenticator app</p>
              <div className={styles.identityPill} aria-label="Account">{`👤 ${enteredEmail}`}</div>
            </>
          )}

          {currentMode === "sso" && (
            <>
              <h1 className={styles.title}>Enterprise Single Sign-On</h1>
              <p className={styles.subtitle}>Authenticate via your organization's identity provider</p>
            </>
          )}

          {currentMode === "recovery" && (
            <>
              <h1 className={styles.title}>Reset your password</h1>
              <p className={styles.subtitle}>Enter your enterprise email to receive an access recovery link</p>
            </>
          )}

          {currentMode === "switcher" && (
            <>
              <h1 className={styles.title}>Select a workspace</h1>
              <p className={styles.subtitle}>Choose the organization you want to work in</p>
              <div className={styles.identityPill}>{`👤 ${enteredEmail}`}</div>
            </>
          )}

          {currentMode === "lockout" && (
            <>
              <h1 className={styles.title}>Session locked</h1>
              <p className={styles.subtitle}>Locked due to 15 minutes of inactivity (FINRA Rule 4370)</p>
              <div className={styles.identityPill}>{userDisplayName}</div>
            </>
          )}

          {currentMode === "mfa-setup" && (
            <>
              <h1 className={styles.title}>Set up an authenticator</h1>
              <p className={styles.subtitle}>Scan this QR code with Google Authenticator or 1Password</p>
            </>
          )}

          {currentMode === "passkey-enroll" && (
            <>
              <h1 className={styles.title}>Set up a Passkey</h1>
              <p className={styles.subtitle}>Sign in faster and more securely with Touch ID, Windows Hello, or YubiKey</p>
            </>
          )}

          {currentMode === "backup-codes" && (
            <>
              <h1 className={styles.title}>Save backup recovery codes</h1>
              <p className={styles.subtitle}>Each one-time code can be used once if you lose your MFA device</p>
            </>
          )}

          {currentMode === "password-change" && (
            <>
              <h1 className={styles.title}>Update your password</h1>
              <p className={styles.subtitle}>Your enterprise policy requires an updated password to continue</p>
            </>
          )}

          {currentMode === "magic-link" && (
            <>
              <h1 className={styles.title}>Check your email</h1>
              <div className={styles.identityPill}>{`✉ ${enteredEmail}`}</div>
            </>
          )}

          {currentMode === "suspicious-challenge" && (
            <>
              <h1 className={styles.title}>Verify it's you</h1>
              <p className={styles.subtitle}>A sign-in attempt was detected from a new location or IP address</p>
            </>
          )}

          {currentMode === "invitation" && (
            <>
              <h1 className={styles.title}>Join Acme Global Corporation</h1>
              <p className={styles.subtitle}>Kannan invited you to collaborate as Supply Chain Analyst</p>
              <div className={styles.identityPill}>🏢 US-East Cell • Enterprise Dedicated</div>
            </>
          )}

          {currentMode === "oauth-consent" && (
            <>
              <h1 className={styles.title}>Authorize Zapier Enterprise</h1>
              <p className={styles.subtitle}>Target Realm: acme-global.unierp.cloud</p>
            </>
          )}

          {currentMode === "device-code" && (
            <>
              <h1 className={styles.title}>Device authorization</h1>
              <p className={styles.subtitle}>Enter the user code displayed in your terminal from 'unierp login'</p>
            </>
          )}

          {currentMode === "suspended" && (
            <>
              <h1 className={styles.title}>Account access suspended</h1>
              <p className={styles.subtitle}>Your account was locked by automated security policy enforcement</p>
            </>
          )}
        </header>

        {error && (
          <div className={styles.alertDanger} role="alert">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.alertWarning} role="status">
            <span>{success}</span>
          </div>
        )}

        {/* ── IAM-001: Hosted Sign-In ── */}
        {currentMode === "login" && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="auth-email">Email</label>
              <div className={styles.inputWrapper}>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`${styles.input} ${styles.inputVerified}`}
                  value={enteredEmail}
                  onChange={(e) => setEnteredEmail(e.target.value)}
                  placeholder="name@company.com"
                />
                <span className={styles.inputVerifiedBadge} aria-label="Verified enterprise domain">✓</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="auth-password">Password</label>
              <div className={styles.inputWrapper}>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={styles.input}
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className={styles.inputIconBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className={styles.utilityRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode("recovery")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Sign in
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or</span>
              <div className={styles.dividerLine} />
            </div>

            <div className={styles.socialButtonsGroup}>
              <button
                type="button"
                className={styles.btnSocial}
                onClick={() => onSocialSignIn?.("google")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285f4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" />
                  <path fill="#34a853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                  <path fill="#fbbc05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                  <path fill="#ea4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <button
                type="button"
                className={styles.btnSocial}
                onClick={() => onSocialSignIn?.("microsoft")}
              >
                <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9h-9z" />
                  <path fill="#ffb900" d="M11 11h9v9h-9z" />
                </svg>
                <span>Sign in with Microsoft</span>
              </button>

              <button
                type="button"
                className={styles.btnSocial}
                onClick={() => onSocialSignIn?.("github")}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span>Sign in with GitHub</span>
              </button>
            </div>

            <div className={styles.cardFooter}>
              <span>Don't have an account?</span>
              <button
                type="button"
                className={styles.link}
                onClick={() => onSwitchMode?.("login")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Sign up →
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-002: MFA Challenge ── */}
        {currentMode === "mfa" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.pinGrid} role="group" aria-label="Enter 6-digit verification code">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    pinRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className={styles.pinBox}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            <div className={styles.timerBar} aria-live="polite">
              <span>⏱ 24s remaining</span>
              <span>•</span>
              <button type="button" className={styles.link} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Resend code
              </button>
            </div>

            <div className={styles.utilityRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} defaultChecked />
                <span>Don't ask again on this device</span>
              </label>
              <button type="button" className={styles.link} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Lost device?
              </button>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Verify code
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or</span>
              <div className={styles.dividerLine} />
            </div>

            <div className={styles.socialButtonsGroup}>
              <button type="button" className={styles.btnSecondary} onClick={() => onPasskeyClick?.()}>
                Use Security Key or Passkey
              </button>
              <button type="button" className={styles.btnSecondary}>
                Send push notification to phone
              </button>
              <button type="button" className={styles.btnSecondary} onClick={() => switchMode("backup-codes")}>
                Use emergency recovery code
              </button>
            </div>

            <div className={styles.cardFooter}>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ← Back to sign in
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-003: Enterprise SSO Router ── */}
        {currentMode === "sso" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sso-email">Work email</label>
              <input
                id="sso-email"
                type="email"
                className={styles.input}
                value={enteredEmail}
                onChange={(e) => setEnteredEmail(e.target.value)}
              />
            </div>

            <div className={styles.timerBar}>
              <span>⏱ Redirecting to SSO in 3 seconds...</span>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Continue with SSO →
            </button>

            <div className={styles.cardFooter}>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ← Back to standard sign in
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-004: Password Recovery & Zero-Trust Reset ── */}
        {currentMode === "recovery" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.alertWarning}>
              <div className={styles.alertWarningTitle}>
                <span>⚠️ Zero-Trust Session Revocation Active</span>
              </div>
              <span>Resetting terminates all active sessions, CLI tokens, and API keys.</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="recovery-email">Work email</label>
              <input
                id="recovery-email"
                type="email"
                className={styles.input}
                value={enteredEmail}
                onChange={(e) => setEnteredEmail(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Send recovery link
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or</span>
              <div className={styles.dividerLine} />
            </div>

            <div className={styles.socialButtonsGroup}>
              <button type="button" className={styles.btnSecondary} onClick={() => onPasskeyClick?.()}>
                Use FIDO2 Hardware Security Key
              </button>
              <button type="button" className={styles.btnSecondary} onClick={() => switchMode("backup-codes")}>
                Use emergency recovery code
              </button>
              <button type="button" className={styles.btnSecondary}>
                Request Security Officer approval
              </button>
            </div>

            <div className={styles.cardFooter}>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ← Return to sign in
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-005: Workspace Switcher ── */}
        {currentMode === "switcher" && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="search"
                className={styles.input}
                placeholder="🔍 Search organizations or domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search organizations"
              />
            </div>

            <div className={styles.orgList} role="list">
              {workspaces
                .filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((ws) => (
                  <div
                    key={ws.id}
                    className={`${styles.orgCard} ${ws.active ? styles.orgCardActive : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSubmit?.({ selectedWorkspaceId: ws.id })}
                    onKeyDown={(e) => e.key === "Enter" && onSubmit?.({ selectedWorkspaceId: ws.id })}
                  >
                    <div className={styles.orgInfo}>
                      <div className={styles.orgIcon}>{ws.letter}</div>
                      <div className={styles.orgMeta}>
                        <span className={styles.orgName}>{ws.name}</span>
                        <span className={styles.orgSub}>{ws.sub}</span>
                      </div>
                    </div>
                    {ws.badge && <span className={styles.label}>{ws.badge}</span>}
                  </div>
                ))}
            </div>

            <button type="button" className={styles.btnSecondary}>
              + Join another organization with code
            </button>

            <div className={styles.cardFooter}>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ← Sign out of all accounts
              </button>
            </div>
          </div>
        )}

        {/* ── IAM-006: Session Lockout Console ── */}
        {currentMode === "lockout" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="lockout-password">Enter master password to resume session</label>
              <div className={styles.inputWrapper}>
                <input
                  id="lockout-password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={styles.input}
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className={styles.inputIconBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Unlock session
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or</span>
              <div className={styles.dividerLine} />
            </div>

            <div className={styles.socialButtonsGroup}>
              <button type="button" className={styles.btnSecondary}>
                Instant biometric unlock (Touch ID)
              </button>
              <button type="button" className={styles.btnSecondary} onClick={() => onPasskeyClick?.()}>
                Use FIDO2 Hardware Security Key
              </button>
              <button type="button" className={styles.btnSecondary}>
                Emergency SecOps break-glass console
              </button>
            </div>

            <div className={styles.cardFooter}>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ← Sign out and terminate session
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-007: MFA Setup (QR Code) ── */}
        {currentMode === "mfa-setup" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center", margin: "var(--space-2) 0" }}>
              <div style={{ padding: "var(--space-4)", background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="var(--color-text-primary)" aria-label="Authenticator QR code">
                  <rect x="10" y="10" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="8" />
                  <rect x="20" y="20" width="10" height="10" />
                  <rect x="60" y="10" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="8" />
                  <rect x="70" y="20" width="10" height="10" />
                  <rect x="10" y="60" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="8" />
                  <rect x="20" y="70" width="10" height="10" />
                  <rect x="50" y="50" width="10" height="10" />
                  <rect x="70" y="70" width="15" height="15" />
                </svg>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
              <span className={styles.identityPill}>Key: JBSW Y3DP EKHP K3PX</span>
              <button type="button" className={styles.link} style={{ background: "none", border: "none", cursor: "pointer" }}>Copy</button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ textAlign: "center" }}>Enter 6-digit verification code to confirm</label>
              <div className={styles.pinGrid}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className={styles.pinBox}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Verify and activate authenticator
            </button>

            <div className={styles.cardFooter}>
              <button type="button" className={styles.link} style={{ background: "none", border: "none", cursor: "pointer" }}>
                Can't scan QR code? View setup guide →
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-008: Passkey Enrollment ── */}
        {currentMode === "passkey-enroll" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="passkey-name">Passkey device nickname</label>
              <input
                id="passkey-name"
                type="text"
                className={styles.input}
                defaultValue="MacBook Pro Touch ID (Office)"
              />
            </div>

            <div className={styles.alertWarning}>
              <div className={styles.alertWarningTitle}>
                <span>🔒 Zero-Trust Hardware-Bound Passkey</span>
              </div>
              <span>• Phishing-resistant cryptographic credentials (FIDO2 L3)</span>
              <span>• Private key remains locked within Secure Enclave / TPM chip</span>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Create passkey with this device
            </button>
            <button type="button" className={styles.btnSecondary}>
              Enroll external YubiKey (NFC / USB)
            </button>

            <div className={styles.cardFooter}>
              <button type="button" className={styles.link} onClick={() => switchMode("login")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ← Set up later
              </button>
            </div>
          </form>
        )}

        {/* ── IAM-009: Emergency Recovery Codes ── */}
        {currentMode === "backup-codes" && (
          <div className={styles.form}>
            <div className={styles.recoveryGrid}>
              <div className={styles.recoveryCode}>A7X9 - B4K2</div>
              <div className={styles.recoveryCode}>F2N8 - P5W1</div>
              <div className={styles.recoveryCode}>C3M8 - D9P1</div>
              <div className={styles.recoveryCode}>H4T2 - Q8R6</div>
              <div className={styles.recoveryCode}>E5V4 - G1L7</div>
              <div className={styles.recoveryCode}>J9K3 - X2Y5</div>
              <div className={styles.recoveryCode}>K6Z1 - R3S8</div>
              <div className={styles.recoveryCode}>L1W7 - V4M9</div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button type="button" className={styles.btnSecondary}>📋 Copy</button>
              <button type="button" className={styles.btnSecondary}>⬇ Download</button>
            </div>

            <label className={styles.checkboxLabel} style={{ marginTop: "var(--space-2)" }}>
              <input type="checkbox" className={styles.checkbox} required defaultChecked />
              <span style={{ fontSize: "var(--text-xs)" }}>I have saved these recovery codes in a secure location</span>
            </label>

            <button type="button" className={styles.btnPrimary} onClick={() => switchMode("login")}>
              Finish and enter workspace
            </button>
          </div>
        )}

        {/* ── IAM-010: Forced Password Change ── */}
        {currentMode === "password-change" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Current / temporary password</label>
              <input type="password" className={styles.input} required placeholder="••••••••••••" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>New password</label>
              <input type="password" className={styles.input} required placeholder="••••••••••••" />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success)" }}>✓ Password strength: Strong (High Entropy)</span>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm new password</label>
              <input type="password" className={styles.input} required placeholder="••••••••••••" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              <span>✓ At least 14 characters</span>
              <span>✓ Includes upper, lowercase, and numbers</span>
              <span>✓ Includes special symbols (!@#$%^&*)</span>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Update password and sign in
            </button>
          </form>
        )}

        {/* ── IAM-011: Magic Link Dispatched ── */}
        {currentMode === "magic-link" && (
          <div className={styles.form}>
            <div className={styles.timerBar}>
              <span>⏱ This secure cryptographic link expires in 15 minutes</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              <span>1. Open the email on this device or your mobile phone</span>
              <span>2. Click 'Authorize Workspace Sign-In' to proceed</span>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button type="button" className={styles.btnSecondary}>Open Gmail ↗</button>
              <button type="button" className={styles.btnSecondary}>Open Outlook ↗</button>
            </div>
            <button type="button" className={styles.btnPrimary}>
              Resend magic link (cooldown 48s)
            </button>
            <div className={styles.cardFooter}>
              <button type="button" className={styles.link} onClick={() => switchMode("login")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ← Back to standard sign in
              </button>
            </div>
          </div>
        )}

        {/* ── IAM-012: Suspicious Challenge ── */}
        {currentMode === "suspicious-challenge" && (
          <div className={styles.form}>
            <div className={styles.alertWarning}>
              <span>📍 Location: Ashburn, VA, United States</span>
              <span>💻 Device: Safari 18.1 on macOS Sequoia</span>
              <span>🌐 IP Address: 198.51.100.24 (Cell US-EAST-1A)</span>
            </div>
            <div style={{ textAlign: "center", margin: "var(--space-4) 0" }}>
              <p style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                Enter this number into your UniERP Authenticator app:
              </p>
              <div style={{ display: "inline-block", padding: "var(--space-2) var(--space-6)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-xl)", fontSize: "var(--text-3xl, 2rem)", fontWeight: 700, color: "var(--color-primary)" }}>
                {challengeNumber}
              </div>
              <p style={{ margin: "var(--space-2) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                ⏱ Number matches expire in 60 seconds
              </p>
            </div>
            <button type="button" className={styles.btnSecondary} style={{ color: "var(--color-danger)" }}>
              Don't recognize this activity? Report and lock account →
            </button>
          </div>
        )}

        {/* ── IAM-013: Invitation Accept ── */}
        {currentMode === "invitation" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full name</label>
              <input type="text" className={styles.input} defaultValue="Sarah Jenkins" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Create work password</label>
              <input type="password" className={styles.input} required placeholder="••••••••••••" />
            </div>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} required defaultChecked />
              <span>I agree to the Enterprise Terms and Security Policies</span>
            </label>
            <button type="submit" className={styles.btnPrimary}>
              Accept invitation & create account
            </button>
          </form>
        )}

        {/* ── IAM-014: OAuth Consent ── */}
        {currentMode === "oauth-consent" && (
          <div className={styles.form}>
            <div className={styles.alertWarning}>
              <span style={{ fontWeight: 700 }}>REQUESTED RBAC PERMISSIONS</span>
              <span>✓ Read purchase orders, inventory, and line items</span>
              <span>✓ Manage webhook event subscriptions</span>
              <span>✓ View user profile, email, and company domain</span>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", margin: 0 }}>
              🔒 This app will act under your assigned role permissions until revoked.
            </p>
            <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
              <button type="button" className={styles.btnSecondary} onClick={() => switchMode("login")}>Deny access</button>
              <button type="button" className={styles.btnPrimary} onClick={() => onSubmit?.({ approved: true })}>Authorize app</button>
            </div>
          </div>
        )}

        {/* ── IAM-015: Device Code Flow ── */}
        {currentMode === "device-code" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} style={{ textAlign: "center" }}>User code</label>
              <div className={styles.pinGrid}>
                {deviceCodeDigits.map((char, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className={styles.pinBox}
                    value={char}
                    onChange={(e) => {
                      const next = [...deviceCodeDigits];
                      next[i] = e.target.value.toUpperCase();
                      setDeviceCodeDigits(next);
                    }}
                    aria-label={`Code character ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className={styles.timerBar}>
              <span>⏱ Device authorization codes expire in 10 minutes</span>
            </div>
            <button type="submit" className={styles.btnPrimary}>
              Authorize Terminal CLI
            </button>
          </form>
        )}

        {/* ── IAM-016: Account Suspended ── */}
        {currentMode === "suspended" && (
          <div className={styles.form}>
            <div className={styles.alertDanger}>
              <span style={{ fontWeight: 700 }}>🚨 Policy: SecOps Automated Threat Response</span>
              <span>• Reason: 5 consecutive failed MFA challenges or anomalous IP</span>
              <span>• Incident Ticket: SEC-2026-9481 • Cell: US-EAST-1A</span>
            </div>
            <button type="button" className={styles.btnPrimary}>
              Verify identity with YubiKey / Hardware Key
            </button>
            <button type="button" className={styles.btnSecondary}>
              Contact Enterprise IT Security Helpdesk
            </button>
            <div className={styles.cardFooter}>
              <button type="button" className={styles.link} onClick={() => switchMode("login")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ← Return to standard sign in
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Footer Hairline Rule & Links */}
      <footer className={styles.globalFooter}>
        <span>🌐 English (US) ▾</span>
        <span>© 2026 UniERP Inc. All rights reserved.</span>
        <div className={styles.legalLinks}>
          <a href="/privacy" className={styles.link}>Privacy</a>
          <span>•</span>
          <a href="/terms" className={styles.link}>Terms</a>
          <span>•</span>
          <a href="/trust" className={styles.link}>Trust Center</a>
          <span>•</span>
          <span style={{ color: "var(--color-success)" }}>Status ●</span>
        </div>
      </footer>
    </main>
  );
};
