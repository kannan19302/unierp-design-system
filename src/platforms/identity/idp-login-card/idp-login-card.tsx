import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./idp-login-card.module.css";

export interface IdpLoginCardProps extends HTMLAttributes<HTMLDivElement> {
  tenantName?: string;
  tenantSlug?: string;
  title?: string;
  subtitle?: string;
  ssoButton?: ReactNode;
  footer?: ReactNode;
}

export const IdpLoginCard = forwardRef<HTMLDivElement, IdpLoginCardProps>(
  (
    {
      tenantName = "Acme Global Enterprise",
      tenantSlug = "acme",
      title = "Sign in to UniERP",
      subtitle = "Secure Enterprise Identity Access",
      ssoButton,
      footer,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${className}`}
        role="region"
        aria-label="Identity Authentication Portal"
        {...props}
      >
        <div className={styles.header}>
          <div className={styles.badge}>{tenantSlug}</div>
          <h2 className={styles.tenant}>{tenantName}</h2>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {ssoButton && <div className={styles.ssoSection}>{ssoButton}</div>}

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  }
);

IdpLoginCard.displayName = "IdpLoginCard";
