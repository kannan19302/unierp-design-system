"use client";

import {
  forwardRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import styles from "./project-card.module.css";

export type ProjectType = "website" | "app" | "workflow" | "api" | "component";
export type ProjectStatus = "live" | "draft" | "review" | "archived";

export interface ProjectCardProps {
  /** Unique identifier for the project */
  id: string;
  /** Primary title of the project */
  title: string;
  /** Optional summary or description */
  description?: string;
  /** Custom icon or preview graphic displayed in the header icon box */
  icon?: ReactNode;
  /** Category type badge */
  type?: ProjectType;
  /** Deployment or editorial status */
  status?: ProjectStatus;
  /** Friendly formatted last-modified time e.g. "Updated 2h ago" */
  lastUpdated?: string;
  /** Author or contributor info */
  author?: {
    name: string;
    avatarUrl?: string;
  };
  /** Semantic version string e.g. "v1.4.2" */
  version?: string;
  /** Callback when card is clicked or activated via keyboard */
  onClick?: () => void;
  /** Callback specifically when "Open Studio" or primary button is clicked */
  onOpen?: () => void;
  /** Custom action slot (e.g. context menu or dropdown trigger) */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const TYPE_LABELS: Record<ProjectType, string> = {
  website: "Website",
  app: "Application",
  workflow: "Workflow",
  api: "API Service",
  component: "Component Library",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  draft: "Draft",
  review: "In Review",
  archived: "Archived",
};

/**
 * `<ProjectCard>` — Quick-resume workspace card for Developer Platform projects.
 *
 * @maturity stable
 *
 * Implements the Strata Design Language project card with:
 * - Brand icon indicator box
 * - Type badge and deployment status pill
 * - Contextual metadata row with author and timestamp
 * - Full WCAG 2.2 AA keyboard navigation (Enter / Space activation)
 */
export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(
  (
    {
      id,
      title,
      description,
      icon,
      type = "app",
      status = "live",
      lastUpdated,
      author,
      version,
      onClick,
      onOpen,
      actions,
      className,
      style,
    },
    ref,
  ) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    };

    const handleOpenClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onOpen ? onOpen() : onClick?.();
    };

    const cardClasses = [
      styles.card,
      onClick ? styles.clickable : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <article
        ref={ref}
        id={`project-card-${id}`}
        className={cardClasses}
        style={style}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={`Project: ${title}`}
      >
        <div className={styles.header}>
          <div className={styles.headerLead}>
            <div className={styles.iconBox} aria-hidden="true">
              {icon ?? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              )}
            </div>
            <div>
              <div className={styles.badgeRow}>
                <span className={`${styles.typeBadge} ${styles[type]}`}>
                  {TYPE_LABELS[type]}
                </span>
                <span className={`${styles.statusBadge} ${styles[status]}`}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  {STATUS_LABELS[status]}
                </span>
              </div>
              <h3 className={styles.title}>{title}</h3>
            </div>
          </div>
          {actions && (
            <div
              className={styles.actions}
              onClick={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.footer}>
          <div className={styles.meta}>
            {version && <span className={styles.version}>{version}</span>}
            {lastUpdated && (
              <span className={styles.lastUpdated}>{lastUpdated}</span>
            )}
            {author && (
              <span className={styles.author}>by {author.name}</span>
            )}
          </div>
          <button
            type="button"
            className={styles.openButton}
            onClick={handleOpenClick}
            aria-label={`Open studio for ${title}`}
          >
            <span>Open Studio</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </article>
    );
  },
);

ProjectCard.displayName = "ProjectCard";
