import { type FC, type ReactNode } from "react";
import { Breadcrumb } from "../components";
import styles from "./page-header.module.css";

export interface PageHeaderProps {
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  /**
   * Rendered above the title.
   *
   * This prop was declared on the interface from the beginning and never
   * destructured — the component accepted it, typechecked, and silently threw it
   * away. `domain-shell.tsx` and `tenants/provision/page.tsx` both passed it, so
   * the entire provider control plane rendered with no breadcrumbs at all,
   * against a brief (APP_FLOW §3) that calls them mandatory on every page with
   * every segment a link.
   *
   * The `: any` annotation on the old destructuring pattern is what hid it: it
   * suppressed the unused-property signal that would otherwise have surfaced.
   */
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
}) => {
  return (
    <div className={styles.root}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={styles.crumbs}>
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className={styles.title_row}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};
