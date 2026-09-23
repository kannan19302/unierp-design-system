import { forwardRef, type HTMLAttributes } from "react";
import styles from "./site-footer.module.css";

export interface SiteFooterSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  sections?: SiteFooterSection[];
  copyrightText?: string;
  systemStatus?: string;
}

export const SiteFooter = forwardRef<HTMLElement, SiteFooterProps>(
  (
    {
      sections = [
        {
          title: "Product",
          links: [
            { label: "Features", href: "/features" },
            { label: "Enterprise Security", href: "/security" },
            { label: "Integrations", href: "/integrations" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Documentation", href: "/docs" },
            { label: "API Reference", href: "/api" },
            { label: "Changelog", href: "/changelog" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About UniERP", href: "/about" },
            { label: "Compliance", href: "/compliance" },
            { label: "Privacy Policy", href: "/privacy" },
          ],
        },
      ],
      copyrightText = "© 2026 UniERP Inc. All rights reserved.",
      systemStatus = "All Systems Operational (99.99%)",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <footer
        ref={ref}
        className={`${styles.footer} ${className}`}
        role="contentinfo"
        {...props}
      >
        <div className={styles.container}>
          <div className={styles.grid}>
            {sections.map((sec) => (
              <div key={sec.title} className={styles.column}>
                <h4 className={styles.sectionTitle}>{sec.title}</h4>
                <ul className={styles.linkList}>
                  {sec.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={styles.link}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.bottomBar}>
            <span className={styles.copyright}>{copyrightText}</span>
            <div className={styles.status}>
              <span className={styles.statusBeacon} />
              <span className={styles.statusText}>{systemStatus}</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

SiteFooter.displayName = "SiteFooter";
