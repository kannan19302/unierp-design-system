import React, { useEffect, useRef, useState } from 'react';
import styles from './animated-counter.module.css';

export interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  /** Duration in seconds (compatibility alias for durationMs) */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function formatValue(value: number, decimals: number, prefix: string, suffix: string): string {
  return `${prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}

/**
 * Count-up number animation that respects prefers-reduced-motion and runs via requestAnimationFrame.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs,
  duration,
  className = '',
  style,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const effectiveDurationMs = durationMs ?? (duration !== undefined ? duration * 1000 : 1200);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDisplayValue(value);
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    if (prefersReducedMotion || effectiveDurationMs <= 0) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const startValue = 0;
    const diff = value - startValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / effectiveDurationMs, 1);

      // Ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, effectiveDurationMs]);

  return (
    <span
      ref={elementRef}
      className={`${styles.counter} ${className}`.trim()}
      style={style}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {formatValue(displayValue, decimals, prefix, suffix)}
    </span>
  );
};
