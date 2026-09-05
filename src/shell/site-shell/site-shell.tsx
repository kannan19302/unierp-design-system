"use client";

import { useState, type FC, type ReactNode } from "react";
import styles from "./site-shell.module.css";
import { Footer, type FooterSection, type FooterLink } from "../../layout/footer";

export interface SiteNavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteShellProps {
  /** Logo element or SVG mark */
  brandLogo?: ReactNode;
  /** Brand or organization name */
  brandName?: string;
  /** Primary navigation items */
  navItems: SiteNavItem[];
  /** Primary CTA button */
  ctaButton?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  /** Optional top banner or alert announcement */
  announcement?: ReactNode;
  /** Optional footer sections */
  footerSections?: FooterSection[];
  /** Optional footer legal links */
  legalLinks?: FooterLink[];
  /** Optional copyright string */
  copyright?: string;
  /** Main body content */
  children: ReactNode;
  className?: string;
}

/**
 * `<SiteShell>` — Full-suite tenant corporate website shell.
 *
 * Provides a responsive marketing masthead with sticky navigation,
 * mobile flyout menu, content container, and integrated multi-column footer.
 */
export const SiteShell: FC<SiteShellProps> = ({
  brandLogo,
  brandName = "UniERP Tenant",
  navItems,
  ctaButton,
  announcement,
  footerSections,
  legalLinks,
  copyright,
  children,
  className = "",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {/* ── Optional Top Announcement Banner ── */}
      {announcement && (
        <aside className={styles.announcement} aria-label="Announcement">
          <div className={styles.container}>{announcement}</div>
        </aside>
      )}

      {/* ── Sticky Masthead Navigation ── */}
      <header className={styles.masthead}>
        <div className={`${styles.container} ${styles.mastheadInner}`}>
          <div className={styles.brand}>
            {brandLogo ? (
              brandLogo
            ) : (
              <span className={styles.brandName}>{brandName}</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            <ul className={styles.navList} role="list">
              {navItems.map((item) => (
                <li key={item.href} className={styles.navItem}>
                  <a
                    href={item.href}
                    className={styles.navLink}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions & CTA */}
          <div className={styles.actions}>
            {ctaButton && (
              <a
                href={ctaButton.href}
                className={styles.ctaButton}
                onClick={ctaButton.onClick}
              >
                {ctaButton.label}
              </a>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              <span className={styles.srOnly}>
                {mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              </span>
              <span className={styles.hamburgerIcon} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-panel"
            className={styles.mobileNav}
            aria-label="Mobile Navigation"
          >
            <ul className={styles.mobileNavList} role="list">
              {navItems.map((item) => (
                <li key={item.href} className={styles.mobileNavItem}>
                  <a
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setMobileMenuOpen(false)}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            {ctaButton && (
              <div className={styles.mobileCtaWrapper}>
                <a
                  href={ctaButton.href}
                  className={styles.mobileCtaButton}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    ctaButton.onClick?.();
                  }}
                >
                  {ctaButton.label}
                </a>
              </div>
            )}
          </nav>
        )}
      </header>

      {/* ── Main Site Content ── */}
      <main className={styles.main}>{children}</main>

      {/* ── Integrated Footer ── */}
      <Footer
        variant="marketing"
        brandLogo={
          brandLogo || <span className={styles.brandName}>{brandName}</span>
        }
        sections={footerSections}
        legalLinks={legalLinks}
        copyright={copyright}
      />
    </div>
  );
};
