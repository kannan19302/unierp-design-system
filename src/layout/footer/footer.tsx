"use client";

import { type FC, type ReactNode } from "react";
import styles from "./footer.module.css";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** product = compact single-line toolbar/footer; marketing = rich multi-column */
  variant?: "product" | "marketing";
  sections?: FooterSection[];
  legalLinks?: FooterLink[];
  copyright?: string;
  brandLogo?: ReactNode;
  tagline?: string;
  socialLinks?: ReactNode;
  className?: string;
}

/**
 * `<Footer>` — Universal footer component for Strata Workbench.
 *
 * Supports both product-level utility footers (single bar, legal + status links)
 * and marketing-level multi-column corporate footers.
 */
export const Footer: FC<FooterProps> = ({
  variant = "product",
  sections = [],
  legalLinks = [],
  copyright = `© ${new Date().getFullYear()} UniERP Inc. All rights reserved.`,
  brandLogo,
  tagline,
  socialLinks,
  className = "",
}) => {
  if (variant === "product") {
    return (
      <footer
        className={`${styles.productRoot} ${className}`.trim()}
        role="contentinfo"
      >
        <span className={styles.copyright}>{copyright}</span>
        {legalLinks.length > 0 && (
          <ul className={styles.legalList} role="list">
            {legalLinks.map((link) => (
              <li key={link.href} className={styles.legalItem}>
                <a
                  href={link.href}
                  className={styles.link}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </footer>
    );
  }

  return (
    <footer
      className={`${styles.marketingRoot} ${className}`.trim()}
      role="contentinfo"
    >
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandColumn}>
            {brandLogo && <div className={styles.logoWrapper}>{brandLogo}</div>}
            {tagline && <p className={styles.tagline}>{tagline}</p>}
            {socialLinks && <div className={styles.socials}>{socialLinks}</div>}
          </div>

          {sections.length > 0 && (
            <div className={styles.linksGrid}>
              {sections.map((sec) => (
                <div key={sec.title} className={styles.sectionColumn}>
                  <h3 className={styles.sectionTitle}>{sec.title}</h3>
                  <ul className={styles.linkList} role="list">
                    {sec.links.map((link) => (
                      <li key={link.href} className={styles.linkItem}>
                        <a
                          href={link.href}
                          className={styles.link}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.copyright}>{copyright}</span>
          {legalLinks.length > 0 && (
            <ul className={styles.legalList} role="list">
              {legalLinks.map((link) => (
                <li key={link.href} className={styles.legalItem}>
                  <a
                    href={link.href}
                    className={styles.link}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};
