import { createElement, type ElementType, type ReactNode } from "react";
import styles from "./strata-app-grid.module.css";

export interface AppTile {
  id?: string;
  icon: ReactNode;
  name: string;
  description: string;
  href: string;
}

export interface StrataAppGridProps {
  apps: readonly AppTile[];
  linkComponent?: ElementType<{ href: string; className?: string; children?: ReactNode }>;
  label?: string;
  emptyMessage?: string;
}

/** A presentation-only grid of application links. The consumer supplies authorized items and routes. */
export function StrataAppGrid({
  apps,
  linkComponent = "a",
  label = "Applications",
  emptyMessage = "No applications are available.",
}: StrataAppGridProps) {
  if (apps.length === 0) {
    return <p className={styles.empty} role="status">{emptyMessage}</p>;
  }

  return (
    <nav aria-label={label} className={styles.root} data-slot="strata-app-grid">
      <ul className={styles.grid}>
        {apps.map((app) => (
          <li key={app.id ?? app.href} className={styles.item}>
            {createElement(
              linkComponent,
              { href: app.href, className: styles.link },
              <>
                <span className={styles.icon} aria-hidden="true">{app.icon}</span>
                <span className={styles.content}>
                  <span className={styles.name}>{app.name}</span>
                  <span className={styles.description}>{app.description}</span>
                </span>
              </>,
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
