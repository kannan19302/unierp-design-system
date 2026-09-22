import styles from "./features-grid.module.css";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesGridBlockProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

export function FeaturesGridBlock({
  title = "Everything you need",
  subtitle = "Powerful features to help you manage your business faster.",
  features = [
    {
      title: "Lightning Fast",
      description:
        "Built on modern architecture to ensure sub-second response times.",
    },
    {
      title: "Bank-grade Security",
      description:
        "Your data is encrypted at rest and in transit with AES-256.",
    },
    {
      title: "Global Scale",
      description: "Deploy instantly to edge networks worldwide.",
    },
    {
      title: "24/7 Support",
      description: "Our team is always here to help you succeed.",
    },
  ],
}: FeaturesGridBlockProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.grid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.iconWrap}>{f.icon || "✦"}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
