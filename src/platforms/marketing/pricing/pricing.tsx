import styles from "./pricing.module.css";

export interface PlanItem {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface PricingBlockProps {
  title?: string;
  plans?: PlanItem[];
}

export function PricingBlock({
  title = "Simple, transparent pricing",
  plans = [
    {
      name: "Starter",
      price: "$29/mo",
      features: ["Up to 5 users", "Basic analytics", "24h support response"],
    },
    {
      name: "Pro",
      price: "$99/mo",
      features: [
        "Unlimited users",
        "Advanced reporting",
        "1h support response",
        "Custom domain",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Dedicated account manager",
        "SLA uptime guarantee",
        "SSO integration",
      ],
    },
  ],
}: PricingBlockProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.grid}>
          {plans.map((p, i) => (
            <div
              key={i}
              className={`${styles.planCard} ${p.recommended ? styles.planCardRecommended : ""}`}
            >
              {p.recommended && (
                <div className={styles.recommendedBadge}>
                  RECOMMENDED
                </div>
              )}
              <h3 className={styles.planName}>{p.name}</h3>
              <div className={styles.planPrice}>{p.price}</div>
              <ul className={styles.featureList}>
                {p.features.map((f, j) => (
                  <li key={j} className={styles.featureItem}>
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`${styles.selectBtn} ${!p.recommended ? styles.selectBtnSecondary : ""}`}
              >
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
