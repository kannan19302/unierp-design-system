import React, { useState, useRef, useEffect } from "react";
import styles from "./onboarding-wizard.module.css";

// ============================================================================
// Types
// ============================================================================

export interface RegistrationCardProps {
  initialOrgName?: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialEmail?: string;
  onSubmitRegistration?: (data: {
    orgName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }) => void;
  onSignInClick?: () => void;
  isSubmitting?: boolean;
  error?: string;
}

export interface EmailVerificationCardProps {
  email: string;
  onChangeEmail?: () => void;
  onVerifyOtp?: (otp: string) => void;
  onResendOtp?: () => void;
  onContactAdmin?: () => void;
  expiresInSeconds?: number;
  resendCooldownSeconds?: number;
  isVerifying?: boolean;
  error?: string;
}

export interface SovereignRegion {
  id: string;
  name: string;
  flag: string;
  cloudProvider: string;
  datacenter: string;
  encryption: string;
  latency: string;
  status: "active" | "provisioning" | "maintenance";
}

export interface RegionProvisioningCardProps {
  regions?: SovereignRegion[];
  selectedRegionId?: string;
  onSelectRegion?: (regionId: string) => void;
  provisioningProgress?: number; // 0-100
  provisioningMessage?: string;
  onLaunchWorkspace?: (regionId: string) => void;
  isLaunching?: boolean;
}

export interface DomainCollisionCardProps {
  organizationName: string;
  ssoProviderName?: string;
  onSsoLogin?: () => void;
  onRequestAccess?: () => void;
  onChangeEmail?: () => void;
  isConnecting?: boolean;
}

export interface OnboardingWizardProps {
  currentStep?: 1 | 2 | 3 | "collision";
  onStepChange?: (step: 1 | 2 | 3 | "collision") => void;
  registrationProps?: RegistrationCardProps;
  verificationProps?: EmailVerificationCardProps;
  provisioningProps?: RegionProvisioningCardProps;
  collisionProps?: DomainCollisionCardProps;
  className?: string;
}

// Default Sovereign Regions matching Penpot REG-003
export const DEFAULT_SOVEREIGN_REGIONS: SovereignRegion[] = [
  {
    id: "us-east-1",
    name: "US East (N. Virginia)",
    flag: "🇺🇸",
    cloudProvider: "AWS",
    datacenter: "us-east-1",
    encryption: "Dedicated KMS Encryption",
    latency: "18ms latency",
    status: "active",
  },
  {
    id: "eu-central-1",
    name: "EU Central (Frankfurt)",
    flag: "🇪🇺",
    cloudProvider: "AWS",
    datacenter: "eu-central-1",
    encryption: "GDPR Sovereign KMS",
    latency: "24ms latency",
    status: "active",
  },
  {
    id: "ap-northeast-1",
    name: "APAC (Tokyo)",
    flag: "🇯🇵",
    cloudProvider: "AWS",
    datacenter: "ap-northeast-1",
    encryption: "APPI Data Residency KMS",
    latency: "32ms latency",
    status: "active",
  },
  {
    id: "ap-south-1",
    name: "India (Mumbai)",
    flag: "🇮🇳",
    cloudProvider: "AWS",
    datacenter: "ap-south-1",
    encryption: "DPDP Act Sovereign KMS",
    latency: "14ms latency",
    status: "active",
  },
];

// ============================================================================
// Stepper Header
// ============================================================================

interface StepperProps {
  activeStep: 1 | 2 | 3;
}

export const OnboardingStepper: React.FC<StepperProps> = ({ activeStep }) => {
  return (
    <nav className={styles.stepper} aria-label="Onboarding Progress">
      <div
        className={`${styles.stepItem} ${
          activeStep === 1
            ? styles.stepItemActive
            : activeStep > 1
            ? styles.stepItemCompleted
            : ""
        }`}
      >
        <span
          className={`${styles.stepBadge} ${
            activeStep === 1
              ? styles.stepBadgeActive
              : activeStep > 1
              ? styles.stepBadgeCompleted
              : ""
          }`}
          aria-current={activeStep === 1 ? "step" : undefined}
        >
          {activeStep > 1 ? "✓" : "1"}
        </span>
        <span>Account</span>
      </div>

      <div className={styles.stepDivider} aria-hidden="true" />

      <div
        className={`${styles.stepItem} ${
          activeStep === 2
            ? styles.stepItemActive
            : activeStep > 2
            ? styles.stepItemCompleted
            : ""
        }`}
      >
        <span
          className={`${styles.stepBadge} ${
            activeStep === 2
              ? styles.stepBadgeActive
              : activeStep > 2
              ? styles.stepBadgeCompleted
              : ""
          }`}
          aria-current={activeStep === 2 ? "step" : undefined}
        >
          {activeStep > 2 ? "✓" : "2"}
        </span>
        <span>Security</span>
      </div>

      <div className={styles.stepDivider} aria-hidden="true" />

      <div
        className={`${styles.stepItem} ${
          activeStep === 3 ? styles.stepItemActive : ""
        }`}
      >
        <span
          className={`${styles.stepBadge} ${
            activeStep === 3 ? styles.stepBadgeActive : ""
          }`}
          aria-current={activeStep === 3 ? "step" : undefined}
        >
          3
        </span>
        <span>Launch</span>
      </div>
    </nav>
  );
};

// ============================================================================
// REG-001: Workspace Registration Card
// ============================================================================

export const RegistrationCard: React.FC<RegistrationCardProps> = ({
  initialOrgName = "",
  initialFirstName = "",
  initialLastName = "",
  initialEmail = "",
  onSubmitRegistration,
  onSignInClick,
  isSubmitting = false,
  error,
}) => {
  const [orgName, setOrgName] = useState(initialOrgName);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !orgName.trim() || !email.trim() || !password) return;
    onSubmitRegistration?.({
      orgName: orgName.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      termsAccepted,
    });
  };

  return (
    <div className={styles.container}>
      <OnboardingStepper activeStep={1} />
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Create your workspace</h1>
          <p className={styles.subtitle}>
            30-day enterprise free trial &nbsp;•&nbsp; No credit card required
          </p>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              padding: "var(--space-2) var(--space-3)",
              marginBottom: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-surface-sunken)",
              border: "1px solid var(--color-status-danger)",
              color: "var(--color-status-danger)",
              fontSize: "var(--text-xs)",
            }}
          >
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-org-name" className={styles.label}>
              Organization Legal Name
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-org-name"
                name="organizationName"
                type="text"
                className={`${styles.input} ${
                  orgName.trim() ? styles.inputWithTrailing : ""
                }`}
                placeholder="Acme Global Inc."
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                disabled={isSubmitting}
              />
              {orgName.trim().length > 2 && (
                <span
                  className={`${styles.trailingIcon} ${styles.successIcon}`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </div>
          </div>

          <div className={styles.twoColRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="reg-first-name" className={styles.label}>
                First Name
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="reg-first-name"
                  name="firstName"
                  type="text"
                  className={`${styles.input} ${
                    firstName.trim() ? styles.inputWithTrailing : ""
                  }`}
                  placeholder="Kannan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {firstName.trim() && (
                  <span
                    className={`${styles.trailingIcon} ${styles.successIcon}`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="reg-last-name" className={styles.label}>
                Last Name
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="reg-last-name"
                  name="lastName"
                  type="text"
                  className={`${styles.input} ${
                    lastName.trim() ? styles.inputWithTrailing : ""
                  }`}
                  placeholder="Rajagopal"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {lastName.trim() && (
                  <span
                    className={`${styles.trailingIcon} ${styles.successIcon}`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-email" className={styles.label}>
              Corporate Work Email
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-email"
                name="email"
                type="email"
                className={`${styles.input} ${
                  email.includes("@") ? styles.inputWithTrailing : ""
                }`}
                placeholder="kannan@acme-global.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              {email.includes("@") && email.includes(".") && (
                <span
                  className={`${styles.trailingIcon} ${styles.successIcon}`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-password" className={styles.label}>
              Master Encryption Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.input} ${styles.inputWithTrailing}`}
                placeholder="••••••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.trailingIcon}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={isSubmitting}
              required
            />
            <span>
              I agree to the{" "}
              <span className={styles.termsLink}>Terms of Service</span> and{" "}
              <span className={styles.termsLink}>Privacy Policy</span>.
            </span>
          </label>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={
              isSubmitting ||
              !termsAccepted ||
              !orgName.trim() ||
              !email.trim() ||
              !password
            }
          >
            {isSubmitting ? "Creating..." : "Create Workspace →"}
          </button>
        </form>

        <div className={styles.footerText}>
          Already have an account?{" "}
          <button
            type="button"
            className={styles.footerLink}
            onClick={onSignInClick}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REG-002: Work Email Verification OTP Card
// ============================================================================

export const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
  email,
  onChangeEmail,
  onVerifyOtp,
  onResendOtp,
  onContactAdmin,
  expiresInSeconds = 582, // 09:42 default
  resendCooldownSeconds = 42,
  isVerifying = false,
  error,
}) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(expiresInSeconds);
  const [cooldown, setCooldown] = useState(resendCooldownSeconds);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChangeDigit = (index: number, value: string) => {
    const char = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      const newDigits = paste.split("");
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const fullOtp = digits.join("");
  const isComplete = fullOtp.length === 6 && digits.every((d) => d !== "");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onVerifyOtp?.(fullOtp);
    }
  };

  return (
    <div className={styles.container}>
      <OnboardingStepper activeStep={2} />
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Verify your work email</h1>
          <p className={styles.subtitle}>
            Code sent to <strong>{email}</strong>{" "}
            {onChangeEmail && (
              <button
                type="button"
                className={styles.footerLink}
                onClick={onChangeEmail}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                (Change)
              </button>
            )}
          </p>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              padding: "var(--space-2) var(--space-3)",
              marginBottom: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-surface-sunken)",
              border: "1px solid var(--color-status-danger)",
              color: "var(--color-status-danger)",
              fontSize: "var(--text-xs)",
            }}
          >
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleVerify}>
          <div className={styles.otpRow} onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleChangeDigit(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isVerifying}
                aria-label={`Digit ${idx + 1} of verification code`}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <div className={styles.timerNotice}>
            <span>⏱️ Code expires in</span>
            <span className={styles.timerHighlight}>{formatTime(timeLeft)}</span>
            <span>&nbsp;•&nbsp;</span>
            {cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                className={styles.footerLink}
                onClick={() => {
                  setCooldown(resendCooldownSeconds);
                  onResendOtp?.();
                }}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                Resend Code
              </button>
            )}
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isVerifying || !isComplete}
          >
            {isVerifying ? "Verifying..." : "Verify & Continue →"}
          </button>
        </form>

        <div className={styles.footerText}>
          Didn&apos;t receive code?{" "}
          <button
            type="button"
            className={styles.footerLink}
            onClick={onContactAdmin}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            Contact Administrator ↗
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REG-003: Sovereign Cloud Region & Live Provisioning Card
// ============================================================================

export const RegionProvisioningCard: React.FC<RegionProvisioningCardProps> = ({
  regions = DEFAULT_SOVEREIGN_REGIONS,
  selectedRegionId = "us-east-1",
  onSelectRegion,
  provisioningProgress = 100,
  provisioningMessage = "Provisioning complete. Sovereign KMS Keyrings active.",
  onLaunchWorkspace,
  isLaunching = false,
}) => {
  const [selected, setSelected] = useState(selectedRegionId);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelectRegion?.(id);
  };

  const activeRegion = regions.find((r) => r.id === selected) || regions[0];

  return (
    <div className={styles.wideContainer}>
      <OnboardingStepper activeStep={3} />
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your workspace is ready</h1>
          <p className={styles.subtitle}>
            Configured in your nearest sovereign tenancy region
          </p>
        </header>

        {/* Live Provisioning Status Banner */}
        <div className={styles.provisioningStatus}>
          <div className={styles.provisioningHeader}>
            <span>Deployment Pipeline</span>
            <span>{provisioningProgress}%</span>
          </div>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-label="Provisioning Progress"
            aria-valuenow={provisioningProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${provisioningProgress}%` }}
            />
          </div>
          <span style={{ fontSize: "var(--text-2xs)", color: "var(--color-text-muted)" }}>
            {provisioningMessage}
          </span>
        </div>

        {/* Region Selector Grid */}
        <div
          className={styles.regionGrid}
          role="radiogroup"
          aria-label="Sovereign Tenancy Regions"
        >
          {regions.map((region) => {
            const isChecked = region.id === selected;
            return (
              <div
                key={region.id}
                role="radio"
                aria-checked={isChecked}
                tabIndex={0}
                className={`${styles.regionCard} ${
                  isChecked ? styles.regionCardSelected : ""
                }`}
                onClick={() => handleSelect(region.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(region.id);
                  }
                }}
              >
                <span className={styles.regionFlag} aria-hidden="true">
                  {region.flag}
                </span>
                <div className={styles.regionInfo}>
                  <div className={styles.regionNameRow}>
                    <span className={styles.regionName}>{region.name}</span>
                    <span className={styles.regionBadge}>
                      ● {region.status === "active" ? "Active" : "Ready"}
                    </span>
                  </div>
                  <span className={styles.regionDetails}>
                    {region.cloudProvider} {region.datacenter} &nbsp;•&nbsp;{" "}
                    {region.encryption} &nbsp;•&nbsp; {region.latency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          disabled={isLaunching || provisioningProgress < 100 || !activeRegion}
          onClick={() => activeRegion && onLaunchWorkspace?.(activeRegion.id)}
        >
          {isLaunching ? "Launching..." : "Launch Workspace →"}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// REG-004: Domain Collision Router Card
// ============================================================================

export const DomainCollisionCard: React.FC<DomainCollisionCardProps> = ({
  organizationName,
  ssoProviderName = "Okta",
  onSsoLogin,
  onRequestAccess,
  onChangeEmail,
  isConnecting = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{organizationName} is on UniERP</h1>
          <p className={styles.subtitle}>
            Your organization has single sign-on (SSO) configured
          </p>
        </header>

        <div className={styles.form}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onSsoLogin}
            disabled={isConnecting}
          >
            {isConnecting
              ? "Connecting..."
              : `Sign in with Corporate SSO (${ssoProviderName}) →`}
          </button>

          <div className={styles.collisionDivider}>or</div>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onRequestAccess}
            disabled={isConnecting}
          >
            Request Access from Workspace Administrator
          </button>
        </div>

        <div className={styles.footerText}>
          Not part of {organizationName}?{" "}
          <button
            type="button"
            className={styles.footerLink}
            onClick={onChangeEmail}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            Use a different email ↗
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Orchestrated Onboarding Wizard
// ============================================================================

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentStep = 1,
  onStepChange,
  registrationProps,
  verificationProps,
  provisioningProps,
  collisionProps,
  className,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | "collision">(currentStep);

  const handleStepAdvance = (next: 1 | 2 | 3 | "collision") => {
    setStep(next);
    onStepChange?.(next);
  };

  return (
    <div className={className} data-density="compact">
      {step === 1 && (
        <RegistrationCard
          {...registrationProps}
          onSubmitRegistration={(data) => {
            registrationProps?.onSubmitRegistration?.(data);
            handleStepAdvance(2);
          }}
        />
      )}

      {step === 2 && (
        <EmailVerificationCard
          email={
            verificationProps?.email ||
            registrationProps?.initialEmail ||
            "kannan@acme-global.com"
          }
          {...verificationProps}
          onChangeEmail={() => {
            verificationProps?.onChangeEmail?.();
            handleStepAdvance(1);
          }}
          onVerifyOtp={(otp) => {
            verificationProps?.onVerifyOtp?.(otp);
            handleStepAdvance(3);
          }}
        />
      )}

      {step === 3 && (
        <RegionProvisioningCard
          {...provisioningProps}
          onLaunchWorkspace={(regionId) => {
            provisioningProps?.onLaunchWorkspace?.(regionId);
          }}
        />
      )}

      {step === "collision" && (
        <DomainCollisionCard
          organizationName={
            collisionProps?.organizationName ||
            registrationProps?.initialOrgName ||
            "Acme Global Inc."
          }
          {...collisionProps}
          onChangeEmail={() => {
            collisionProps?.onChangeEmail?.();
            handleStepAdvance(1);
          }}
        />
      )}
    </div>
  );
};
