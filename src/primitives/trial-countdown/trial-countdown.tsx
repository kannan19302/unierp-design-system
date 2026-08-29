"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import styles from "./trial-countdown.module.css";

export interface TrialCountdownProps {
  endsAt: string | Date;
  className?: string;
  onExpired?: () => void;
}

function remainingParts(endsAt: Date, now: number) {
  const totalSeconds = Math.max(0, Math.floor((endsAt.getTime() - now) / 1000));
  return {
    totalSeconds,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** A second-accurate trial status with a stable, screen-reader-safe label. */
export const TrialCountdown: FC<TrialCountdownProps> = ({
  endsAt,
  className = "",
  onExpired,
}) => {
  const deadline = useMemo(() => new Date(endsAt), [endsAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const remaining = remainingParts(deadline, now);
  useEffect(() => {
    if (remaining.totalSeconds === 0) onExpired?.();
  }, [onExpired, remaining.totalSeconds]);

  if (!Number.isFinite(deadline.getTime())) return null;
  if (remaining.totalSeconds === 0) {
    return <span className={`${styles.expired} ${className}`.trim()}>Your Free Trial has ended.</span>;
  }

  const duration = `${remaining.days}d ${String(remaining.hours).padStart(2, "0")}h ${String(remaining.minutes).padStart(2, "0")}m ${String(remaining.seconds).padStart(2, "0")}s`;
  return (
    <span className={`${styles.container} ${className}`.trim()}>
      <span className="sr-only">Your Free Trial is active.</span>
      <span aria-hidden="true">Your Free Trial is active. You have </span>
      <time className={styles.time} dateTime={deadline.toISOString()} aria-label={`${remaining.days} days remaining`}>
        {duration}
      </time>
      <span aria-hidden="true"> left.</span>
    </span>
  );
};
