import styles from "./trust-bar.module.css";

export interface TrustBarBlockProps {
  title?: string;
  logos?: string[];
}

export function TrustBarBlock({
  title = "TRUSTED BY INNOVATIVE TEAMS WORLDWIDE",
  logos = ["Apex Dynamics", "Acme Global", "Nexus Capital", "Stratos AI"],
}: TrustBarBlockProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <p className={styles.title}>
        {title}
      </p>
      <div className={styles.logosWrap}>
        {logos.map((logo, i) => (
          <div
            key={i}
            className={styles.logoPlaceholder}
            title={logo}
          >
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}
