import React from 'react';
import styles from './strata-app-grid.module.css';

export interface AppTile {
  icon: string | React.ReactNode;
  name: string;
  description: string;
  href: string;
}

export const DEFAULT_STRATA_APPS: AppTile[] = [
  { icon: 'F', name: 'Finance', description: 'Ledger & cash', href: '/finance' },
  { icon: 'C', name: 'CRM', description: 'Customers & pipeline', href: '/crm' },
  { icon: 'I', name: 'Inventory', description: 'Stock & fulfillment', href: '/inventory' },
  { icon: 'S', name: 'Sales', description: 'Orders & revenue', href: '/sales' },
  { icon: 'P', name: 'Projects', description: 'Plans & delivery', href: '/projects' },
  { icon: 'A', name: 'Analytics', description: 'Reports & insights', href: '/analytics' },
];

export interface StrataAppGridProps {
  apps?: AppTile[];
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>;
  className?: string;
}

/**
 * Strata v2 app grid — Multi-column icon tile grid with letter or icon glyphs.
 */
export const StrataAppGrid: React.FC<StrataAppGridProps> = ({
  apps = DEFAULT_STRATA_APPS,
  linkComponent: LinkComp,
  className = '',
}) => {
  return (
    <div className={`${styles.appGrid} ${className}`.trim()} role="navigation" aria-label="Applications">
      {apps.map((app) => {
        const content = (
          <>
            <span className={styles.appIcon} aria-hidden="true">{app.icon}</span>
            <strong className={styles.appTileLabel}>{app.name}</strong>
            <small className={styles.appTileDesc}>{app.description}</small>
          </>
        );

        if (LinkComp) {
          return (
            <LinkComp key={app.name} href={app.href} className={styles.appTile}>
              {content}
            </LinkComp>
          );
        }

        return (
          <a key={app.name} href={app.href} className={styles.appTile}>
            {content}
          </a>
        );
      })}
    </div>
  );
};
