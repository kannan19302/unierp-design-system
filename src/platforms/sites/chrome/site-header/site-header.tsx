import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./site-header.module.css";

export interface NavLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  brandName?: string;
  navLinks?: NavLinkItem[];
  ctaButton?: ReactNode;
}

export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(
  (
    {
      brandName = "UniERP",
      navLinks = [
        { label: "Product", href: "/product" },
        { label: "Solutions", href: "/solutions" },
        { label: "Pricing", href: "/pricing" },
        { label: "Documentation", href: "/docs" },
      ],
      ctaButton,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={`${styles.header} ${className}`}
        role="banner"
        {...props}
      >
        <div className={styles.container}>
          <div className={styles.brandArea}>
            <span className={styles.logoMark}>◆</span>
            <span className={styles.brandName}>{brandName}</span>
          </div>

          <nav className={styles.nav} aria-label="Main Navigation">
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href} className={styles.navItem}>
                  <a href={link.href} className={styles.navLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {ctaButton || (
              <a href="/login" className={styles.defaultCta}>
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>
    );
  }
);

SiteHeader.displayName = "SiteHeader";
