import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, Sparkles } from 'lucide-react';
import styles from './header-onboarding-hud.module.css';

export interface OnboardingHUDItem {
  key: string;
  label: string;
  isCompleted: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface HeaderOnboardingHUDProps {
  items: OnboardingHUDItem[];
  title?: string;
  isLoading?: boolean;
  onItemAction?: (item: OnboardingHUDItem) => void;
  className?: string;
}

export const HeaderOnboardingHUD: React.FC<HeaderOnboardingHUDProps> = ({
  items,
  title = 'Setup Progress',
  isLoading = false,
  onItemAction,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (isLoading || totalCount === 0) {
    return null;
  }

  // All completed: show celebratory badge
  if (percent === 100) {
    return (
      <div className={`${styles.container} ${className}`.trim()} ref={containerRef}>
        <div className={styles.pill} title="All setup steps completed!">
          <Sparkles size={14} color="var(--color-primary)" />
          <span className={styles.title}>Workspace Ready</span>
        </div>
      </div>
    );
  }

  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`${styles.container} ${className}`.trim()} ref={containerRef}>
      <button
        type="button"
        className={`${styles.pill} ${isOpen ? styles.pillActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`${title}: ${percent}% completed, ${completedCount} of ${totalCount} items`}
      >
        <div className={styles.gaugeWrapper}>
          <svg className={styles.gaugeSvg} viewBox="0 0 18 18">
            <circle
              className={styles.gaugeBg}
              cx="9"
              cy="9"
              r={radius}
            />
            <circle
              className={styles.gaugeProgress}
              cx="9"
              cy="9"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        </div>
        <span className={styles.title}>{title}</span>
        <span className={styles.percent}>{percent}%</span>
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.drawer} role="dialog" aria-label={title}>
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>Workspace Setup</span>
            <span className={styles.drawerPercent}>{percent}% ({completedCount}/{totalCount})</span>
          </div>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.key} className={styles.item}>
                <div className={styles.itemLeft}>
                  {item.isCompleted ? (
                    <CheckCircle2 size={16} color="var(--color-success)" />
                  ) : (
                    <Circle size={16} color="var(--color-text-tertiary)" />
                  )}
                  <span className={item.isCompleted ? styles.itemCompleted : ''}>
                    {item.label}
                  </span>
                </div>
                {!item.isCompleted && (item.actionLabel || onItemAction) && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => onItemAction?.(item)}
                  >
                    {item.actionLabel || 'Complete'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
