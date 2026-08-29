import styles from "./hero.module.css";

export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  primaryUrl?: string;
  secondaryUrl?: string;
  alignment?: "left" | "center";
}

export function HeroBlock({
  title = "Your Big Headline Here",
  subtitle = "This is a compelling subheadline that explains the value proposition clearly and concisely.",
  primaryCta = "Get Started",
  secondaryCta = "Learn More",
  primaryUrl = "#",
  secondaryUrl = "#",
  alignment = "center",
}: HeroBlockProps) {
  return (
    <section
      className={styles.section}
      style={{ textAlign: alignment }}
      aria-label="Hero"
    >
      <div
        className={styles.container}
        style={{
          margin: alignment === "center" ? "0 auto" : "0",
        }}
      >
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div
          className={styles.ctaGroup}
          style={{
            justifyContent: alignment === "center" ? "center" : "flex-start",
          }}
        >
          <a
            href={primaryUrl}
            className={styles.ctaPrimary}
          >
            {primaryCta}
          </a>
          <a
            href={secondaryUrl}
            className={styles.ctaSecondary}
          >
            {secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
