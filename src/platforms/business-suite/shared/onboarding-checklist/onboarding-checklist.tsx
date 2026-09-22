import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import styles from './onboarding-checklist.module.css';

export interface OnboardingChecklistItem {
  key: string;
  title: string;
  description: string;
  isCompleted: boolean;
  actionLabel?: string;
  href?: string;
}

export interface OnboardingChecklistProps {
  items: OnboardingChecklistItem[];
  title?: string;
  onItemAction?: (item: OnboardingChecklistItem) => void;
  className?: string;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  items,
  title = 'Get Started with UniERP',
  onItemAction,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (totalCount === 0) return null;

  return (
    <section
      className={`${styles.widget} ${className}`.trim()}
      aria-labelledby="onboarding-checklist-title"
    >
      <div
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className={styles.titleArea}>
          <Sparkles size={16} color="var(--color-primary)" aria-hidden="true" />
          <h2 id="onboarding-checklist-title" className={styles.title}>
            {title}
          </h2>
          <span className={styles.badge}>
            {completedCount} of {totalCount} completed ({progressPercent}%)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} color="var(--color-text-secondary)" aria-hidden="true" />
        ) : (
          <ChevronDown size={16} color="var(--color-text-secondary)" aria-hidden="true" />
        )}
      </div>

      <div
        className={styles.progressBg}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress`}
      >
        <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
      </div>

      {isExpanded && (
        <ul className={styles.itemsList}>
          {items.map((item) => (
            <li
              key={item.key}
              className={`${styles.card} ${item.isCompleted ? styles.cardCompleted : ''}`}
            >
              {item.isCompleted ? (
                <CheckCircle2 size={18} color="var(--color-success)" aria-hidden="true" />
              ) : (
                <Circle size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
              )}
              <div className={styles.cardBody}>
                <span className={styles.cardTitle}>{item.title}</span>
                <span className={styles.cardDesc}>{item.description}</span>
                {!item.isCompleted && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemAction?.(item);
                    }}
                  >
                    {item.actionLabel || 'Start task'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
