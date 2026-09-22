import { forwardRef, type HTMLAttributes } from "react";
import styles from "./session-expiry-modal.module.css";

export interface SessionExpiryModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  remainingSeconds?: number;
  onExtendSession?: () => void;
  onSignOut?: () => void;
}

export const SessionExpiryModal = forwardRef<HTMLDivElement, SessionExpiryModalProps>(
  (
    {
      isOpen = true,
      remainingSeconds = 120,
      onExtendSession,
      onSignOut,
      className = "",
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    return (
      <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="expiry-title">
        <div ref={ref} className={`${styles.dialog} ${className}`} {...props}>
          <div className={styles.iconArea}>⏳</div>
          <h2 id="expiry-title" className={styles.title}>
            Session Timeout Warning
          </h2>
          <p className={styles.description}>
            For your security, your session will automatically terminate in{" "}
            <strong className={styles.countdown}>{formattedTime}</strong> due to inactivity.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={onSignOut}
            >
              Sign Out Now
            </button>
            <button
              type="button"
              className={styles.extendBtn}
              onClick={onExtendSession}
            >
              Stay Signed In
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SessionExpiryModal.displayName = "SessionExpiryModal";
