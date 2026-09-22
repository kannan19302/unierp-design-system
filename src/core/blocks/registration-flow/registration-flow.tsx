import React, { useState, useRef, useEffect } from "react";
import styles from "./registration-flow.module.css";
import { Logo } from "../../brand/logo/logo";

export type RegistrationStep = 1 | 2 | 3 | 4;

export interface ProvisioningLog {
  timestamp: string;
  level: "info" | "success" | "warn";
  message: string;
}

export interface RegistrationFlowProps {
  /** Current step in the registration wizard (1: Account, 2: OTP, 3: Provisioning, 4: Collision) */
  step?: RegistrationStep;
  /** Pre-filled email address */
  initialEmail?: string;
  /** Pre-filled legal name */
  initialName?: string;
  /** Pre-filled organization name */
  initialOrgName?: string;
  /** Pre-filled subdomain */
  initialSubdomain?: string;
  /** Pre-filled cloud region */
  initialRegion?: string;
  /** Organization name in domain collision scenario */
  collisionOrgName?: string;
  /** SSO Identity Provider name in collision scenario (e.g. Okta, Azure AD) */
  collisionIdpName?: string;
  /** Matched corporate domain */
  collisionDomain?: string;
  /** Provisioning progress percentage (0 - 100) */
  provisioningProgress?: number;
  /** Terminal stream logs */
  provisioningLogs?: ProvisioningLog[];
  /** Callback on Step 1 form submission */
  onSubmitStep1?: (data: {
    email: string;
    name: string;
    orgName: string;
    subdomain: string;
    region: string;
    password: string;
  }) => void;
  /** Callback on OTP verification */
  onVerifyOtp?: (otp: string) => void;
  /** Callback on OTP resend request */
  onResendOtp?: () => void;
  /** Callback when user changes email from OTP step */
  onChangeEmail?: () => void;
  /** Callback when provisioning completes and user clicks Launch */
  onLaunchWorkspace?: () => void;
  /** Callback when clicking SSO redirect in collision step */
  onSsoRedirect?: () => void;
  /** Callback when requesting access in collision step */
  onRequestAccess?: () => void;
  /** Navigation to sign in */
  onNavigateLogin?: () => void;
}

const DEFAULT_LOGS: ProvisioningLog[] = [
  { timestamp: "00:01.102", level: "info", message: "Allocated dedicated KMS envelope key ARN: arn:aws:kms:eu-central-1:vault-partition" },
  { timestamp: "00:01.455", level: "info", message: "Initializing PostgreSQL multi-tenant schema with strict RLS policies" },
  { timestamp: "00:02.118", level: "info", message: "Migrating enterprise tables: core, finance, sales, hr, inventory (142 migrations)" },
  { timestamp: "00:02.890", level: "success", message: "Created root tenant partition security principal & assigned SUPER_ADMIN RBAC" },
  { timestamp: "00:03.420", level: "info", message: "Generating mTLS client certificates & OIDC provider registration" },
  { timestamp: "00:04.105", level: "success", message: "Configured Anycast DNS route and edge SSL termination certificates" },
];

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  step: controlledStep,
  initialEmail = "",
  initialName = "",
  initialOrgName = "",
  initialSubdomain = "",
  initialRegion = "eu-central-1",
  collisionOrgName = "Acme Global Technologies",
  collisionIdpName = "Okta SSO",
  collisionDomain = "company.com",
  provisioningProgress = 78,
  provisioningLogs = DEFAULT_LOGS,
  onSubmitStep1,
  onVerifyOtp,
  onResendOtp,
  onChangeEmail,
  onLaunchWorkspace,
  onSsoRedirect,
  onRequestAccess,
  onNavigateLogin,
}) => {
  const [internalStep, setInternalStep] = useState<RegistrationStep>(controlledStep || 1);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  // Step 1 state
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [orgName, setOrgName] = useState(initialOrgName);
  const [subdomain, setSubdomain] = useState(initialSubdomain);
  const [region, setRegion] = useState(initialRegion);
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Auto-generate subdomain from organization name if blank
  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOrgName(val);
    if (!subdomain || subdomain === orgName.toLowerCase().replace(/[^a-z0-9]/g, "")) {
      setSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 32));
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string } => {
    if (!pass) return { score: 0, label: "" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12 && /[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak (minimum 12 characters recommended)" };
      case 2:
        return { score: 2, label: "Fair (add mixed case and numbers)" };
      case 3:
        return { score: 3, label: "Good (meets standard requirements)" };
      case 4:
        return { score: 4, label: "Strong (enterprise sovereign compliant)" };
      default:
        return { score: 0, label: "" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !orgName || !password || !agreeTerms) return;

    if (onSubmitStep1) {
      onSubmitStep1({ email, name, orgName, subdomain, region, password });
    } else {
      setInternalStep(2);
    }
  };

  // Step 2 OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(45);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (currentStep === 2 && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentStep, resendTimer]);

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      if (onVerifyOtp) {
        onVerifyOtp(fullOtp);
      } else {
        setInternalStep(3);
      }
    }
  };

  return (
    <div className={styles.canvas} data-testid="registration-flow-root">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logoGlyph}>
            <Logo size="md" />
          </div>
          <div className={styles.badge}>
            <span role="img" aria-label="shield">🛡️</span> UniERP Sovereign Cloud Provisioning
          </div>
          <h1 className={styles.title}>
            {currentStep === 1 && "Start Your Sovereign UniERP Cloud"}
            {currentStep === 2 && "Verify Your Identity"}
            {currentStep === 3 && "Provisioning Sovereign Partition"}
            {currentStep === 4 && "Organization Already Registered"}
          </h1>
          <p className={styles.subtitle}>
            {currentStep === 1 && "Set up your tenant partition with local data residency & dedicated cryptographic boundaries."}
            {currentStep === 2 && `Enter the 6-digit cryptographic verification code sent to ${email || "your work email"}.`}
            {currentStep === 3 && "Deploying enterprise database shards, tenant schema, and KMS cryptographic boundaries."}
            {currentStep === 4 && `Your email domain @${collisionDomain} belongs to an existing enterprise workspace.`}
          </p>
        </header>

        {/* Stepper Progress Bar */}
        <nav className={styles.stepper} aria-label="Onboarding Progress">
          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                currentStep === 1
                  ? styles.stepCircleActive
                  : currentStep > 1
                  ? styles.stepCircleCompleted
                  : ""
              }`}
            >
              {currentStep > 1 ? "✓" : "1"}
            </div>
            <span
              className={`${styles.stepLabel} ${
                currentStep === 1 ? styles.stepLabelActive : ""
              }`}
            >
              Account
            </span>
          </div>

          <div
            className={`${styles.stepLine} ${
              currentStep > 1 ? styles.stepLineCompleted : ""
            }`}
          />

          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                currentStep === 2
                  ? styles.stepCircleActive
                  : currentStep > 2
                  ? styles.stepCircleCompleted
                  : ""
              }`}
            >
              {currentStep > 2 ? "✓" : "2"}
            </div>
            <span
              className={`${styles.stepLabel} ${
                currentStep === 2 ? styles.stepLabelActive : ""
              }`}
            >
              Verify
            </span>
          </div>

          <div
            className={`${styles.stepLine} ${
              currentStep > 2 ? styles.stepLineCompleted : ""
            }`}
          />

          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                currentStep === 3
                  ? styles.stepCircleActive
                  : currentStep > 3
                  ? styles.stepCircleCompleted
                  : ""
              }`}
            >
              {currentStep > 3 ? "✓" : "3"}
            </div>
            <span
              className={`${styles.stepLabel} ${
                currentStep === 3 ? styles.stepLabelActive : ""
              }`}
            >
              Provision
            </span>
          </div>

          <div
            className={`${styles.stepLine} ${
              currentStep === 4 ? styles.stepLineCompleted : ""
            }`}
          />

          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                currentStep === 4 ? styles.stepCircleActive : ""
              }`}
            >
              4
            </div>
            <span
              className={`${styles.stepLabel} ${
                currentStep === 4 ? styles.stepLabelActive : ""
              }`}
            >
              Launch
            </span>
          </div>
        </nav>

        {/* ── STEP 1: Account & Org Details (REG-001) ── */}
        {currentStep === 1 && (
          <form className={styles.form} onSubmit={handleStep1Submit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="reg-email" className={styles.label}>
                  Work Email Address
                </label>
                <input
                  id="reg-email"
                  data-testid="reg-email"
                  type="email"
                  className={styles.input}
                  placeholder="alex.chen@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className={styles.helperText}>Use your official corporate domain</span>
              </div>

              <div className={styles.field}>
                <label htmlFor="reg-name" className={styles.label}>
                  Full Legal Name
                </label>
                <input
                  id="reg-name"
                  data-testid="reg-name"
                  type="text"
                  className={styles.input}
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="reg-org" className={styles.label}>
                  Organization Legal Name
                </label>
                <input
                  id="reg-org"
                  data-testid="reg-org"
                  type="text"
                  className={styles.input}
                  placeholder="Acme Global Technologies Inc."
                  value={orgName}
                  onChange={handleOrgChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="reg-subdomain" className={styles.label}>
                  Workspace Subdomain
                </label>
                <div className={styles.subdomainInputGroup}>
                  <input
                    id="reg-subdomain"
                    data-testid="reg-subdomain"
                    type="text"
                    className={styles.subdomainInput}
                    placeholder="acme"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    required
                  />
                  <span className={styles.subdomainSuffix}>.unierp.cloud</span>
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="reg-region" className={styles.label}>
                Cloud Region & Sovereign Data Residency
              </label>
              <select
                id="reg-region"
                data-testid="reg-region"
                className={styles.select}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="eu-central-1">Europe Central (Frankfurt) — GDPR & ISO 27001 Sovereign Vault</option>
                <option value="us-east-1">US East (N. Virginia) — FedRAMP Ready & SOC 2 Type II</option>
                <option value="ap-south-1">Asia Pacific (Mumbai) — MeitY / DPDP Act Compliant</option>
                <option value="uk-south-1">United Kingdom (London) — Crown Commercial & Cyber Essentials Plus</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="reg-password" className={styles.label}>
                Root Administrator Password
              </label>
              <input
                id="reg-password"
                data-testid="reg-password"
                type="password"
                className={styles.input}
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <div className={styles.strengthMeter}>
                  <div className={styles.strengthBars}>
                    <div
                      className={`${styles.strengthBar} ${
                        strength.score >= 1 ? styles.strengthBarActiveWeak : ""
                      }`}
                    />
                    <div
                      className={`${styles.strengthBar} ${
                        strength.score >= 2 ? styles.strengthBarActiveFair : ""
                      }`}
                    />
                    <div
                      className={`${styles.strengthBar} ${
                        strength.score >= 3 ? styles.strengthBarActiveGood : ""
                      }`}
                    />
                    <div
                      className={`${styles.strengthBar} ${
                        strength.score >= 4 ? styles.strengthBarActiveStrong : ""
                      }`}
                    />
                  </div>
                  <span className={styles.strengthLabel}>{strength.label}</span>
                </div>
              )}
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                data-testid="reg-terms"
                className={styles.checkboxInput}
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <span className={styles.checkboxText}>
                I agree to the <a href="/terms" className={styles.link}>Master Subscription Agreement</a>,{" "}
                <a href="/privacy" className={styles.link}>Privacy Policy</a>, and Data Processing Addendum.
              </span>
            </label>

            <button
              type="submit"
              data-testid="reg-btn-step1"
              className={styles.submitButton}
              disabled={!email || !orgName || !password || !agreeTerms}
            >
              Continue to Verification →
            </button>

            {/* Feature Trust Pillars */}
            <div className={styles.securityPillars}>
              <div className={styles.pillarCard}>
                <svg className={styles.pillarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <div className={styles.pillarTitle}>HSM Level 3 Cryptography</div>
                  <div className={styles.pillarDescription}>Dedicated tenant envelope keys. Zero provider key escrow.</div>
                </div>
              </div>
              <div className={styles.pillarCard}>
                <svg className={styles.pillarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <div>
                  <div className={styles.pillarTitle}>PostgreSQL RLS Sharding</div>
                  <div className={styles.pillarDescription}>Physical schema and row-level tenant boundary isolation.</div>
                </div>
              </div>
              <div className={styles.pillarCard}>
                <svg className={styles.pillarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <div className={styles.pillarTitle}>Sovereign Data Residency</div>
                  <div className={styles.pillarDescription}>Strict in-region execution. No cross-border telemetry replication.</div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP 2: Identity & OTP Verification (REG-002) ── */}
        {currentStep === 2 && (
          <form className={styles.otpCard} onSubmit={handleVerifySubmit}>
            <div className={styles.otpGrid} role="group" aria-label="6-digit verification code">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  data-testid={`otp-digit-${idx}`}
                  type="text"
                  maxLength={1}
                  className={styles.otpSlot}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  aria-label={`Digit ${idx + 1}`}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div className={styles.resendRow}>
              <span>Didn't receive the verification code?</span>
              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  className={styles.resendBtn}
                  onClick={() => {
                    setResendTimer(45);
                    onResendOtp?.();
                  }}
                >
                  Resend code now
                </button>
              )}
            </div>

            <div className={styles.otpNotice}>
              Code expires in 10 minutes. For enterprise self-enrollment, check your spam filter or corporate email quarantine.
            </div>

            <button
              type="submit"
              data-testid="reg-btn-verify"
              className={styles.submitButton}
              disabled={otp.join("").length < 6}
            >
              Confirm Identity & Provision Cloud →
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                if (onChangeEmail) onChangeEmail();
                else setInternalStep(1);
              }}
            >
              ← Change email address ({email})
            </button>
          </form>
        )}

        {/* ── STEP 3: Sovereign Provisioning Engine (REG-003) ── */}
        {currentStep === 3 && (
          <div className={styles.provisioningCard}>
            <div className={styles.progressMeterWrapper}>
              <div className={styles.progressRingContainer}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="var(--color-brand)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - provisioningProgress / 100)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span className={styles.progressValueText}>{provisioningProgress}%</span>
                  <span className={styles.progressSublabel}>STATUS</span>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className={styles.checklist}>
              <div
                className={`${styles.checklistItem} ${
                  provisioningProgress >= 20 ? styles.checklistItemActive : styles.checklistItemPending
                }`}
              >
                <span>Initializing Tenant Vault & Envelope Encryption Keys</span>
                <span className={styles.checklistStatus}>
                  {provisioningProgress >= 20 ? (
                    <span className={styles.statusCompleted}>✓ Done</span>
                  ) : (
                    <span className={styles.statusActive}>⟳ Provisioning</span>
                  )}
                </span>
              </div>

              <div
                className={`${styles.checklistItem} ${
                  provisioningProgress >= 45 ? styles.checklistItemActive : styles.checklistItemPending
                }`}
              >
                <span>Allocating Isolated PostgreSQL RLS Partition & Schema Migrations</span>
                <span className={styles.checklistStatus}>
                  {provisioningProgress >= 45 ? (
                    <span className={styles.statusCompleted}>✓ Done</span>
                  ) : provisioningProgress >= 20 ? (
                    <span className={styles.statusActive}>⟳ Migrating</span>
                  ) : (
                    <span className={styles.statusPending}>Pending</span>
                  )}
                </span>
              </div>

              <div
                className={`${styles.checklistItem} ${
                  provisioningProgress >= 75 ? styles.checklistItemActive : styles.checklistItemPending
                }`}
              >
                <span>Generating Root OIDC Provider Client Credentials & mTLS Certs</span>
                <span className={styles.checklistStatus}>
                  {provisioningProgress >= 75 ? (
                    <span className={styles.statusCompleted}>✓ Done</span>
                  ) : provisioningProgress >= 45 ? (
                    <span className={styles.statusActive}>⟳ Registering</span>
                  ) : (
                    <span className={styles.statusPending}>Pending</span>
                  )}
                </span>
              </div>

              <div
                className={`${styles.checklistItem} ${
                  provisioningProgress >= 90 ? styles.checklistItemActive : styles.checklistItemPending
                }`}
              >
                <span>Registering Admin Security Principal & Seeding RBAC Matrix</span>
                <span className={styles.checklistStatus}>
                  {provisioningProgress >= 90 ? (
                    <span className={styles.statusCompleted}>✓ Done</span>
                  ) : provisioningProgress >= 75 ? (
                    <span className={styles.statusActive}>⟳ Seeding</span>
                  ) : (
                    <span className={styles.statusPending}>Pending</span>
                  )}
                </span>
              </div>

              <div
                className={`${styles.checklistItem} ${
                  provisioningProgress === 100 ? styles.checklistItemActive : styles.checklistItemPending
                }`}
              >
                <span>Deploying Edge CDN Route & Anycast DNS Provisioning</span>
                <span className={styles.checklistStatus}>
                  {provisioningProgress === 100 ? (
                    <span className={styles.statusCompleted}>✓ Live</span>
                  ) : provisioningProgress >= 90 ? (
                    <span className={styles.statusActive}>⟳ Routing</span>
                  ) : (
                    <span className={styles.statusPending}>Pending</span>
                  )}
                </span>
              </div>
            </div>

            {/* Real-time terminal log viewer */}
            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalLights}>
                  <div className={styles.terminalDot} />
                  <div className={styles.terminalDot} />
                  <div className={styles.terminalDot} />
                </div>
                <span>provisioning-orchestrator.log</span>
                <span>SOVEREIGN CLOUD</span>
              </div>
              <div className={styles.terminalLogs}>
                {provisioningLogs.map((log, index) => (
                  <div key={index} className={styles.logLine}>
                    <span className={styles.logTime}>[{log.timestamp}]</span>
                    <span
                      className={
                        log.level === "success" ? styles.logLevelSuccess : styles.logLevelInfo
                      }
                    >
                      {log.level.toUpperCase()}
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              data-testid="reg-btn-launch"
              className={styles.submitButton}
              disabled={provisioningProgress < 100}
              onClick={onLaunchWorkspace}
            >
              {provisioningProgress < 100
                ? "Provisioning in progress..."
                : "🚀 Launch Workspace (acme.unierp.cloud)"}
            </button>
          </div>
        )}

        {/* ── STEP 4: Domain Collision & SSO Redirection (REG-004) ── */}
        {currentStep === 4 && (
          <div className={styles.collisionCard}>
            <div className={styles.collisionAlert}>
              <svg className={styles.alertIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <div className={styles.alertTitle}>Domain Controlled by Enterprise Policy</div>
                <div className={styles.alertBody}>
                  Self-service tenant creation is disabled for email domain @{collisionDomain}. Your organization has already provisioned an enterprise partition.
                </div>
              </div>
            </div>

            <div className={styles.orgSummaryBox}>
              <div className={styles.orgSummaryRow}>
                <span className={styles.orgSummaryLabel}>Organization</span>
                <span className={styles.orgSummaryValue}>{collisionOrgName}</span>
              </div>
              <div className={styles.orgSummaryRow}>
                <span className={styles.orgSummaryLabel}>Primary Workspace</span>
                <span className={styles.orgSummaryValue}>acme.unierp.cloud</span>
              </div>
              <div className={styles.orgSummaryRow}>
                <span className={styles.orgSummaryLabel}>Authentication Enforcement</span>
                <span className={styles.orgSummaryValue}>{collisionIdpName} Mandatory</span>
              </div>
              <div className={styles.orgSummaryRow}>
                <span className={styles.orgSummaryLabel}>Data Residency</span>
                <span className={styles.orgSummaryValue}>EU Central (Frankfurt)</span>
              </div>
            </div>

            <div className={styles.ssoRedirectActions}>
              <button
                type="button"
                data-testid="reg-btn-sso-redirect"
                className={styles.ssoButton}
                onClick={onSsoRedirect}
              >
                Sign In via {collisionIdpName} →
              </button>

              <button
                type="button"
                data-testid="reg-btn-request-access"
                className={styles.requestAccessButton}
                onClick={onRequestAccess}
              >
                Request Access from Workspace Administrator
              </button>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  if (onChangeEmail) onChangeEmail();
                  else setInternalStep(1);
                }}
              >
                Use a different email address
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <footer className={styles.footerLinks}>
          <span>Already have an account?</span>
          <a
            href="/login"
            className={styles.link}
            onClick={(e) => {
              if (onNavigateLogin) {
                e.preventDefault();
                onNavigateLogin();
              }
            }}
          >
            Sign in to your workspace
          </a>
        </footer>
      </div>
    </div>
  );
};
